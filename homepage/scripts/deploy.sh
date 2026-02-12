#!/bin/bash

# Man of Wisdom Homepage - Zero-Downtime Deployment Script
# This script ensures the site stays up during deployments

set -e # Exit on any error

# Configuration
APP_DIR="/var/www/Journal/homepage"
APP_NAME="mow-homepage"
LOCK_FILE="/tmp/mow-homepage-deploy.lock"
HEALTH_CHECK_URL="http://localhost:3003"
MAX_HEALTH_RETRIES=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Cleanup function
cleanup() {
    rm -f "$LOCK_FILE"
}
trap cleanup EXIT

# Check for concurrent deployments
if [ -f "$LOCK_FILE" ]; then
    LOCK_AGE=$(($(date +%s) - $(stat -c %Y "$LOCK_FILE" 2>/dev/null || echo 0)))
    if [ "$LOCK_AGE" -lt 300 ]; then
        log_warn "Another deployment is in progress (lock age: ${LOCK_AGE}s). Waiting..."
        sleep 30
        if [ -f "$LOCK_FILE" ]; then
            log_error "Deployment still locked after waiting. Exiting."
            exit 1
        fi
    else
        log_warn "Stale lock file found (age: ${LOCK_AGE}s). Removing..."
        rm -f "$LOCK_FILE"
    fi
fi

# Required environment variables
REQUIRED_ENV_VARS=(
  "RESEND_API_KEY"
  "RESEND_SEGMENT_ID"
)

# Validate required env vars before doing anything
ENV_FILE="$APP_DIR/.env"
if [ -f "$ENV_FILE" ]; then
    MISSING=()
    for var in "${REQUIRED_ENV_VARS[@]}"; do
        if ! grep -q "^${var}=" "$ENV_FILE"; then
            MISSING+=("$var")
        fi
    done

    if [ ${#MISSING[@]} -gt 0 ]; then
        log_error "Missing required env vars in $ENV_FILE:"
        for var in "${MISSING[@]}"; do
            echo "  - $var"
        done
        log_error "Aborting deploy. Current version is still running."
        exit 1
    fi
    log_info "All required env vars present."
fi

# Create lock file
echo $$ > "$LOCK_FILE"
log_info "Starting deployment (PID: $$)..."

# Navigate to app directory
cd "$APP_DIR" || exit 1

# Backup current build
if [ -d ".next" ]; then
    log_info "Backing up current build..."
    rm -rf .next.backup
    cp -r .next .next.backup
fi

# Install dependencies
log_info "Installing dependencies..."
npm install --legacy-peer-deps --silent

# Build application
log_info "Building application..."
if ! npm run build; then
    log_error "Build failed! Restoring backup..."
    if [ -d ".next.backup" ]; then
        rm -rf .next
        mv .next.backup .next
    fi
    exit 1
fi

# Remove backup after successful build
rm -rf .next.backup

# Graceful reload (zero-downtime)
log_info "Reloading PM2 (graceful)..."
pm2 reload "$APP_NAME" --update-env || pm2 start ecosystem.config.js

# Health check
log_info "Running health check..."
RETRIES=0
while [ $RETRIES -lt $MAX_HEALTH_RETRIES ]; do
    sleep 2
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        log_info "Health check passed! (HTTP $HTTP_CODE)"
        break
    fi
    RETRIES=$((RETRIES + 1))
    log_warn "Health check attempt $RETRIES/$MAX_HEALTH_RETRIES (HTTP $HTTP_CODE)"
done

if [ $RETRIES -eq $MAX_HEALTH_RETRIES ]; then
    log_error "Health check failed after $MAX_HEALTH_RETRIES attempts!"
    exit 1
fi

# Save PM2 configuration
pm2 save --silent

log_info "Deployment complete!"
pm2 status "$APP_NAME"
