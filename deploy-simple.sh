#!/bin/bash
# Simple deployment without Docker - just Node.js + PM2

set -e

VPS_HOST="72.62.235.141"
VPS_USER="root"
APP_DIR="/opt/agentix-travel"
DOMAIN="travel.agentixai.cloud"

echo "=== Agentix Travel Deployment ==="

# Create deployment package
echo "Creating deployment package..."
tar -czf /tmp/agentix-deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    -C "$(dirname "$0")" .

# Upload
echo "Uploading to VPS..."
scp /tmp/agentix-deploy.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

# Deploy
echo "Deploying..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
set -e

APP_DIR="/opt/agentix-travel"

# Install Node.js if needed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 if needed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Setup app directory
mkdir -p ${APP_DIR}
cd ${APP_DIR}

# Stop existing app
pm2 stop agentix-travel 2>/dev/null || true

# Extract new files
tar -xzf /tmp/agentix-deploy.tar.gz
rm /tmp/agentix-deploy.tar.gz

# Create .env if needed
if [ ! -f .env ]; then
    echo "LITEAPI_KEY=" > .env
fi

# Install dependencies and build
echo "Installing dependencies..."
npm ci

echo "Building..."
npm run build

# Start with PM2
echo "Starting app..."
pm2 delete agentix-travel 2>/dev/null || true
pm2 start npm --name "agentix-travel" -- start
pm2 save

echo ""
echo "=== Deployment complete ==="
echo "App running on port 3000"
ENDSSH

echo ""
echo "Site: http://${VPS_HOST}:3000"
echo "Site: http://${DOMAIN}:3000"
