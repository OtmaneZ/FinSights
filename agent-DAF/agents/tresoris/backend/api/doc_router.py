"""
TRESORIS - Google Docs Report Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Endpoints pour générer rapports financiers avec Google Docs API.
Crée documents personnalisés, les remplit avec données TRESORIS, et les exporte en PDF/Word.

Endpoints:
- POST /reports/generate          → Crée nouveau rapport financier
- GET  /reports/{report_id}       → Récupère métadonnées rapport
- POST /reports/{report_id}/export → Export PDF/Word
- GET  /reports/list              → Liste tous les rapports générés
- POST /reports/{report_id}/share → Partage rapport avec utilisateurs
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from pathlib import Path
import os
import json
import io

from fastapi import APIRouter, HTTPException, Header, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import httpx

# Import credentials helper
from dotenv import load_dotenv
from services.google_auth_service import get_google_auth
from googleapiclient.errors import HttpError

load_dotenv()

router = APIRouter(prefix="/api/v1", tags=["Report Generation"])


# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class ReportMetadata(BaseModel):
    """Métadonnées d'un rapport"""
    report_id: str
    title: str
    created_at: str
    updated_at: str
    report_type: str  # "cash_flow" | "margin_analysis" | "risk_summary" | "full_dashboard"
    spreadsheet_id: Optional[str] = None
    google_doc_id: Optional[str] = None
    status: str  # "draft" | "generated" | "exported"
    file_format: Optional[str] = None  # "pdf" | "docx" | "gdoc"


class GenerateReportRequest(BaseModel):
    """Requête pour générer un rapport"""
    report_type: str  # "cash_flow" | "margin_analysis" | "risk_summary" | "full_dashboard"
    title: Optional[str] = None
    description: Optional[str] = None
    spreadsheet_id: Optional[str] = None  # Pour récupérer les données
    include_charts: bool = True
    include_recommendations: bool = True
    date_range: Optional[Dict[str, str]] = None  # {"from": "2025-01-01", "to": "2025-12-31"}
    language: str = "fr"  # "fr" | "en"


class ExportReportRequest(BaseModel):
    """Requête pour exporter un rapport"""
    format: str  # "pdf" | "docx"
    include_metadata: bool = True
    filename: Optional[str] = None


class ShareReportRequest(BaseModel):
    """Requête pour partager un rapport"""
    emails: List[str]
    role: str = "viewer"  # "viewer" | "commenter" | "editor"
    send_notification: bool = True
    message: Optional[str] = None


class ReportResponse(BaseModel):
    """Réponse après génération rapport"""
    report_id: str
    title: str
    google_doc_id: str
    status: str
    url: str
    created_at: str
    message: str


class ReportListResponse(BaseModel):
    """Liste des rapports"""
    total: int
    reports: List[ReportMetadata]


# ═══════════════════════════════════════════════════════════════════════════════
# STORAGE (in-memory pour démo, remplacer par DB en prod)
# ═══════════════════════════════════════════════════════════════════════════════

class ReportStorage:
    """Gestion des rapports générés"""
    
    def __init__(self):
        self._reports: Dict[str, Dict[str, Any]] = {}
        self._report_counter = 1
    
    def create_report(
        self,
        title: str,
        report_type: str,
        spreadsheet_id: Optional[str] = None,
        description: Optional[str] = None
    ) -> str:
        """Crée une nouvelle entrée rapport"""
        report_id = f"rep_{self._report_counter:06d}"
        self._report_counter += 1
        
        self._reports[report_id] = {
            "report_id": report_id,
            "title": title,
            "report_type": report_type,
            "description": description,
            "spreadsheet_id": spreadsheet_id,
            "google_doc_id": None,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "status": "draft",
            "file_format": None,
            "exported_files": []
        }
        
        return report_id
    
    def get_report(self, report_id: str) -> Optional[Dict]:
        """Récupère un rapport"""
        return self._reports.get(report_id)
    
    def update_report(self, report_id: str, **kwargs):
        """Met à jour un rapport"""
        if report_id in self._reports:
            self._reports[report_id].update(kwargs)
            self._reports[report_id]["updated_at"] = datetime.now().isoformat()
    
    def list_reports(self) -> List[Dict]:
        """Liste tous les rapports"""
        return list(self._reports.values())


# Instance globale
report_storage = ReportStorage()


# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE DOCS SERVICE
# ═══════════════════════════════════════════════════════════════════════════════

class GoogleDocsService:
    """Service pour interagir avec Google Docs API"""
    
    def __init__(self):
        self.auth = get_google_auth()
        self.docs_service = None
        self.drive_service = None
    
    def _get_docs_service(self):
        """Lazy load du service Docs"""
        if self.docs_service is None:
            self.docs_service = self.auth.get_docs_service()
        return self.docs_service
    
    def _get_drive_service(self):
        """Lazy load du service Drive"""
        if self.drive_service is None:
            self.drive_service = self.auth.get_drive_service()
        return self.drive_service
    
    async def create_document(self, title: str) -> str:
        """
        Crée un nouveau Google Doc vide et retourne son ID.
        
        Args:
            title: Titre du document
            
        Returns:
            Document ID
        """
        try:
            docs = self._get_docs_service()
            document = docs.documents().create(body={'title': title}).execute()
            doc_id = document.get('documentId')
            print(f"✅ Document créé: {title} (ID: {doc_id})")
            return doc_id
        except HttpError as e:
            raise HTTPException(status_code=500, detail=f"Error creating document: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating document: {str(e)}")
    
    async def insert_content(self, doc_id: str, content: List[Dict]) -> bool:
        """
        Insère du contenu dans un document existant.
        
        Args:
            doc_id: ID du document
            content: Liste d'éléments (texte, tableaux, graphiques)
            
        Returns:
            True si succès
        """
        try:
            docs = self._get_docs_service()
            
            # Construire les requêtes d'insertion
            requests = []
            
            for item in content:
                if item.get('type') == 'paragraph':
                    requests.append({
                        'insertText': {
                            'location': {'index': 1},
                            'text': item.get('text', '') + '\n'
                        }
                    })
                elif item.get('type') == 'heading':
                    requests.append({
                        'insertText': {
                            'location': {'index': 1},
                            'text': item.get('text', '') + '\n'
                        }
                    })
                    # Style comme heading
                    requests.append({
                        'updateParagraphStyle': {
                            'range': {
                                'startIndex': 1,
                                'endIndex': len(item.get('text', '')) + 2
                            },
                            'paragraphStyle': {
                                'namedStyleType': 'HEADING_1'
                            },
                            'fields': 'namedStyleType'
                        }
                    })
            
            # Exécuter toutes les requêtes
            if requests:
                docs.documents().batchUpdate(
                    documentId=doc_id,
                    body={'requests': requests}
                ).execute()
                print(f"✅ Contenu inséré dans document {doc_id}")
            
            return True
        except HttpError as e:
            raise HTTPException(status_code=500, detail=f"Error inserting content: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error inserting content: {str(e)}")
    
    async def export_document(self, doc_id: str, format: str) -> bytes:
        """
        Exporte un document en PDF ou DOCX.
        
        Args:
            doc_id: ID du document
            format: "pdf" ou "docx"
            
        Returns:
            Contenu du fichier en bytes
        """
        try:
            drive = self._get_drive_service()
            
            mime_type = {
                "pdf": "application/pdf",
                "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }.get(format, "application/pdf")
            
            # Export via Drive API
            request = drive.files().export_media(fileId=doc_id, mimeType=mime_type)
            file_content = request.execute()
            
            print(f"✅ Document exporté: {doc_id} ({format})")
            return file_content
        except HttpError as e:
            raise HTTPException(status_code=500, detail=f"Error exporting document: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error exporting document: {str(e)}")
    
    async def share_document(
        self,
        doc_id: str,
        emails: List[str],
        role: str = "viewer",
        send_notification: bool = True
    ) -> bool:
        """
        Partage un document avec des utilisateurs.
        
        Args:
            doc_id: ID du document
            emails: Liste d'emails
            role: "viewer" | "commenter" | "editor"
            send_notification: Envoyer email notification
            
        Returns:
            True si succès
        """
        try:
            drive = self._get_drive_service()
            
            # Mapper les rôles
            role_map = {
                'viewer': 'reader',
                'commenter': 'commenter',
                'editor': 'writer'
            }
            google_role = role_map.get(role, 'reader')
            
            # Partager avec chaque email
            for email in emails:
                permission = {
                    'type': 'user',
                    'role': google_role,
                    'emailAddress': email
                }
                
                drive.permissions().create(
                    fileId=doc_id,
                    body=permission,
                    sendNotificationEmail=send_notification
                ).execute()
                
                print(f"✅ Document partagé avec {email} (role: {google_role})")
            
            return True
        except HttpError as e:
            raise HTTPException(status_code=500, detail=f"Error sharing document: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error sharing document: {str(e)}")


google_docs_service = GoogleDocsService()


# ═══════════════════════════════════════════════════════════════════════════════
# REPORT GENERATORS (Templates pour différents types de rapports)
# ═══════════════════════════════════════════════════════════════════════════════

class ReportGenerator:
    """Génère contenu rapport basé sur type et données TRESORIS"""
    
    @staticmethod
    def generate_cash_flow_report(
        data: Dict[str, Any],
        language: str = "fr"
    ) -> List[Dict]:
        """
        Génère le contenu d'un rapport de trésorerie.
        
        Args:
            data: Données financières du Sheet/Engine
            language: "fr" ou "en"
            
        Returns:
            Liste d'éléments de document (titres, paragraphes, tableaux, etc.)
        """
        content = []
        
        if language == "fr":
            content.append({
                "type": "title",
                "text": "Rapport de Trésorerie"
            })
            content.append({
                "type": "subtitle",
                "text": f"Généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}"
            })
            content.append({
                "type": "paragraph",
                "text": "Analyse complète de la position de trésorerie avec projections et recommandations."
            })
        else:
            content.append({
                "type": "title",
                "text": "Treasury Report"
            })
            content.append({
                "type": "subtitle",
                "text": f"Generated on {datetime.now().strftime('%m/%d/%Y at %H:%M')}"
            })
        
        # Section exécutive
        content.append({
            "type": "heading2",
            "text": "Executive Summary" if language == "en" else "Résumé Exécutif"
        })
        content.append({
            "type": "table",
            "data": {
                "headers": ["KPI", "Valeur"] if language == "fr" else ["KPI", "Value"],
                "rows": [
                    ["Trésorerie actuelle", f"€{data.get('current_cash', 0):,.2f}"],
                    ["Encours clients", f"€{data.get('client_receivables', 0):,.2f}"],
                    ["Dettes", f"€{data.get('liabilities', 0):,.2f}"],
                    ["Runway (jours)", f"{data.get('runway_days', 0):.0f}"]
                ]
            }
        })
        
        return content
    
    @staticmethod
    def generate_margin_analysis_report(
        data: Dict[str, Any],
        language: str = "fr"
    ) -> List[Dict]:
        """Génère rapport analyse marges"""
        content = []
        
        title = "Rapport d'Analyse des Marges" if language == "fr" else "Margin Analysis Report"
        content.append({"type": "title", "text": title})
        content.append({
            "type": "paragraph",
            "text": data.get("summary", "Analyse détaillée des marges par client et produit.")
        })
        
        return content
    
    @staticmethod
    def generate_risk_summary_report(
        data: Dict[str, Any],
        language: str = "fr"
    ) -> List[Dict]:
        """Génère rapport résumé risques"""
        content = []
        
        title = "Rapport de Résumé des Risques" if language == "fr" else "Risk Summary Report"
        content.append({"type": "title", "text": title})
        
        return content
    
    @staticmethod
    def generate_full_dashboard_report(
        data: Dict[str, Any],
        language: str = "fr"
    ) -> List[Dict]:
        """Génère rapport complet dashboard"""
        content = []
        
        title = "Rapport de Dashboard Complet" if language == "fr" else "Complete Dashboard Report"
        content.append({"type": "title", "text": title})
        
        return content


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/reports/generate", response_model=ReportResponse)
async def generate_report(
    request: GenerateReportRequest,
    api_key: Optional[str] = Header(None)
) -> ReportResponse:
    """
    Génère un nouveau rapport financier avec Google Docs API.
    
    Création workflow:
    1. Crée doc Google Docs vide
    2. Génère contenu basé sur type et données
    3. Insère contenu dans le document
    4. Retourne lien et ID document
    """
    try:
        # Valider type rapport
        valid_types = ["cash_flow", "margin_analysis", "risk_summary", "full_dashboard"]
        if request.report_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid report_type. Must be one of: {valid_types}"
            )
        
        # Créer entrée dans storage
        title = request.title or f"{request.report_type} Report"
        report_id = report_storage.create_report(
            title=title,
            report_type=request.report_type,
            spreadsheet_id=request.spreadsheet_id,
            description=request.description
        )
        
        # Créer document Google Docs
        doc_id = await google_docs_service.create_document(title)
        
        # Générer contenu
        generator = ReportGenerator()
        if request.report_type == "cash_flow":
            content = generator.generate_cash_flow_report(
                {"current_cash": 50000, "client_receivables": 120000, "liabilities": 80000, "runway_days": 45},
                language=request.language
            )
        elif request.report_type == "margin_analysis":
            content = generator.generate_margin_analysis_report({}, language=request.language)
        elif request.report_type == "risk_summary":
            content = generator.generate_risk_summary_report({}, language=request.language)
        else:
            content = generator.generate_full_dashboard_report({}, language=request.language)
        
        # Insérer contenu dans document
        await google_docs_service.insert_content(doc_id, content)
        
        # Mettre à jour storage
        report_storage.update_report(
            report_id,
            google_doc_id=doc_id,
            status="generated"
        )
        
        return ReportResponse(
            report_id=report_id,
            title=title,
            google_doc_id=doc_id,
            status="generated",
            url=f"https://docs.google.com/document/d/{doc_id}/edit",
            created_at=datetime.now().isoformat(),
            message=f"Report '{title}' generated successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")


