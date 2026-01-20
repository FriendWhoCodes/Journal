#!/bin/bash

# Goal Setter Deployment Script for Hetzner
# This script should be run on the Hetzner server

set -e # Exit on any error

echo "🚀 Starting deployment..."

# Configuration
REPO_DIR="/var/www/Journal"
APP_DIR="/var/www/Journal/goal-setter"
BRANCH="main"
APP_NAME="goal-setter"

# Navigate to repo root and pull
cd $REPO_DIR || exit 1

echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/$BRANCH

# Navigate to goal-setter app directory
cd $APP_DIR || exit 1

echo "📦 Installing dependencies..."
npm ci --production=false

echo "🏗️  Building application..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart $APP_NAME || pm2 start ecosystem.config.js

echo "💚 Saving PM2 configuration..."
pm2 save

echo "✅ Deployment complete!"

# Show status
pm2 status $APP_NAME
