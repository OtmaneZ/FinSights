"""
TRESORIS - Google Calendar Integration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Endpoints pour synchroniser trésorerie avec Google Calendar.
Crée événements pour:
- Echéances factures clients
- Alertes trésorerie
- Actions recommandées
- Réunions DAF importantes

Endpoints:
- POST /calendar/events/create           → Crée événement calendrier
- POST /calendar/sync/invoices          → Sync échéances factures
- POST /calendar/sync/alerts            → Sync alertes trésorerie
- GET  /calendar/events/list            → Liste événements
- PUT  /calendar/events/{event_id}      → Mise a jour événement
- DELETE /calendar/events/{event_id}    → Supprime événement
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import os

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from dotenv import load_dotenv
from services.google_auth_service import get_google_auth
from googleapiclient.errors import HttpError

load_dotenv()

router = APIRouter(prefix="/api/v1", tags=["Calendar Integration"])


# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class EventType(str, Enum):
    """Types d'événements calendrier"""
    INVOICE_DUE = "invoice_due"
    ALERT_CASH_LOW = "alert_cash_low"
    ALERT_CLIENT_RISK = "alert_client_risk"
    ACTION_RECOMMENDED = "action_recommended"
    DAF_MEETING = "daf_meeting"
    PAYMENT_EXPECTED = "payment_expected"
    CUSTOM = "custom"


class CalendarEvent(BaseModel):
    """Événement calendrier"""
    event_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    event_type: EventType
    start_time: str  # ISO 8601 format
    end_time: Optional[str] = None
    location: Optional[str] = None
    attendees: Optional[List[str]] = None
    reminder_minutes: int = 60
    color_id: Optional[str] = None  # Pour code couleur Google Calendar
    metadata: Optional[Dict[str, Any]] = None


class CreateCalendarEventRequest(BaseModel):
    """Requete pour creer un evenement"""
    title: str
    description: Optional[str] = None
    event_type: EventType
    start_time: str
    end_time: Optional[str] = None
    location: Optional[str] = None
    attendees: Optional[List[str]] = None
    reminder_minutes: int = 60
    color_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    calendar_id: str = "primary"


class SyncInvoicesRequest(BaseModel):
    """Requete pour synchroniser echéances factures"""
    spreadsheet_id: Optional[str] = None
    days_ahead: int = 90
    min_amount: float = 0
    auto_create_events: bool = True
    calendar_id: str = "primary"


class SyncAlertsRequest(BaseModel):
    """Requete pour synchroniser alertes trésorerie"""
    alert_types: List[str]
    days_ahead: int = 30
    auto_create_events: bool = True
    calendar_id: str = "primary"


class UpdateEventRequest(BaseModel):
    """Requete pour mettre a jour un evenement"""
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    location: Optional[str] = None
    attendees: Optional[List[str]] = None
    reminder_minutes: Optional[int] = None
    color_id: Optional[str] = None


class EventResponse(BaseModel):
    """Reponse apres creation/update"""
    event_id: str
    title: str
    event_type: EventType
    start_time: str
    status: str
    google_calendar_url: str
    message: str


# ═══════════════════════════════════════════════════════════════════════════════
# STORAGE (in-memory pour demo)
# ═══════════════════════════════════════════════════════════════════════════════

