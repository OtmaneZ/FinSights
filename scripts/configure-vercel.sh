#!/bin/bash

# ============================================
# Script de configuration Vercel post-migration
# À exécuter après la configuration DNS
# ============================================

echo "🚀 Configuration Vercel pour getfinsight.fr"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1. Vérification de l'environnement${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Vérifier la connexion Vercel
echo "Vérification de la connexion Vercel..."
vercel whoami
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur : Non connecté à Vercel${NC}"
    echo "Exécutez : vercel login"
    exit 1
fi
echo -e "${GREEN}✓ Connecté à Vercel${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2. Vérification des domaines${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Domaines configurés :"
vercel domains ls
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3. Variables d'environnement à mettre à jour${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}⚠️  ACTION MANUELLE REQUISE${NC}"
echo ""
echo "Vous devez mettre à jour les variables d'environnement suivantes :"
echo ""
echo -e "${GREEN}NEXTAUTH_URL${NC}"
echo "  1. Supprimer l'ancienne : vercel env rm NEXTAUTH_URL production"
echo "  2. Ajouter la nouvelle   : vercel env add NEXTAUTH_URL production"
echo "     Valeur à entrer       : https://getfinsight.fr"
echo ""
echo -e "${GREEN}NEXT_PUBLIC_SITE_URL${NC} (optionnel mais recommandé)"
echo "  1. Ajouter : vercel env add NEXT_PUBLIC_SITE_URL production"
echo "     Valeur  : https://getfinsight.fr"
echo ""

read -p "Voulez-vous mettre à jour NEXTAUTH_URL maintenant ? (o/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[OoYy]$ ]]; then
    echo ""
    echo "Suppression de l'ancienne NEXTAUTH_URL..."
    vercel env rm NEXTAUTH_URL production
    
    echo ""
    echo "Ajout de la nouvelle NEXTAUTH_URL..."
    echo "Entrez : https://getfinsight.fr"
    vercel env add NEXTAUTH_URL production
    
    echo -e "${GREEN}✓ NEXTAUTH_URL mise à jour${NC}"
fi

echo ""
read -p "Voulez-vous ajouter NEXT_PUBLIC_SITE_URL ? (o/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[OoYy]$ ]]; then
    echo ""
    echo "Ajout de NEXT_PUBLIC_SITE_URL..."
    echo "Entrez : https://getfinsight.fr"
    vercel env add NEXT_PUBLIC_SITE_URL production
    
    echo -e "${GREEN}✓ NEXT_PUBLIC_SITE_URL ajoutée${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}4. Variables d'environnement actuelles${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

vercel env ls

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}5. Vérification DNS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Vérification DNS pour getfinsight.fr..."
dig +short getfinsight.fr A

DNS_IP=$(dig +short getfinsight.fr A | head -n 1)
if [ "$DNS_IP" == "76.76.21.21" ]; then
    echo -e "${GREEN}✓ DNS correctement configuré (76.76.21.21)${NC}"
else
    echo -e "${YELLOW}⚠️  DNS pas encore propagé ou non configuré${NC}"
    echo "IP actuelle : $DNS_IP"
    echo "IP attendue : 76.76.21.21"
    echo ""
    echo "Configuration requise chez votre registrar :"
    echo "  Type : A"
    echo "  Nom  : @"
    echo "  Valeur : 76.76.21.21"
    echo ""
    echo "  Type : A"
    echo "  Nom  : www"
    echo "  Valeur : 76.76.21.21"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}6. Test du site${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$DNS_IP" == "76.76.21.21" ]; then
    echo "Test HTTPS..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://getfinsight.fr || echo "000")
    
    if [ "$HTTP_STATUS" == "200" ]; then
        echo -e "${GREEN}✓ Site accessible (HTTP 200)${NC}"
        echo -e "${GREEN}✓ https://getfinsight.fr fonctionne !${NC}"
    else
        echo -e "${YELLOW}⚠️  HTTP Status: $HTTP_STATUS${NC}"
        echo "Le site n'est pas encore accessible. Raisons possibles :"
        echo "  - SSL en cours de génération (attendre 5-10 min)"
        echo "  - Redéploiement nécessaire"
    fi
else
    echo -e "${YELLOW}⚠️  Impossible de tester : DNS pas encore propagé${NC}"
    echo "Réessayez dans 15-30 minutes"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}7. Résumé${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Checklist :"
echo -e "  [${GREEN}✓${NC}] Code migré et pushé"
echo -e "  [${GREEN}✓${NC}] Domaines ajoutés à Vercel"

if [ "$DNS_IP" == "76.76.21.21" ]; then
    echo -e "  [${GREEN}✓${NC}] DNS configurés"
else
    echo -e "  [${YELLOW}⏳${NC}] DNS à configurer ou en propagation"
fi

echo -e "  [${YELLOW}⏳${NC}] Variables d'environnement (vérifiez ci-dessus)"
echo ""
echo "Prochaines étapes :"
echo "  1. Vérifier que NEXTAUTH_URL = https://getfinsight.fr"
echo "  2. Si DNS non configuré : configurer chez votre registrar"
echo "  3. Attendre la propagation DNS (15 min - 1h)"
echo "  4. Tester : https://getfinsight.fr"
echo "  5. Configurer Google Search Console dans les 7 jours"
echo ""
echo -e "${GREEN}🎉 Configuration Vercel terminée !${NC}"
echo ""
echo "Documentation complète : GUIDE_MIGRATION_FINALE.md"
