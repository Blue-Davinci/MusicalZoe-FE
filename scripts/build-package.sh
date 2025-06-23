#!/bin/bash

# Musical Zoe - Local Build and Package Script
# This script builds the application and creates a deployment package

set -euo pipefail

# Configuration
BUILD_DIR=".svelte-kit/output"
PACKAGE_NAME="musicalzoe-build-$(date +%Y%m%d-%H%M%S).tar.gz"
TEMP_DIR=$(mktemp -d)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

log_info "Starting build process..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "svelte.config.js" ]; then
    log_error "This doesn't appear to be a SvelteKit project directory"
    exit 1
fi

# Install dependencies
log_info "Installing dependencies..."
npm ci

# Run build
log_info "Building application..."
npm run build

# Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
    log_error "Build failed - output directory not found"
    exit 1
fi

# Create package structure
log_info "Creating deployment package..."
mkdir -p "$TEMP_DIR/app/.svelte-kit"

# Copy built application
cp -r "$BUILD_DIR" "$TEMP_DIR/app/.svelte-kit/output"

# Copy package.json and package-lock.json
cp package.json "$TEMP_DIR/app/"
cp package-lock.json "$TEMP_DIR/app/"

# Copy static files if they exist
if [ -d "static" ]; then
    cp -r static "$TEMP_DIR/app/"
fi

# Copy deployment configurations
if [ -d "nginx" ]; then
    cp -r nginx "$TEMP_DIR/app/"
fi

# Copy scripts
if [ -d "scripts" ]; then
    cp -r scripts "$TEMP_DIR/app/"
fi

# Copy environment template
if [ -f ".env.example" ]; then
    cp .env.example "$TEMP_DIR/app/"
fi

# Create README for deployment
cat > "$TEMP_DIR/app/DEPLOYMENT.md" << 'EOF'
# Musical Zoe - Deployment Package

This package contains the built SvelteKit application ready for production deployment.

## Contents

- `.svelte-kit/output/` - Built application (server and client)
- `package.json` - Dependencies information
- `nginx/` - NGINX configuration files
- `scripts/` - Deployment scripts
- `static/` - Static assets (if any)

## Deployment Steps

1. Extract this package to your target directory (e.g., /opt/musicalzoe/app)
2. Install production dependencies: `npm ci --only=production`
3. Configure environment variables in `.env`
4. Configure NGINX using the provided configuration files
5. Start the application with PM2: `pm2 start nginx/ecosystem.config.js`

## Server Entry Point

The Node.js server entry point is: `.svelte-kit/output/server/index.js`
Static files are served from: `.svelte-kit/output/client/`

## Environment Variables

Copy `.env.example` to `.env` and configure your environment variables.

## Health Check

The application provides a health check endpoint at `/health`
EOF

# Create the package
cd "$TEMP_DIR"
tar -czf "../$PACKAGE_NAME" app/
mv "../$PACKAGE_NAME" "$OLDPWD/"

log_info "✅ Build package created: $PACKAGE_NAME"
log_info "Package contents:"
tar -tzf "$PACKAGE_NAME" | head -20
if [ $(tar -tzf "$PACKAGE_NAME" | wc -l) -gt 20 ]; then
    echo "... and $(( $(tar -tzf "$PACKAGE_NAME" | wc -l) - 20 )) more files"
fi

# Optional: Upload to S3 if AWS CLI is configured and bucket is specified
if [ -n "${S3_BUCKET:-}" ]; then
    log_info "Uploading to S3 bucket: $S3_BUCKET"
    aws s3 cp "$PACKAGE_NAME" "s3://$S3_BUCKET/builds/$PACKAGE_NAME"
    log_info "✅ Package uploaded to S3: s3://$S3_BUCKET/builds/$PACKAGE_NAME"
fi

log_info "🎉 Build and packaging completed successfully!"
log_info ""
log_info "Next steps:"
log_info "1. Copy $PACKAGE_NAME to your target server"
log_info "2. Run the deployment script on the server"
log_info "3. Or use the S3 upload feature for automated deployment"