class CalendarStorage:
    """Gestion des evenements calendrier"""
    
    def __init__(self):
        self._events: Dict[str, Dict] = {}
        self._event_counter = 1
        self._calendar_colors = {
            "grey": "0",
            "blue": "1",
            "green": "2",
            "red": "3",
            "orange": "5",
            "yellow": "6"
        }
    
    def create_event(
        self,
        title: str,
        event_type: EventType,
        start_time: str,
        description: Optional[str] = None,
        end_time: Optional[str] = None,
        location: Optional[str] = None,
        attendees: Optional[List[str]] = None,
        reminder_minutes: int = 60,
        color_id: Optional[str] = None,
        metadata: Optional[Dict] = None,
        calendar_id: str = "primary"
    ) -> str:
        """Crée un nouvel événement"""
        event_id = f"evt_{self._event_counter:06d}"
        self._event_counter += 1
        
        self._events[event_id] = {
            "event_id": event_id,
            "title": title,
            "description": description,
            "event_type": event_type.value,
            "start_time": start_time,
            "end_time": end_time or self._calculate_end_time(start_time),
            "location": location,
            "attendees": attendees or [],
            "reminder_minutes": reminder_minutes,
            "color_id": color_id,
            "metadata": metadata or {},
            "calendar_id": calendar_id,
            "created_at": datetime.now().isoformat(),
            "status": "created"
        }
        
        return event_id
    
    def get_event(self, event_id: str) -> Optional[Dict]:
        """Récupère un événement"""
        return self._events.get(event_id)
    
    def update_event(self, event_id: str, **kwargs) -> bool:
        """Met à jour un événement"""
        if event_id not in self._events:
            return False
        
        # Filtrer les clés valides
        valid_keys = ["title", "description", "start_time", "end_time", "location", 
                     "attendees", "reminder_minutes", "color_id"]
        
        for key, value in kwargs.items():
            if key in valid_keys and value is not None:
                self._events[event_id][key] = value
        
        self._events[event_id]["updated_at"] = datetime.now().isoformat()
        return True
    
    def delete_event(self, event_id: str) -> bool:
        """Supprime un événement"""
        if event_id in self._events:
            del self._events[event_id]
            return True
        return False
    
    def list_events(
        self,
        calendar_id: str = "primary",
        event_type: Optional[str] = None,
        start_time_from: Optional[str] = None,
        start_time_to: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict]:
        """Liste les événements avec filtres"""
        events = [e for e in self._events.values() if e["calendar_id"] == calendar_id]
        
        if event_type:
            events = [e for e in events if e["event_type"] == event_type]
        
        if start_time_from:
            events = [e for e in events if e["start_time"] >= start_time_from]
        
        if start_time_to:
            events = [e for e in events if e["start_time"] <= start_time_to]
        
        events.sort(key=lambda e: e["start_time"])
        return events[:limit]
    
    def _calculate_end_time(self, start_time: str, duration_minutes: int = 60) -> str:
        """Calcule heure de fin par defaut"""
        try:
            start = datetime.fromisoformat(start_time)
            end = start + timedelta(minutes=duration_minutes)
            return end.isoformat()
        except:
            return start_time


calendar_storage = CalendarStorage()


# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE CALENDAR SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class GoogleCalendarService:
    """Service pour interagir avec Google Calendar API"""
    
    def __init__(self):
        self.auth = get_google_auth()
        self.calendar_service = None
    
    def _get_calendar_service(self):
        """Lazy load du service Calendar"""
        if self.calendar_service is None:
            self.calendar_service = self.auth.get_calendar_service()
        return self.calendar_service
    
    async def create_event(
        self,
        calendar_id: str,
        title: str,
        start_time: str,
        end_time: str,
        description: Optional[str] = None,
        location: Optional[str] = None,
        attendees: Optional[List[str]] = None,
        reminder_minutes: int = 60
    ) -> str:
        """
        Crée un événement dans Google Calendar.
        
        Args:
            calendar_id: ID du calendrier (ou "primary")
            title: Titre événement
            start_time: Heure debut (ISO 8601)
            end_time: Heure fin (ISO 8601)
            description: Description optionnelle
            location: Localisation optionnelle
            attendees: Liste emails invités
            reminder_minutes: Minutes avant rappel
            
        Returns:
            Event ID Google Calendar
        """
        try:
            calendar = self._get_calendar_service()
            
            # Construire l'événement
            event_body = {
                'summary': title,
                'start': {
                    'dateTime': start_time,
                    'timeZone': 'Europe/Paris',
                },
                'end': {
                    'dateTime': end_time,
                    'timeZone': 'Europe/Paris',
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'popup', 'minutes': reminder_minutes},
                    ],
                },
            }
            
            if description:
                event_body['description'] = description
            
            if location:
                event_body['location'] = location
            
            if attendees:
                event_body['attendees'] = [{'email': email} for email in attendees]
            
            # Créer l'événement via Calendar API
            created_event = calendar.events().insert(
                calendarId=calendar_id,
                body=event_body
            ).execute()
            
            event_id = created_event.get('id')
            print(f"✅ Événement calendrier créé: {title} (ID: {event_id})")
            
            return event_id
        except HttpError as e:
            raise HTTPException(status_code=500, detail=f"Error creating calendar event: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating calendar event: {str(e)}")
    
    async def update_event(
        self,
        calendar_id: str,
        event_id: str,
        **kwargs
    ) -> bool:
        """Met à jour un événement Google Calendar"""
        try:
            calendar = self._get_calendar_service()
            
            # Récupérer événement existant
            event = calendar.events().get(
                calendarId=calendar_id,
                eventId=event_id
            ).execute()
            
            # Mettre à jour les champs fournis
            if 'title' in kwargs:
                event['summary'] = kwargs['title']
            if 'description' in kwargs:
                event['description'] = kwargs['description']
            if 'start_time' in kwargs:
                event['start']['dateTime'] = kwargs['start_time']
            if 'end_time' in kwargs:
                event['end']['dateTime'] = kwargs['end_time']
            
            # Sauvegarder
            calendar.events().update(
                calendarId=calendar_id,
                eventId=event_id,
                body=event
            ).execute()
            
            print(f"✅ Événement mis à jour: {event_id}")
            return True
        except HttpError as e:
            raise HTTPException(status_code=500, detail=f"Error updating event: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating event: {str(e)}")
    
    async def delete_event(
        self,
        calendar_id: str,
        event_id: str
    ) -> bool:
        """Supprime un événement"""
        try:
            calendar = self._get_calendar_service()
            
            calendar.events().delete(
                calendarId=calendar_id,
                eventId=event_id
            ).execute()
            
            print(f"✅ Événement supprimé: {event_id}")
            return True
        except HttpError as e:
            raise HTTPException(status_code=500, detail=f"Error deleting event: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting event: {str(e)}")


