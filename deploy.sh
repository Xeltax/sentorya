#!/bin/bash

# ============================================
# Script de Configuration du CI/CD
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Configuration CI/CD GitHub Actions      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# =====================================
# Fonction pour générer une clé SSH
# =====================================
generate_ssh_key() {
    echo -e "${YELLOW}🔐 Génération d'une clé SSH pour le CI/CD...${NC}"
    
    ssh-keygen -t ed25519 -C "github-actions-sentorya" -f ~/.ssh/sentorya_deploy -N ""
    
    echo -e "${GREEN}✅ Clé SSH générée !${NC}"
    echo ""
    echo -e "${YELLOW}📋 Clé PUBLIQUE (à copier sur le serveur) :${NC}"
    echo "----------------------------------------"
    cat ~/.ssh/sentorya_deploy.pub
    echo "----------------------------------------"
    echo ""
    echo -e "${YELLOW}📋 Clé PRIVÉE (à copier dans GitHub Secret SSH_PRIVATE_KEY) :${NC}"
    echo "----------------------------------------"
    cat ~/.ssh/sentorya_deploy
    echo "----------------------------------------"
    echo ""
}

# =====================================
# Fonction pour copier sur le serveur
# =====================================
setup_server() {
    echo -e "${YELLOW}🖥️  Configuration du serveur...${NC}"
    
    read -p "Entrez l'adresse du serveur (IP ou domaine) : " server_host
    read -p "Entrez l'utilisateur SSH : " server_user
    
    echo -e "${BLUE}📤 Copie de la clé publique sur le serveur...${NC}"
    
    # Copier la clé publique
    ssh-copy-id -i ~/.ssh/sentorya_deploy.pub $server_user@$server_host
    
    echo -e "${GREEN}✅ Clé copiée sur le serveur${NC}"
    
    # Tester la connexion
    echo -e "${BLUE}🔍 Test de la connexion SSH...${NC}"
    if ssh -i ~/.ssh/sentorya_deploy $server_user@$server_host "echo 'Connection OK'"; then
        echo -e "${GREEN}✅ Connexion SSH fonctionnelle${NC}"
    else
        echo -e "${RED}❌ Erreur de connexion SSH${NC}"
        exit 1
    fi
    
    # Créer le dossier de déploiement
    echo -e "${BLUE}📁 Création du dossier de déploiement...${NC}"
    ssh -i ~/.ssh/sentorya_deploy $server_user@$server_host << 'ENDSSH'
        mkdir -p ~/sentorya
        mkdir -p ~/sentorya/nginx
        mkdir -p ~/sentorya/certbot/conf
        mkdir -p ~/sentorya/certbot/www
        echo "✅ Dossiers créés"
ENDSSH
    
    echo -e "${GREEN}✅ Serveur configuré${NC}"
}

# =====================================
# Fonction pour afficher les secrets GitHub
# =====================================
show_github_secrets() {
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Secrets à créer dans GitHub              ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""
    
    read -p "Entrez l'adresse du serveur : " server_host
    read -p "Entrez l'utilisateur SSH : " server_user
    
    echo ""
    echo -e "${YELLOW}📋 Créez ces secrets dans GitHub :${NC}"
    echo "   Repo → Settings → Secrets and variables → Actions → New repository secret"
    echo ""
    echo -e "${GREEN}1. SERVER_HOST${NC}"
    echo "   Valeur : $server_host"
    echo ""
    echo -e "${GREEN}2. SERVER_USER${NC}"
    echo "   Valeur : $server_user"
    echo ""
    echo -e "${GREEN}3. SSH_PRIVATE_KEY${NC}"
    echo "   Valeur : (contenu de ~/.ssh/sentorya_deploy)"
    echo "   Commande : cat ~/.ssh/sentorya_deploy"
    echo ""
    echo -e "${BLUE}Note : Le secret GITHUB_TOKEN est créé automatiquement${NC}"
    echo ""
}

