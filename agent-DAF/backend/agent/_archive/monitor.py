"""
Agent Monitor - Surveillance autonome des données
Détecte changements dans les fichiers CSV et décide si action nécessaire
"""

import asyncio
from pathlib import Path
from typing import Dict, List, Optional, Callable
from datetime import datetime
import hashlib
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileModifiedEvent
import pandas as pd


class DataChangeEvent:
    """Événement de changement de données"""
    def __init__(self, file_path: str, change_type: str, details: Dict):
        self.file_path = file_path
        self.change_type = change_type  # "new_row", "modified_value", "deleted_row"
        self.details = details
        self.timestamp = datetime.now()
        self.severity = self._calculate_severity()
    
    def _calculate_severity(self) -> str:
        """Calcule la sévérité du changement"""
        # Logique simple pour démo
        if "overdue" in str(self.details).lower():
            return "critical"
        elif "amount" in self.details and self.details.get("amount", 0) > 50000:
            return "high"
        return "medium"


class CSVMonitor(FileSystemEventHandler):
    """Surveille les modifications de fichiers CSV"""
    
    def __init__(self, data_path: Path, callback: Callable):
        self.data_path = data_path
        self.callback = callback
        self.file_hashes = {}
        self.last_data = {}
        self.pending_changes = []  # Buffer pour les changements détectés
        self._initialize_baseline()
    
    def _initialize_baseline(self):
        """Charge l'état initial des fichiers"""
        csv_files = list(self.data_path.glob("*.csv"))
        for csv_file in csv_files:
            try:
                df = pd.read_csv(csv_file)
                self.last_data[csv_file.name] = df
                self.file_hashes[csv_file.name] = self._hash_file(csv_file)
            except Exception as e:
                print(f"Erreur lecture {csv_file.name}: {e}")
    
    def _hash_file(self, file_path: Path) -> str:
        """Hash MD5 du fichier"""
        return hashlib.md5(file_path.read_bytes()).hexdigest()
    
    def on_modified(self, event):
        """Handler modification fichier"""
        if event.is_directory or not event.src_path.endswith('.csv'):
            return
        
        file_path = Path(event.src_path)
        file_name = file_path.name
        
        # Vérifier si vraiment modifié (éviter faux positifs)
        new_hash = self._hash_file(file_path)
        if new_hash == self.file_hashes.get(file_name):
            return
        
        self.file_hashes[file_name] = new_hash
        
        # Détecter les changements spécifiques
        changes = self._detect_changes(file_path)
        
        if changes:
            # Stocker les changements dans le buffer (synchrone)
            self.pending_changes.extend(changes)
            print(f"📊 {len(changes)} changements détectés dans {file_name}")
    
    def _detect_changes(self, file_path: Path) -> List[DataChangeEvent]:
        """Détecte les changements spécifiques dans le CSV"""
        file_name = file_path.name
        changes = []
        
        try:
            new_df = pd.read_csv(file_path)
            old_df = self.last_data.get(file_name)
            
            if old_df is None:
                # Nouveau fichier
                self.last_data[file_name] = new_df
                return []
            
            # Nouvelles lignes
            if len(new_df) > len(old_df):
                new_rows = new_df.iloc[len(old_df):]
                for idx, new_row in new_rows.iterrows():
                    # Nettoyer les NaN de pandas pour éviter erreurs JSON
                    clean_details = {
                        k: (None if pd.isna(v) else v) 
                        for k, v in new_row.to_dict().items()
                    }
                    changes.append(DataChangeEvent(
                        file_path=str(file_path),
                        change_type="new_row",
                        details=clean_details
                    ))
            
            # Valeurs modifiées (sur colonnes critiques)
            if len(new_df) == len(old_df):
                critical_cols = ['amount', 'status', 'due_date', 'days_overdue']
                for col in critical_cols:
                    if col in new_df.columns and col in old_df.columns:
                        mask = new_df[col] != old_df[col]
                        if mask.any():
                            changed_rows = new_df[mask]
                            for idx, row in changed_rows.iterrows():
                                changes.append(DataChangeEvent(
                                    file_path=str(file_path),
                                    change_type="modified_value",
                                    details={
                                        "column": col,
                                        "old_value": old_df.loc[idx, col],
                                        "new_value": row[col],
                                        "row_data": row.to_dict()
                                    }
                                ))
            
            self.last_data[file_name] = new_df
            
        except Exception as e:
            print(f"Erreur détection changements {file_name}: {e}")
        
        return changes


