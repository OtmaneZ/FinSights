"""
TRESORIS - Google OAuth Authentication Service
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service centralisé pour gérer l'authentification Google OAuth 2.0.
Gère les credentials, refresh tokens, et scopes pour Docs/Gmail/Calendar.
"""

import os
import json
from typing import Optional, List
from pathlib import Path
from datetime import datetime, timedelta

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


# Scopes nécessaires pour accéder aux APIs Google
SCOPES = [
    'https://www.googleapis.com/auth/documents',  # Google Docs
    'https://www.googleapis.com/auth/drive.file',  # Google Drive (pour créer/lire fichiers)
    'https://www.googleapis.com/auth/gmail.send',  # Gmail (envoyer emails)
    'https://www.googleapis.com/auth/gmail.readonly',  # Gmail (lire emails)
    'https://www.googleapis.com/auth/calendar',  # Google Calendar
]


class GoogleAuthService:
    """Service d'authentification Google OAuth"""
    
    def __init__(self, credentials_path: Optional[str] = None, token_path: Optional[str] = None):
        """
        Initialise le service d'authentification.
        
        Args:
            credentials_path: Chemin vers client_secret JSON
            token_path: Chemin où stocker le token.json
        """
        self.base_dir = Path(__file__).parent.parent
        
        # Chercher le fichier credentials automatiquement
        if credentials_path is None:
            # Chercher client_secret_*.json dans backend/
            creds_files = list(self.base_dir.glob("client_secret_*.json"))
            if creds_files:
                self.credentials_path = str(creds_files[0])
            else:
                raise FileNotFoundError(
                    "Aucun fichier client_secret_*.json trouvé. "
                    "Téléchargez-le depuis Google Cloud Console."
                )
        else:
            self.credentials_path = credentials_path
        
        # Stocker token.json dans backend/
        self.token_path = token_path or str(self.base_dir / "token.json")
        
        self._creds: Optional[Credentials] = None
    
    def get_credentials(self, force_refresh: bool = False) -> Credentials:
        """
        Obtient les credentials Google OAuth.
        
        - Si token.json existe et est valide → utilise-le
        - Si token expiré → refresh automatique
        - Sinon → lance flow OAuth (navigateur)
        
        Args:
            force_refresh: Forcer l'authentification même si token valide
            
        Returns:
            Credentials Google valides
        """
        creds = None
        
        # 1. Charger token existant si disponible
        if os.path.exists(self.token_path) and not force_refresh:
            try:
                creds = Credentials.from_authorized_user_file(self.token_path, SCOPES)
            except Exception as e:
                print(f"⚠️  Erreur chargement token: {e}")
                creds = None
        
        # 2. Vérifier si token valide ou refresh si expiré
        if creds and creds.valid:
            print("✅ Credentials valides trouvées")
            self._creds = creds
            return creds
        
        if creds and creds.expired and creds.refresh_token:
            try:
                print("🔄 Refresh du token expiré...")
                creds.refresh(Request())
                print("✅ Token refreshé avec succès")
            except Exception as e:
                print(f"⚠️  Erreur refresh: {e}")
                creds = None
        
        # 3. Si pas de creds valides → lancer OAuth flow
        if not creds:
            print("🔐 Lancement du flow OAuth...")
            print(f"📄 Using credentials: {self.credentials_path}")
            
            flow = InstalledAppFlow.from_client_secrets_file(
                self.credentials_path,
                SCOPES
            )
            
            # Lance serveur local sur port 8080 pour callback
            creds = flow.run_local_server(port=8080, open_browser=True)
            print("✅ Authentification réussie!")
        
        # 4. Sauvegarder token pour prochaine utilisation
        with open(self.token_path, 'w') as token_file:
            token_file.write(creds.to_json())
            print(f"💾 Token sauvegardé: {self.token_path}")
        
        self._creds = creds
        return creds
    
    def build_service(self, service_name: str, version: str):
        """
        Construit un service Google API.
        
        Args:
            service_name: "docs" | "gmail" | "calendar" | "drive"
            version: "v1" | "v3" etc.
            
        Returns:
            Google API service client
        """
        creds = self.get_credentials()
        return build(service_name, version, credentials=creds)
    
    def get_docs_service(self):
        """Retourne service Google Docs"""
        return self.build_service('docs', 'v1')
    
    def get_drive_service(self):
        """Retourne service Google Drive"""
        return self.build_service('drive', 'v3')
    
    def get_gmail_service(self):
        """Retourne service Gmail"""
        return self.build_service('gmail', 'v1')
    
    def get_calendar_service(self):
        """Retourne service Google Calendar"""
        return self.build_service('calendar', 'v3')
    
    def revoke_credentials(self):
        """Révoque les credentials actuels et supprime token.json"""
        if os.path.exists(self.token_path):
            os.remove(self.token_path)
            print(f"🗑️  Token supprimé: {self.token_path}")
        self._creds = None
    
    def get_user_info(self) -> dict:
        """
        Récupère infos utilisateur connecté.
        
        Returns:
            Dict avec email, name, picture
        """
        try:
            # Utiliser Gmail API pour récupérer profile
            gmail = self.get_gmail_service()
            profile = gmail.users().getProfile(userId='me').execute()
            
            return {
                "email": profile.get("emailAddress"),
                "messages_total": profile.get("messagesTotal"),
                "threads_total": profile.get("threadsTotal"),
            }
        except HttpError as e:
            print(f"❌ Erreur récupération profile: {e}")
            return {}


# ═══════════════════════════════════════════════════════════════════════════════
# SINGLETON INSTANCE
# ═══════════════════════════════════════════════════════════════════════════════

# Instance globale partagée
_auth_service_instance: Optional[GoogleAuthService] = None


def get_google_auth() -> GoogleAuthService:
    """
    Retourne l'instance singleton du service d'authentification.
    
    Usage:
        auth = get_google_auth()
        docs_service = auth.get_docs_service()
    """
    global _auth_service_instance
    
    if _auth_service_instance is None:
        _auth_service_instance = GoogleAuthService()
    
    return _auth_service_instance


# ═══════════════════════════════════════════════════════════════════════════════
# CLI POUR TESTER
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    """Test du service d'authentification"""
    print("🔐 Test Google OAuth Service\n")
    
    auth = get_google_auth()
    
    # 1. Authentifier
    creds = auth.get_credentials()
    print(f"✅ Authentifié: {creds.valid}\n")
    
    # 2. Récupérer infos user
    user_info = auth.get_user_info()
    print(f"👤 User: {user_info}\n")
    
    # 3. Tester services
    print("📄 Google Docs service:", auth.get_docs_service())
    print("📧 Gmail service:", auth.get_gmail_service())
    print("📅 Calendar service:", auth.get_calendar_service())
    print("\n✅ Tous les services disponibles!")