google_calendar_service = GoogleCalendarService()


# ═══════════════════════════════════════════════════════════════════════════════
# SYNC ENGINES (pour remplir calendrier depuis TRESORIS data)
# ═══════════════════════════════════════════════════════════════════════════════

class InvoiceSyncEngine:
    """Synchronise échéances factures vers calendrier"""
    
    @staticmethod
    async def sync_from_sheet(
        spreadsheet_id: Optional[str],
        days_ahead: int = 90,
        min_amount: float = 0
    ) -> List[Dict]:
        """
        Récupère factures du Sheet et crée événements.
        
        NOTE: En prod, intégrer avec gsheet_router pour lire les données
        """
        events_created = []
        
        # Exemple data (en prod, venir du Sheet)
        sample_invoices = [
            {
                "client": "Acme Corp",
                "amount": 15000,
                "due_date": (datetime.now() + timedelta(days=14)).isoformat(),
                "invoice_number": "INV-001"
            },
            {
                "client": "TechStart Inc",
                "amount": 8500,
                "due_date": (datetime.now() + timedelta(days=21)).isoformat(),
                "invoice_number": "INV-002"
            }
        ]
        
        for invoice in sample_invoices:
            if invoice["amount"] >= min_amount:
                due_date = datetime.fromisoformat(invoice["due_date"])
                if due_date <= datetime.now() + timedelta(days=days_ahead):
                    event_id = calendar_storage.create_event(
                        title=f"Facture due: {invoice['client']} ({invoice['invoice_number']})",
                        event_type=EventType.INVOICE_DUE,
                        start_time=invoice["due_date"],
                        description=f"Montant: EUR {invoice['amount']:,.2f}",
                        metadata={
                            "invoice_number": invoice["invoice_number"],
                            "client": invoice["client"],
                            "amount": invoice["amount"]
                        }
                    )
                    events_created.append(event_id)
        
        return events_created


