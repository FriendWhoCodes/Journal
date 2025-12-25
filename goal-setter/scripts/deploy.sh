#!/bin/bash

# Goal Setter Deployment Script for Hetzner
# This script should be run on the Hetzner server

set -e # Exit on any error

echo "🚀 Starting deployment..."

# Configuration
APP_DIR="/var/www/goal-setter"
REPO_URL="https://github.com/FriendWhoCodes/Journal.git"
BRANCH="main"  # Or your deployment branch
APP_NAME="goal-setter"

# Navigate to app directory
cd $APP_DIR || exit 1

echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/$BRANCH

# Navigate to goal-setter subdirectory
cd goal-setter || exit 1

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