# =====================================
# Fonction pour vérifier la configuration
# =====================================
check_config() {
    echo -e "${BLUE}🔍 Vérification de la configuration...${NC}"
    echo ""
    
    checks_passed=0
    checks_failed=0
    
    # Vérifier la clé SSH
    if [ -f ~/.ssh/sentorya_deploy ]; then
        echo -e "${GREEN}✅ Clé SSH privée trouvée${NC}"
        ((checks_passed++))
    else
        echo -e "${RED}❌ Clé SSH privée non trouvée${NC}"
        ((checks_failed++))
    fi
    
    if [ -f ~/.ssh/sentorya_deploy.pub ]; then
        echo -e "${GREEN}✅ Clé SSH publique trouvée${NC}"
        ((checks_passed++))
    else
        echo -e "${RED}❌ Clé SSH publique non trouvée${NC}"
        ((checks_failed++))
    fi
    
    # Vérifier les fichiers du workflow
    if [ -f .github/workflows/deploy.yml ]; then
        echo -e "${GREEN}✅ Workflow GitHub Actions trouvé${NC}"
        ((checks_passed++))
    else
        echo -e "${RED}❌ Workflow GitHub Actions non trouvé${NC}"
        ((checks_failed++))
    fi
    
    if [ -f docker-compose.prod.yml ]; then
        echo -e "${GREEN}✅ docker-compose.prod.yml trouvé${NC}"
        ((checks_passed++))
    else
        echo -e "${RED}❌ docker-compose.prod.yml non trouvé${NC}"
        ((checks_failed++))
    fi
    
    echo ""
    echo "================================"
    echo -e "${GREEN}✅ Vérifications réussies: $checks_passed${NC}"
    echo -e "${RED}❌ Vérifications échouées: $checks_failed${NC}"
    echo ""
    
    if [ $checks_failed -eq 0 ]; then
        echo -e "${GREEN}🎉 Configuration prête pour le CI/CD !${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Corrigez les problèmes avant de continuer${NC}"
        return 1
    fi
}

# =====================================
# Fonction pour tester le workflow
# =====================================
test_workflow() {
    echo -e "${BLUE}🧪 Test du workflow...${NC}"
    echo ""
    
    read -p "Entrez votre nom d'utilisateur GitHub : " github_user
    read -p "Entrez le nom du repository : " repo_name
    
    echo ""
    echo -e "${YELLOW}Pour tester le workflow :${NC}"
    echo "1. Commit et push les fichiers :"
    echo "   git add .github/workflows/deploy.yml docker-compose.prod.yml"
    echo "   git commit -m 'feat: Add CI/CD pipeline'"
    echo "   git push origin main"
    echo ""
    echo "2. Va sur GitHub :"
    echo "   https://github.com/$github_user/$repo_name/actions"
    echo ""
    echo "3. Clique sur '🚀 Build and Deploy to Production'"
    echo ""
    echo "4. Clique sur 'Run workflow' → 'Run workflow'"
    echo ""
    echo -e "${GREEN}Le workflow va se lancer et tu pourras voir les logs en temps réel !${NC}"
    echo ""
}

# =====================================
# Menu principal
# =====================================
show_menu() {
    echo ""
    echo -e "${BLUE}Que voulez-vous faire ?${NC}"
    echo "1) 🔐 Générer une clé SSH"
    echo "2) 🖥️  Configurer le serveur"
    echo "3) 📋 Afficher les secrets GitHub à créer"
    echo "4) 🔍 Vérifier la configuration"
    echo "5) 🧪 Tester le workflow"
    echo "6) 📖 Afficher le guide complet"
    echo "7) 🚪 Quitter"
    echo ""
}

# =====================================
# Boucle principale
# =====================================
while true; do
    show_menu
    read -p "Votre choix : " choice
    
    case $choice in
        1)
            generate_ssh_key
            ;;
        2)
            setup_server
            ;;
        3)
            show_github_secrets
            ;;
        4)
            check_config
            ;;
        5)
            test_workflow
            ;;
        6)
            echo ""
            echo -e "${BLUE}📖 Consultez le fichier CI_CD_SETUP.md pour le guide complet${NC}"
            echo ""
            ;;
        7)
            echo -e "${GREEN}Au revoir ! 👋${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Choix invalide${NC}"
            ;;
    esac
    
    read -p "Appuyez sur Entrée pour continuer..."
done