class AgentMonitor:
    """
    Moniteur autonome qui surveille les données et décide si action nécessaire
    """
    
    def __init__(self, data_path: Path):
        self.data_path = data_path
        self.observer = None
        self.csv_monitor = None
        self.change_callbacks = []
        self.running = False
        self.last_check = None
        self.changes_detected = []
    
    def register_change_callback(self, callback: Callable):
        """Enregistre un callback pour les changements"""
        self.change_callbacks.append(callback)
    
    async def on_data_changed(self, changes: List[DataChangeEvent]):
        """Handler quand données changent"""
        self.changes_detected.extend(changes)
        self.last_check = datetime.now()
        
        # Notifier tous les callbacks
        for callback in self.change_callbacks:
            try:
                if asyncio.iscoroutinefunction(callback):
                    await callback(changes)
                else:
                    callback(changes)
            except Exception as e:
                print(f"Erreur callback changement: {e}")
    
    def check_for_changes(self):
        """Vérifie s'il y a des changements en attente (appel synchrone depuis la boucle)"""
        if self.csv_monitor and self.csv_monitor.pending_changes:
            changes = self.csv_monitor.pending_changes.copy()
            self.csv_monitor.pending_changes.clear()
            return changes
        return []
    
    def start_monitoring(self):
        """Démarre la surveillance autonome"""
        if self.running:
            return
        
        print(f"🔍 Démarrage surveillance: {self.data_path}")
        
        # Créer le monitor CSV
        self.csv_monitor = CSVMonitor(
            self.data_path,
            self.on_data_changed
        )
        
        # Créer l'observer watchdog
        self.observer = Observer()
        self.observer.schedule(
            self.csv_monitor,
            str(self.data_path),
            recursive=False
        )
        
        self.observer.start()
        self.running = True
        self.last_check = datetime.now()
        
        print(f"✅ Surveillance active sur {self.data_path}")
    
    def stop_monitoring(self):
        """Arrête la surveillance"""
        if self.observer:
            self.observer.stop()
            self.observer.join()
            self.running = False
            print("⏹️ Surveillance arrêtée")
    
    def get_status(self) -> Dict:
        """Retourne le statut actuel du monitoring"""
        return {
            "running": self.running,
            "last_check": self.last_check.isoformat() if self.last_check else None,
            "changes_detected": len(self.changes_detected),
            "monitored_path": str(self.data_path)
        }
    
    def should_trigger_analysis(self) -> tuple[bool, str]:
        """
        DÉCISION AUTONOME : Faut-il lancer une analyse ?
        Retourne (bool, raison)
        """
        if not self.changes_detected:
            return False, "no_changes"
        
        # Analyser la sévérité des changements
        critical_changes = [c for c in self.changes_detected if c.severity == "critical"]
        high_changes = [c for c in self.changes_detected if c.severity == "high"]
        
        if critical_changes:
            return True, f"critical_change_detected ({len(critical_changes)} changes)"
        
        if len(high_changes) >= 2:
            return True, f"multiple_high_impact_changes ({len(high_changes)} changes)"
        
        if len(self.changes_detected) >= 5:
            return True, f"significant_data_volume ({len(self.changes_detected)} changes)"
        
        return False, "changes_not_significant"
    
    def clear_changes(self):
        """Réinitialise le buffer de changements"""
        self.changes_detected = []