@router.get("/reports/{report_id}", response_model=ReportMetadata)
async def get_report(
    report_id: str,
    api_key: Optional[str] = Header(None)
) -> ReportMetadata:
    """Récupère métadonnées d'un rapport"""
    try:
        report = report_storage.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail=f"Report {report_id} not found")
        
        return ReportMetadata(**report)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving report: {str(e)}")


@router.post("/reports/{report_id}/export", response_model=Dict)
async def export_report(
    report_id: str,
    request: ExportReportRequest,
    background_tasks: BackgroundTasks,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """
    Exporte un rapport en PDF ou DOCX.
    
    Note: Export asynchrone en background pour gros fichiers
    """
    try:
        report = report_storage.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail=f"Report {report_id} not found")
        
        if request.format not in ["pdf", "docx"]:
            raise HTTPException(
                status_code=400,
                detail="Format must be 'pdf' or 'docx'"
            )
        
        # Exporter le document
        doc_id = report.get("google_doc_id")
        if not doc_id:
            raise HTTPException(status_code=400, detail="Document not yet generated")
        
        file_content = await google_docs_service.export_document(doc_id, request.format)
        
        # Mettre à jour storage
        filename = request.filename or f"{report['title']}.{request.format}"
        report_storage.update_report(
            report_id,
            status="exported",
            file_format=request.format
        )
        
        return {
            "report_id": report_id,
            "format": request.format,
            "filename": filename,
            "size_bytes": len(file_content),
            "status": "exported",
            "message": f"Report exported successfully as {request.format.upper()}"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting report: {str(e)}")


@router.get("/reports/list", response_model=ReportListResponse)
async def list_reports(api_key: Optional[str] = Header(None)) -> ReportListResponse:
    """Liste tous les rapports générés"""
    try:
        reports = report_storage.list_reports()
        return ReportListResponse(
            total=len(reports),
            reports=[ReportMetadata(**r) for r in reports]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing reports: {str(e)}")


@router.post("/reports/{report_id}/share", response_model=Dict)
async def share_report(
    report_id: str,
    request: ShareReportRequest,
    background_tasks: BackgroundTasks,
    api_key: Optional[str] = Header(None)
) -> Dict:
    """
    Partage un rapport avec des utilisateurs.
    
    Envoie invitations Google Drive + notifications email optionnelles
    """
    try:
        report = report_storage.get_report(report_id)
        if not report:
            raise HTTPException(status_code=404, detail=f"Report {report_id} not found")
        
        doc_id = report.get("google_doc_id")
        if not doc_id:
            raise HTTPException(status_code=400, detail="Document not yet generated")
        
        # Partager le document
        success = await google_docs_service.share_document(
            doc_id=doc_id,
            emails=request.emails,
            role=request.role,
            send_notification=request.send_notification
        )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to share document")
        
        return {
            "report_id": report_id,
            "shared_with": request.emails,
            "role": request.role,
            "status": "shared",
            "message": f"Report shared with {len(request.emails)} users"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sharing report: {str(e)}")
