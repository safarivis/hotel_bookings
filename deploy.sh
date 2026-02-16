#!/bin/bash
# Deploy StayBook to VPS

set -e

# Configuration
VPS_HOST="72.62.235.141"
VPS_USER="root"
APP_DIR="/opt/staybook"
DOMAIN="${1:-}"  # Pass domain as first argument

echo "=== StayBook Deployment ==="

# Check if we're deploying with a domain
if [ -n "$DOMAIN" ]; then
    echo "Deploying with domain: $DOMAIN"
else
    echo "Deploying without domain (HTTP only on port 3000)"
fi

# Create deployment package
echo "Creating deployment package..."
tar -czf /tmp/staybook-deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=.git \
    -C "$(dirname "$0")" .

# Upload to VPS
echo "Uploading to VPS..."
scp /tmp/staybook-deploy.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

# Deploy on VPS
echo "Deploying on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << ENDSSH
set -e

# Create app directory
mkdir -p ${APP_DIR}
cd ${APP_DIR}

# Extract files
tar -xzf /tmp/staybook-deploy.tar.gz
rm /tmp/staybook-deploy.tar.gz

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "LITEAPI_KEY=" > .env
    echo "Created .env file - add your LiteAPI key"
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
fi

# Build and run with Docker Compose
if [ -n "$DOMAIN" ]; then
    # With domain and SSL
    sed -i "s/yourdomain.com/${DOMAIN}/g" nginx.conf

    # Create certbot directories
    mkdir -p certbot/conf certbot/www

    # Get initial SSL certificate
    docker run --rm -v \$(pwd)/certbot/conf:/etc/letsencrypt -v \$(pwd)/certbot/www:/var/www/certbot certbot/certbot certonly --webroot -w /var/www/certbot -d ${DOMAIN} --email admin@${DOMAIN} --agree-tos --non-interactive || true

    docker compose up -d --build
else
    # Simple deployment without SSL
    docker compose up -d --build staybook
fi

echo "Deployment complete!"
ENDSSH

echo ""
echo "=== Deployment Complete ==="
if [ -n "$DOMAIN" ]; then
    echo "Site available at: https://${DOMAIN}"
else
    echo "Site available at: http://${VPS_HOST}:3000"
fi
echo ""
echo "To add your LiteAPI key:"
echo "  ssh ${VPS_USER}@${VPS_HOST}"
echo "  cd ${APP_DIR}"
echo "  echo 'LITEAPI_KEY=your_key_here' > .env"
echo "  docker compose up -d --build"
