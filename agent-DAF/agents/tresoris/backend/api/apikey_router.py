"""
TRESORIS - API Key Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gestion des clés API pour l'intégration Google Sheets et autres.
"""

from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import secrets
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException, Header
from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1", tags=["API Keys"])
Base = declarative_base()


# ═══════════════════════════════════════════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class APIKeyCreate(BaseModel):
    """Requête pour créer une clé API"""
    name: str                               # Nom descriptif (ex: "Mon Google Sheet")
    description: Optional[str] = None       # Description
    spreadsheet_id: Optional[str] = None   # Google Sheet ID associé
    expiry_days: int = 365                 # Valide 1 an par défaut


class APIKeyResponse(BaseModel):
    """Réponse avec clé API créée"""
    key: str                                # La clé API (affichée UNE FOIS)
    key_id: str                             # ID de la clé
    name: str
    created_at: str
    expires_at: str
    spreadsheet_id: Optional[str] = None


class APIKeyInfo(BaseModel):
    """Infos sur une clé API (sans la clé elle-même)"""
    key_id: str
    name: str
    created_at: str
    expires_at: str
    is_active: bool
    last_used: Optional[str] = None
    usage_count: int = 0


# ═══════════════════════════════════════════════════════════════════════════════
# DATABASE MODEL (In-memory pour démo, à remplacer par SQLAlchemy en prod)
# ═══════════════════════════════════════════════════════════════════════════════

class APIKeyStorage:
    """Stockage en mémoire des clés API"""
    
    def __init__(self):
        # Structure: { "key_hash": { "key_id": str, "name": str, ... } }
        self._keys = {}
        self._key_id_counter = 1
    
    def create_key(self, name: str, description: str = None, 
                   spreadsheet_id: str = None, expiry_days: int = 365) -> tuple:
        """
        Crée une nouvelle clé API.
        Retourne (clé_brute, clé_id)
        """
        # Générer une clé sécurisée
        key = f"tre_{secrets.token_urlsafe(32)}"
        key_hash = self._hash_key(key)
        
        # ID unique
        key_id = f"key_{self._key_id_counter}"
        self._key_id_counter += 1
        
        # Metadata
        now = datetime.now()
        expires_at = now + timedelta(days=expiry_days)
        
        self._keys[key_hash] = {
            "key_id": key_id,
            "name": name,
            "description": description,
            "created_at": now.isoformat(),
            "expires_at": expires_at.isoformat(),
            "spreadsheet_id": spreadsheet_id,
            "is_active": True,
            "last_used": None,
            "usage_count": 0
        }
        
        return key, key_id
    
    def verify_key(self, key: str) -> Optional[dict]:
        """
        Vérifie qu'une clé est valide et retourne ses infos.
        """
        key_hash = self._hash_key(key)
        
        if key_hash not in self._keys:
            return None
        
        info = self._keys[key_hash]
        
        # Vérifier l'expiration
        expires_at = datetime.fromisoformat(info["expires_at"])
        if expires_at < datetime.now():
            return None
        
        # Vérifier que la clé est active
        if not info["is_active"]:
            return None
        
        # Mettre à jour l'utilisation
        self._keys[key_hash]["last_used"] = datetime.now().isoformat()
        self._keys[key_hash]["usage_count"] += 1
        
        return info
    
    def get_key_info(self, key_id: str) -> Optional[APIKeyInfo]:
        """Récupère les infos d'une clé (sans la clé elle-même)"""
        for key_hash, info in self._keys.items():
            if info["key_id"] == key_id:
                return APIKeyInfo(
                    key_id=info["key_id"],
                    name=info["name"],
                    created_at=info["created_at"],
                    expires_at=info["expires_at"],
                    is_active=info["is_active"],
                    last_used=info.get("last_used"),
                    usage_count=info.get("usage_count", 0)
                )
        return None
    
    def list_keys(self, user_id: str = "default") -> list:
        """Liste toutes les clés actives"""
        keys = []
        for key_hash, info in self._keys.items():
            if info["is_active"]:
                keys.append(APIKeyInfo(
                    key_id=info["key_id"],
                    name=info["name"],
                    created_at=info["created_at"],
                    expires_at=info["expires_at"],
                    is_active=info["is_active"],
                    last_used=info.get("last_used"),
                    usage_count=info.get("usage_count", 0)
                ))
        return keys
    
    def revoke_key(self, key_id: str) -> bool:
        """Désactive une clé"""
        for key_hash, info in self._keys.items():
            if info["key_id"] == key_id:
                self._keys[key_hash]["is_active"] = False
                return True
        return False
    
    @staticmethod
    def _hash_key(key: str) -> str:
        """Hash simple de la clé (en prod, utiliser bcrypt)"""
        import hashlib
        return hashlib.sha256(key.encode()).hexdigest()


