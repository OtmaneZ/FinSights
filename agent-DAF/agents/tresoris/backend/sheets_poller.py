"""
TRESORIS - Google Sheets Poller
Surveille automatiquement un Google Sheet et déclenche l'analyse
"""

import asyncio
import hashlib
import json
from datetime import datetime
from typing import Optional, Dict, Any, List
import gspread
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import os
import pickle

# Scopes requis pour lire les Google Sheets
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']


class SheetsPoller:
    """
    Surveille un Google Sheet et déclenche l'analyse automatiquement.
    Polling toutes les 30 secondes, détection des changements via hash.
    """
    
    def __init__(
        self, 
        spreadsheet_id: str,
        credentials_path: str,
        on_change_callback,
        poll_interval: int = 30
    ):
        """
        Args:
            spreadsheet_id: ID du Google Sheet à surveiller
            credentials_path: Chemin vers client_secret.json
            on_change_callback: Fonction async à appeler quand le Sheet change
            poll_interval: Intervalle de polling en secondes (défaut: 30s)
        """
        self.spreadsheet_id = spreadsheet_id
        self.credentials_path = credentials_path
        self.on_change_callback = on_change_callback
        self.poll_interval = poll_interval
        
        self.client: Optional[gspread.Client] = None
        self.last_hash: Optional[str] = None
        self.running = False
        
        print(f"📊 SheetsPoller initialisé pour {spreadsheet_id}")
    
    def _get_credentials(self) -> Credentials:
        """Obtient les credentials OAuth2 (avec cache token.pickle)"""
        creds = None
        token_path = os.path.join(os.path.dirname(self.credentials_path), 'token.pickle')
        
        # Charger le token depuis le cache
        if os.path.exists(token_path):
            with open(token_path, 'rb') as token:
                creds = pickle.load(token)
        
        # Si pas de credentials valides, lancer le flow OAuth
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_path, SCOPES
                )
                creds = flow.run_local_server(port=0)
            
            # Sauvegarder le token pour la prochaine fois
            with open(token_path, 'wb') as token:
                pickle.dump(creds, token)
        
        return creds
    
    def connect(self):
        """Connecte à Google Sheets API"""
        try:
            creds = self._get_credentials()
            self.client = gspread.authorize(creds)
            print("✅ Connecté à Google Sheets API")
        except Exception as e:
            print(f"❌ Erreur de connexion Google Sheets: {e}")
            raise
    
    def _read_sheet_data(self) -> Dict[str, Any]:
        """Lit les données du Sheet (onglets Factures et Encaissements)"""
        if not self.client:
            raise RuntimeError("Client non connecté. Appelez connect() d'abord.")
        
        try:
            spreadsheet = self.client.open_by_key(self.spreadsheet_id)
            
            # Lire l'onglet Factures
            factures_sheet = spreadsheet.worksheet("Factures")
            factures_data = factures_sheet.get_all_records()
            
            # Lire l'onglet Encaissements (optionnel)
            encaissements_data = []
            try:
                encaissements_sheet = spreadsheet.worksheet("Encaissements")
                encaissements_data = encaissements_sheet.get_all_records()
            except gspread.WorksheetNotFound:
                pass  # Onglet optionnel
            
            return {
                "spreadsheet_id": self.spreadsheet_id,
                "spreadsheet_name": spreadsheet.title,
                "timestamp": datetime.now().isoformat(),
                "factures": factures_data,
                "encaissements": encaissements_data,
                "parametres": {}
            }
        
        except Exception as e:
            print(f"❌ Erreur lecture Sheet: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            raise
    
    def _compute_hash(self, data: Dict[str, Any]) -> str:
        """Calcule un hash MD5 des données pour détecter les changements"""
        # On hash uniquement les factures (pas le timestamp)
        content = json.dumps(data.get("factures", []), sort_keys=True)
        return hashlib.md5(content.encode()).hexdigest()
    
    async def _poll_once(self):
        """Effectue un cycle de polling"""
        try:
            # Lire le Sheet
            data = self._read_sheet_data()
            
            # Calculer le hash
            current_hash = self._compute_hash(data)
            
            # Détecter changement
            if current_hash != self.last_hash:
                factures_count = len(data.get("factures", []))
                
                if self.last_hash is None:
                    print(f"📊 Première lecture: {factures_count} factures")
                else:
                    print(f"🔄 Changement détecté! {factures_count} factures")
                
                self.last_hash = current_hash
                
                # Appeler le callback d'analyse
                await self.on_change_callback(data)
            
        except Exception as e:
            print(f"⚠️ Erreur polling: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
    
    async def start(self):
        """Démarre le polling en boucle"""
        if not self.client:
            self.connect()
        
        self.running = True
        print(f"🚀 Polling démarré (intervalle: {self.poll_interval}s)")
        
        while self.running:
            await self._poll_once()
            await asyncio.sleep(self.poll_interval)
    
    def stop(self):
        """Arrête le polling"""
        self.running = False
        print("⏹️ Polling arrêté")


# ═══════════════════════════════════════════════════════════════════════════════
# Fonction helper pour intégration dans main.py
# ═══════════════════════════════════════════════════════════════════════════════

async def start_sheets_polling(
    spreadsheet_id: str,
    credentials_path: str,
    analysis_callback,
    poll_interval: int = 30
):
    """
    Démarre le polling automatique d'un Google Sheet.
    
    Args:
        spreadsheet_id: ID du Sheet
        credentials_path: Chemin vers client_secret.json
        analysis_callback: Fonction async(data) appelée lors de changements
        poll_interval: Intervalle en secondes
    """
    poller = SheetsPoller(
        spreadsheet_id=spreadsheet_id,
        credentials_path=credentials_path,
        on_change_callback=analysis_callback,
        poll_interval=poll_interval
    )
    
    await poller.start()
