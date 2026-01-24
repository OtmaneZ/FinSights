#!/usr/bin/env python3
"""
Test de l'API TRESORIS V2
"""

import requests
import time

BASE_URL = "http://localhost:8000"

def test_api():
    print("🧪 Test API TRESORIS V2\n")
    
    # Test 1: Health check
    print("1. Health check...")
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"   ✅ {r.json()}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return False
    
    # Test 2: Version
    print("\n2. Version...")
    try:
        r = requests.get(f"{BASE_URL}/version", timeout=5)
        version = r.json()
        print(f"   ✅ {version['name']} v{version['current']}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    # Test 3: Start agent
    print("\n3. Démarrage agent...")
    try:
        r = requests.post(f"{BASE_URL}/agent/start", timeout=5)
        result = r.json()
        print(f"   ✅ {result['status']}: {result['message']}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    # Attendre un peu
    print("\n   ⏳ Attente 10s pour première analyse...")
    time.sleep(10)
    
    # Test 4: Status
    print("\n4. Status agent...")
    try:
        r = requests.get(f"{BASE_URL}/agent/status", timeout=5)
        status = r.json()
        print(f"   Mode: {status['mode']}")
        print(f"   Running: {status['running']}")
        if status.get('current_analysis_summary'):
            print(f"   Analyse en cours: {status['current_analysis_summary']}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    # Test 5: Latest analysis
    print("\n5. Dernière analyse...")
    try:
        r = requests.get(f"{BASE_URL}/agent/analysis/latest", timeout=5)
        if r.status_code == 200:
            analysis = r.json()
            print(f"   ✅ Analyse ID: {analysis.get('id')}")
            print(f"   Risques: {analysis.get('summary', {}).get('total_risks')}")
            print(f"   Actions: {analysis.get('summary', {}).get('actions_proposed')}")
        else:
            print(f"   ⏳ Pas encore d'analyse (normal si juste démarré)")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    # Test 6: Intelligence metrics
    print("\n6. Métriques intelligence...")
    try:
        r = requests.get(f"{BASE_URL}/agent/intelligence", timeout=5)
        metrics = r.json()
        print(f"   Analyses: {metrics['total_analyses']}")
        print(f"   Décisions: {metrics['total_decisions']}")
        print(f"   {metrics['interpretation']}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    print("\n✅ Tests terminés!")
    return True


if __name__ == "__main__":
    print("⚠️ Assurez-vous que l'API est démarrée (python main_v2.py)\n")
    test_api()