# Instance globale
api_key_storage = APIKeyStorage()


# ═══════════════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/api-keys/create", response_model=APIKeyResponse)
async def create_api_key(
    payload: APIKeyCreate,
    authorization: str = Header(default=None)
):
    """
    Crée une nouvelle clé API.
    
    Returns:
        La clé API en clair (affichée UNE FOIS seulement)
    
    Example:
        POST /api/v1/api-keys/create
        {
            "name": "Mon Google Sheet",
            "description": "Intégration Google Sheets pour mon entreprise",
            "spreadsheet_id": "1a2b3c4d5e6f...",
            "expiry_days": 365
        }
    """
    
    # En prod, vérifier que l'utilisateur est authentifié
    # Pour la démo, on accepte tout
    
    try:
        # Créer la clé
        key, key_id = api_key_storage.create_key(
            name=payload.name,
            description=payload.description,
            spreadsheet_id=payload.spreadsheet_id,
            expiry_days=payload.expiry_days
        )
        
        # Récupérer les infos
        info = api_key_storage.get_key_info(key_id)
        
        return APIKeyResponse(
            key=key,  # La vraie clé (affichée UNE FOIS)
            key_id=key_id,
            name=payload.name,
            created_at=info.created_at,
            expires_at=info.expires_at,
            spreadsheet_id=payload.spreadsheet_id
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/api-keys/list")
async def list_api_keys(authorization: str = Header(default=None)):
    """
    Liste toutes les clés API actives.
    """
    try:
        keys = api_key_storage.list_keys()
        return {
            "success": True,
            "keys": [k.dict() for k in keys],
            "total": len(keys)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/api-keys/{key_id}")
async def get_api_key_info(
    key_id: str,
    authorization: str = Header(default=None)
):
    """
    Récupère les infos d'une clé API (sans la clé elle-même).
    """
    try:
        info = api_key_storage.get_key_info(key_id)
        
        if not info:
            raise HTTPException(status_code=404, detail="Clé non trouvée")
        
        return {
            "success": True,
            "key": info.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/api-keys/{key_id}/revoke")
async def revoke_api_key(
    key_id: str,
    authorization: str = Header(default=None)
):
    """
    Désactive une clé API.
    """
    try:
        success = api_key_storage.revoke_key(key_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Clé non trouvée")
        
        return {
            "success": True,
            "message": f"Clé {key_id} désactivée"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# MIDDLEWARE DE VÉRIFICATION
# ═══════════════════════════════════════════════════════════════════════════════

def verify_api_key(api_key: str) -> Optional[dict]:
    """
    Vérifie une clé API.
    À utiliser dans les endpoints protégés.
    
    Usage:
        @router.post("/webhook/gsheet")
        async def webhook(payload: GSheetWebhookPayload, authorization: str = Header()):
            # Extraire la clé du header
            key = authorization.replace("Bearer ", "")
            
            # Vérifier
            key_info = verify_api_key(key)
            if not key_info:
                raise HTTPException(status_code=401, detail="Invalid API Key")
    """
    return api_key_storage.verify_key(api_key)
