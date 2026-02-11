#!/bin/bash
set -e

# Chime Clone API — Production Deployment Script
# Server: 193.46.198.236
# Path: /var/www/chime-clone-api

SERVER="root@193.46.198.236"
REMOTE_DIR="/var/www/chime-clone-api"
PM2_APP="chime-api"

echo "=== Chime Clone API — Production Deploy ==="

# Step 1: Build locally to catch errors early
echo "[1/4] Building locally to verify..."
npm run build

# Step 2: SSH into server, pull latest code, install & build
echo "[2/4] Deploying to server..."
ssh $SERVER << 'ENDSSH'
  cd /var/www/chime-clone-api

  echo "  Pulling latest code..."
  git pull origin main

  echo "  Installing dependencies..."
  npm install --production=false

  echo "  Building..."
  npm run build

  echo "  Copying production env..."
  cp .env.production .env
ENDSSH

# Step 3: Restart PM2
echo "[3/4] Restarting PM2..."
ssh $SERVER << 'ENDSSH'
  cd /var/www/chime-clone-api
  pm2 delete chime-api 2>/dev/null || true
  pm2 start ecosystem.config.js --env production
  pm2 save
ENDSSH

# Step 4: Health check
echo "[4/4] Running health check..."
sleep 3
RESPONSE=$(ssh $SERVER "curl -s -o /dev/null -w '%{http_code}' -X POST http://localhost:4000/graphql -H 'Content-Type: application/json' -d '{\"query\":\"{ __typename }\"}'")

if [ "$RESPONSE" = "200" ]; then
  echo "Deploy successful! API is responding (HTTP $RESPONSE)"
else
  echo "WARNING: API returned HTTP $RESPONSE. Check logs with: ssh $SERVER 'pm2 logs chime-api --lines 20'"
fi

echo "=== Done ==="
