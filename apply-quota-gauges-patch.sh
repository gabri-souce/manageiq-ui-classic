#!/bin/bash
# Script per applicare il plugin Cloud Tenant Quota Gauges
# a una installazione esistente di ManageIQ

set -e

# Colori per output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Cloud Tenant Quota Gauges - Installer${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verifica che siamo nella directory corretta
if [ ! -f "manageiq-ui-classic.gemspec" ]; then
    echo -e "${RED}Errore: Questo script deve essere eseguito dalla root di manageiq-ui-classic${NC}"
    exit 1
fi

PLUGIN_SOURCE_DIR="$(dirname "$0")/app/javascript/components/cloud-tenant-quota-gauges"

if [ ! -d "$PLUGIN_SOURCE_DIR" ]; then
    echo -e "${RED}Errore: Directory plugin non trovata: $PLUGIN_SOURCE_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Directory corretta trovata"
echo ""

# Backup dei file originali
BACKUP_DIR=".quota-gauges-backup-$(date +%Y%m%d-%H%M%S)"
echo -e "${BLUE}Creazione backup in: $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"

# File da modificare
FILES_TO_BACKUP=(
    "app/controllers/cloud_tenant_dashboard_controller.rb"
    "app/services/cloud_tenant_dashboard_service.rb"
    "app/javascript/packs/component-definitions-common.js"
    "app/views/cloud_tenant/_show_dashboard.html.haml"
)

for file in "${FILES_TO_BACKUP[@]}"; do
    if [ -f "$file" ]; then
        mkdir -p "$BACKUP_DIR/$(dirname "$file")"
        cp "$file" "$BACKUP_DIR/$file"
        echo -e "${GREEN}✓${NC} Backup: $file"
    fi
done

echo ""
echo -e "${BLUE}Copia dei file del plugin...${NC}"

# Crea la directory del plugin
mkdir -p app/javascript/components/cloud-tenant-quota-gauges
echo -e "${GREEN}✓${NC} Directory plugin creata"

# Copia i file del plugin (questi sono nella repo corrente)
cp -v "$PLUGIN_SOURCE_DIR"/*.jsx app/javascript/components/cloud-tenant-quota-gauges/
cp -v "$PLUGIN_SOURCE_DIR"/*.scss app/javascript/components/cloud-tenant-quota-gauges/
cp -v "$PLUGIN_SOURCE_DIR"/README.md app/javascript/components/cloud-tenant-quota-gauges/

echo -e "${GREEN}✓${NC} File plugin copiati"
echo ""

echo -e "${BLUE}I seguenti file devono essere modificati manualmente:${NC}"
echo -e "  1. app/controllers/cloud_tenant_dashboard_controller.rb"
echo -e "  2. app/services/cloud_tenant_dashboard_service.rb"
echo -e "  3. app/javascript/packs/component-definitions-common.js"
echo -e "  4. app/views/cloud_tenant/_show_dashboard.html.haml"
echo ""
echo -e "${BLUE}Consulta il file README.md nella directory del plugin per le istruzioni.${NC}"
echo -e "${BLUE}Percorso: app/javascript/components/cloud-tenant-quota-gauges/README.md${NC}"
echo ""
echo -e "${GREEN}Backup salvato in: $BACKUP_DIR${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Plugin copiato con successo!${NC}"
echo -e "${BLUE}========================================${NC}"
