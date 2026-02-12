#!/bin/bash

# Goal Setter Deployment Script for Hetzner
# This script should be run on the Hetzner server

set -e # Exit on any error

echo "Starting deployment..."

# Configuration
REPO_DIR="/var/www/Journal"
APP_DIR="/var/www/Journal/goal-setter"
BRANCH="main"
APP_NAME="goal-setter"
REQUIRED_ENV_VARS=(
  "DATABASE_URL"
  "NEXT_PUBLIC_APP_URL"
  "RESEND_API_KEY"
  "RESEND_SEGMENT_ID"
)

# Validate required env vars before doing anything
echo "Validating environment variables..."
ENV_FILE="$APP_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found! Aborting deploy."
  exit 1
fi

MISSING=()
for var in "${REQUIRED_ENV_VARS[@]}"; do
  if ! grep -q "^${var}=" "$ENV_FILE"; then
    MISSING+=("$var")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "ERROR: Missing required env vars in $ENV_FILE:"
  for var in "${MISSING[@]}"; do
    echo "  - $var"
  done
  echo "Aborting deploy. Current version is still running."
  exit 1
fi
echo "All required env vars present."

# Navigate to repo root and pull
cd "$REPO_DIR" || exit 1

echo "Pulling latest code..."
git fetch origin
git reset --hard "origin/$BRANCH"

# Install root dependencies first (for workspace packages)
echo "Installing root dependencies..."
npm install --legacy-peer-deps

# Navigate to goal-setter app directory
cd "$APP_DIR" || exit 1

echo "Installing app dependencies..."
npm install --legacy-peer-deps

echo "Building application..."
npm run build

echo "Restarting PM2..."
pm2 restart "$APP_NAME" || pm2 start ecosystem.config.js

echo "Saving PM2 configuration..."
pm2 save

echo "Deployment complete!"

# Show status
pm2 status "$APP_NAME"
