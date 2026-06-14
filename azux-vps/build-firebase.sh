#!/bin/bash
# Firebase Hosting Build Script
# This script builds the TanStack Start app and restructures it for Firebase static hosting

set -e  # Exit on error

echo "=========================================="
echo "AZUX WMS - Firebase Hosting Build"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean old dist
echo -e "${YELLOW}Step 1: Cleaning old build...${NC}"
if [ -d "dist" ]; then
  rm -rf dist
  echo "Removed old dist folder"
fi
echo ""

# Step 2: Build the app
echo -e "${YELLOW}Step 2: Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Step 3: Restructure for Firebase
echo -e "${YELLOW}Step 3: Restructuring for Firebase Hosting...${NC}"

# Copy client files to dist root
if [ -d "dist/client" ]; then
  cp -r dist/client/* dist/ 2>/dev/null || true
  rm -rf dist/client
  echo "Copied client files to dist root"
fi

# Remove server folder (not needed for static hosting)
if [ -d "dist/server" ]; then
  rm -rf dist/server
  echo "Removed server folder"
fi

# Copy index.html from public if not present
if [ ! -f "dist/index.html" ] && [ -f "public/index.html" ]; then
  cp public/index.html dist/index.html
  echo "Added index.html entry point"
fi

echo -e "${GREEN}✓ Restructured for Firebase Hosting${NC}"
echo ""

# Step 4: Show build summary
echo -e "${YELLOW}Build Summary:${NC}"
echo "Distribution size: $(du -sh dist | cut -f1)"
echo "Number of files: $(find dist -type f | wc -l)"
echo ""

# Step 5: Firebase deployment option
echo -e "${GREEN}✓ Build ready for deployment!${NC}"
echo ""
echo "To deploy to Firebase Hosting, run:"
echo "  firebase deploy --only hosting --project wms-3pl-app"
echo ""
echo "Or deploy automatically with:"
echo "  firebase deploy --only hosting --project wms-3pl-app && echo '✓ Deployed!'"
echo ""
