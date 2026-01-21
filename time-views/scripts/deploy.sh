#!/bin/bash

# Time Views Deployment Script for Hetzner
# This script should be run on the Hetzner server

set -e # Exit on any error

echo "Starting deployment..."

# Configuration
REPO_DIR="/var/www/Journal"
APP_DIR="/var/www/Journal/time-views"
BRANCH="main"
APP_NAME="time-views"

# Navigate to repo root and pull
cd $REPO_DIR || exit 1

echo "Pulling latest code..."
git fetch origin
git reset --hard origin/$BRANCH

# Navigate to time-views app directory
cd $APP_DIR || exit 1

echo "Installing dependencies..."
# Install root dependencies first (for workspace packages)
cd $REPO_DIR
npm install --legacy-peer-deps

# Then install app dependencies
cd $APP_DIR
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
