#!/bin/bash
# Script to compile webpack for Cloud Tenant Quota Gauges plugin
# Run this INSIDE the ManageIQ container

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Cloud Tenant Quota Gauges - Webpack Compiler${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Detect if we're in the container
if [ ! -f "/opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef/package.json" ]; then
    echo -e "${RED}Error: This script must be run INSIDE the ManageIQ container${NC}"
    echo -e "${YELLOW}Run: podman exec -it manageiq-debug-vol_patch bash${NC}"
    echo -e "${YELLOW}Then: cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef${NC}"
    echo -e "${YELLOW}Then: ./compile-quota-gauges.sh${NC}"
    exit 1
fi

# Change to ManageIQ UI Classic directory
cd /opt/manageiq/manageiq-gemset/bundler/gems/manageiq-ui-classic-baf2db024bef

echo -e "${BLUE}Step 1: Verifying plugin files...${NC}"

# Check if plugin files exist
PLUGIN_DIR="app/javascript/components/cloud-tenant-quota-gauges"
if [ ! -d "$PLUGIN_DIR" ]; then
    echo -e "${RED}✗ Plugin directory not found: $PLUGIN_DIR${NC}"
    exit 1
fi

if [ ! -f "$PLUGIN_DIR/index.jsx" ] || [ ! -f "$PLUGIN_DIR/quota-gauge.jsx" ] || [ ! -f "$PLUGIN_DIR/quota-gauges.scss" ]; then
    echo -e "${RED}✗ Plugin files missing in $PLUGIN_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Plugin files found${NC}"
echo ""

echo -e "${BLUE}Step 2: Checking Node.js environment...${NC}"

NODE_VERSION=$(node --version)
echo -e "  Node version: $NODE_VERSION"

if [ ! -d "node_modules" ]; then
    echo -e "${RED}✗ node_modules not found${NC}"
    echo -e "${YELLOW}Installing dependencies...${NC}"
    yarn install --frozen-lockfile
fi

if [ ! -d "node_modules/babel-loader" ]; then
    echo -e "${YELLOW}⚠ babel-loader missing, running yarn install...${NC}"
    yarn install --check-files
fi

echo -e "${GREEN}✓ Node.js environment ready${NC}"
echo ""

echo -e "${BLUE}Step 3: Cleaning previous builds...${NC}"

# Clean webpack cache
if [ -d "tmp/cache/webpacker" ]; then
    rm -rf tmp/cache/webpacker/*
    echo -e "${GREEN}✓ Webpack cache cleared${NC}"
fi

# Clean public packs (optional - comment out if you want to keep existing packs)
# if [ -d "public/packs" ]; then
#     rm -rf public/packs/*
#     echo -e "${GREEN}✓ Public packs cleared${NC}"
# fi

echo ""
echo -e "${BLUE}Step 4: Compiling webpack...${NC}"
echo -e "${YELLOW}This may take 5-10 minutes. Please be patient...${NC}"
echo ""

# Set Node options for OpenSSL compatibility
export NODE_OPTIONS=--openssl-legacy-provider
export NODE_ENV=production

# Run webpack compilation
if ./bin/webpack; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ Webpack compiled successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""

    echo -e "${BLUE}Compiled packs:${NC}"
    ls -lh public/packs/component-definitions-common*.js 2>/dev/null | head -5

    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Exit the container: ${YELLOW}exit${NC}"
    echo -e "  2. Restart ManageIQ: ${YELLOW}podman restart manageiq-debug-vol_patch${NC}"
    echo -e "  3. Wait for startup: ${YELLOW}podman logs -f manageiq-debug-vol_patch${NC}"
    echo -e "  4. Access web UI and navigate to: ${YELLOW}Compute → Clouds → Tenants → [Select Tenant] → Dashboard${NC}"
    echo ""
    echo -e "${GREEN}The quota gauges should now be visible!${NC}"

else
    echo ""
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}✗ Webpack compilation failed${NC}"
    echo -e "${RED}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  1. Check the error output above"
    echo -e "  2. Try reinstalling dependencies: ${YELLOW}yarn install --force${NC}"
    echo -e "  3. Check logs: ${YELLOW}cat log/webpack.log${NC}"
    echo -e "  4. Consult COMPILE_IN_CONTAINER.md for more help"
    exit 1
fi
