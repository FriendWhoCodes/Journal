#!/bin/bash

# Man of Wisdom Homepage Deployment Script for Hetzner
# This script should be run on the Hetzner server

set -e # Exit on any error

echo "Starting deployment..."

# Configuration
APP_DIR="/var/www/Journal/homepage"
APP_NAME="mow-homepage"

# Navigate to homepage app directory (git pull already done by workflow)
cd $APP_DIR || exit 1

echo "Installing dependencies..."
# Use npm install instead of npm ci to handle lock file mismatches
npm install --legacy-peer-deps

echo "Building application..."
npm run build

echo "Restarting PM2..."
pm2 restart $APP_NAME || pm2 start ecosystem.config.js

echo "Saving PM2 configuration..."
pm2 save

echo "Deployment complete!"

# Show status
pm2 status $APP_NAME