class AlertSyncEngine:
    """Synchronise alertes trésorerie vers calendrier"""
    
    @staticmethod
    async def sync_alerts(
        alert_types: List[str],
        days_ahead: int = 30
    ) -> List[Dict]:
        """Crée événements calendrier pour alertes importants"""
        events_created = []
        
        # Exemple (en prod, récupérer depuis alert_storage)
        if "cash_low" in alert_types:
            event_id = calendar_storage.create_event(
                title="ALERTE: Trésorerie faible",
                event_type=EventType.ALERT_CASH_LOW,
                start_time=datetime.now().isoformat(),
                description="Revue trésorerie critique",
                color_id="red",
                reminder_minutes=120
            )
            events_created.append(event_id)
        
        return events_created


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/calendar/events/create", response_model=EventResponse)
async def create_calendar_event(
    request: CreateCalendarEventRequest,
    api_key: Optional[str] = Header(None)
) -> EventResponse:
    """Crée un nouvel événement calendrier"""
    try:
        # Créer dans storage local
        event_id = calendar_storage.create_event(
            title=request.title,
            event_type=request.event_type,
            start_time=request.start_time,
            end_time=request.end_time,
            description=request.description,
            location=request.location,
            attendees=request.attendees,
            reminder_minutes=request.reminder_minutes,
            color_id=request.color_id,
            metadata=request.metadata,
            calendar_id=request.calendar_id
        )
        
        # Créer dans Google Calendar
        google_event_id = await google_calendar_service.create_event(
            calendar_id=request.calendar_id,
            title=request.title,
            start_time=request.start_time,
            end_time=request.end_time or calendar_storage._calculate_end_time(request.start_time),
            description=request.description,
            location=request.location,
            attendees=request.attendees,
            reminder_minutes=request.reminder_minutes
        )
        
        return EventResponse(
            event_id=event_id,
            title=request.title,
            event_type=request.event_type,
            start_time=request.start_time,
            status="created",
            google_calendar_url=f"https://calendar.google.com/calendar/u/0?cid=gce_{google_event_id}",
            message=f"Event '{request.title}' created successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating event: {str(e)}")


@router.post("/calendar/sync/invoices")
async def sync_invoices_to_calendar(
    request: SyncInvoicesRequest,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """Synchronise échéances factures vers calendrier"""
    try:
        events_created = await InvoiceSyncEngine.sync_from_sheet(
            spreadsheet_id=request.spreadsheet_id,
            days_ahead=request.days_ahead,
            min_amount=request.min_amount
        )
        
        return {
            "status": "synced",
            "events_created": len(events_created),
            "event_ids": events_created,
            "message": f"Synced {len(events_created)} invoice due dates to calendar"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error syncing invoices: {str(e)}")


@router.post("/calendar/sync/alerts")
async def sync_alerts_to_calendar(
    request: SyncAlertsRequest,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """Synchronise alertes trésorerie vers calendrier"""
    try:
        events_created = await AlertSyncEngine.sync_alerts(
            alert_types=request.alert_types,
            days_ahead=request.days_ahead
        )
        
        return {
            "status": "synced",
            "events_created": len(events_created),
            "event_ids": events_created,
            "message": f"Synced {len(events_created)} alerts to calendar"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error syncing alerts: {str(e)}")


@router.get("/calendar/events/list")
async def list_calendar_events(
    calendar_id: str = "primary",
    event_type: Optional[str] = None,
    start_time_from: Optional[str] = None,
    start_time_to: Optional[str] = None,
    limit: int = 100,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """Liste les événements calendrier"""
    try:
        events = calendar_storage.list_events(
            calendar_id=calendar_id,
            event_type=event_type,
            start_time_from=start_time_from,
            start_time_to=start_time_to,
            limit=limit
        )
        
        return {
            "total": len(events),
            "calendar_id": calendar_id,
            "events": events
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing events: {str(e)}")


@router.put("/calendar/events/{event_id}")
async def update_calendar_event(
    event_id: str,
    request: UpdateEventRequest,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """Met à jour un événement calendrier"""
    try:
        event = calendar_storage.get_event(event_id)
        if not event:
            raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
        
        # Mettre a jour dans storage
        calendar_storage.update_event(
            event_id,
            title=request.title,
            description=request.description,
            start_time=request.start_time,
            end_time=request.end_time,
            location=request.location,
            attendees=request.attendees,
            reminder_minutes=request.reminder_minutes,
            color_id=request.color_id
        )
        
        # Mettre a jour dans Google Calendar
        await google_calendar_service.update_event(
            calendar_id=event["calendar_id"],
            event_id=event_id,
            **request.dict(exclude_none=True)
        )
        
        return {
            "event_id": event_id,
            "status": "updated",
            "message": "Event updated successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating event: {str(e)}")


@router.delete("/calendar/events/{event_id}")
async def delete_calendar_event(
    event_id: str,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """Supprime un événement calendrier"""
    try:
        event = calendar_storage.get_event(event_id)
        if not event:
            raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
        
        # Supprimer du storage
        calendar_storage.delete_event(event_id)
        
        # Supprimer de Google Calendar
        await google_calendar_service.delete_event(
            calendar_id=event["calendar_id"],
            event_id=event_id
        )
        
        return {
            "event_id": event_id,
            "status": "deleted",
            "message": "Event deleted successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting event: {str(e)}")
