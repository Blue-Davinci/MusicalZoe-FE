#!/bin/bash

# Musical Zoe - Application Deployment Script
# This script deploys the built application to the EC2 instance

set -euo pipefail

# Configuration variables
APP_NAME="musical-zoe"
APP_USER="musicalzoe"
APP_DIR="/opt/musicalzoe"
BACKUP_DIR="$APP_DIR/backups"
LOG_DIR="/var/log/musicalzoe"
BUILD_ARCHIVE="musicalzoe-build.tar.gz"

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

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   log_error "This script must be run as root (use sudo)"
   exit 1
fi

# Function to create backup
create_backup() {
    if [ -d "$APP_DIR/app" ]; then
        local backup_name="backup-$(date +%Y%m%d-%H%M%S).tar.gz"
        log_info "Creating backup: $backup_name"
        tar -czf "$BACKUP_DIR/$backup_name" -C "$APP_DIR" app
        
        # Keep only last 5 backups
        cd "$BACKUP_DIR"
        ls -t backup-*.tar.gz | tail -n +6 | xargs -r rm --
    fi
}

# Function to download from S3
download_from_s3() {
    local s3_bucket="$1"
    local s3_key="$2"
    local local_file="$3"
    
    log_info "Downloading from S3: s3://$s3_bucket/$s3_key"
    sudo -u $APP_USER aws s3 cp "s3://$s3_bucket/$s3_key" "$local_file"
}

# Function to get environment variables from SSM
get_env_from_ssm() {
    local env_path="$1"
    local env_file="$2"
    
    log_info "Retrieving environment variables from SSM Parameter Store"
    sudo -u $APP_USER aws ssm get-parameters-by-path \
        --path "$env_path" \
        --recursive \
        --with-decryption \
        --query 'Parameters[*].[Name,Value]' \
        --output text | \
        sed 's|^.*/||' | \
        sed 's/\t/=/' > "$env_file"
    
    chown $APP_USER:$APP_USER "$env_file"
    chmod 600 "$env_file"
}

# Main deployment function
deploy_application() {
    local s3_bucket="${1:-}"
    local s3_key="${2:-}"
    local ssm_path="${3:-}"
    local local_archive="${4:-}"
    
    log_info "Starting deployment process..."
    
    # Create backup
    create_backup
    
    # Stop application if running
    log_info "Stopping application..."
    sudo -u $APP_USER pm2 stop $APP_NAME || true
    
    # Download build archive
    if [ -n "$s3_bucket" ] && [ -n "$s3_key" ]; then
        download_from_s3 "$s3_bucket" "$s3_key" "/tmp/$BUILD_ARCHIVE"
        local_archive="/tmp/$BUILD_ARCHIVE"
    fi
    
    if [ -z "$local_archive" ] || [ ! -f "$local_archive" ]; then
        log_error "Build archive not found. Please provide S3 location or local file path."
        exit 1
    fi
    
    # Extract application
    log_info "Extracting application files..."
    rm -rf "$APP_DIR/app"
    mkdir -p "$APP_DIR/app"
    tar -xzf "$local_archive" -C "$APP_DIR/app"
    chown -R $APP_USER:$APP_USER "$APP_DIR/app"
    
    # Install/update dependencies
    log_info "Installing dependencies..."
    cd "$APP_DIR/app"
    sudo -u $APP_USER npm ci --only=production --no-audit --no-fund
    
    # Get environment variables from SSM
    if [ -n "$ssm_path" ]; then
        get_env_from_ssm "$ssm_path" "$APP_DIR/app/.env"
    elif [ -f "$APP_DIR/.env" ]; then
        log_info "Using existing environment file"
        cp "$APP_DIR/.env" "$APP_DIR/app/.env"
        chown $APP_USER:$APP_USER "$APP_DIR/app/.env"
    else
        log_warn "No environment configuration found. Using defaults."
    fi
    
    # Update NGINX configuration if provided
    if [ -f "$APP_DIR/app/nginx/sites-available/musicalzoe.conf" ]; then
        log_info "Updating NGINX configuration..."
        cp "$APP_DIR/app/nginx/sites-available/musicalzoe.conf" "/etc/nginx/sites-available/musicalzoe"
        ln -sf "/etc/nginx/sites-available/musicalzoe" "/etc/nginx/sites-enabled/musicalzoe"
        nginx -t && systemctl reload nginx
    fi
    
    # Start application with PM2
    log_info "Starting application..."
    cd "$APP_DIR/app"
    sudo -u $APP_USER pm2 start nginx/ecosystem.config.js
    sudo -u $APP_USER pm2 save
    
    # Wait for application to start
    sleep 10
    
    # Check application health
    log_info "Checking application health..."
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_info "✅ Application is healthy"
    else
        log_error "❌ Application health check failed"
        # Show recent logs
        sudo -u $APP_USER pm2 logs $APP_NAME --lines 20
        exit 1
    fi
    
    # Check NGINX status
    if systemctl is-active --quiet nginx; then
        log_info "✅ NGINX is running"
    else
        log_error "❌ NGINX is not running"
        systemctl status nginx
        exit 1
    fi
    
    log_info "🎉 Deployment completed successfully!"
    log_info "Application status:"
    sudo -u $APP_USER pm2 status
}

# Script usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -b, --s3-bucket BUCKET    S3 bucket containing the build archive"
    echo "  -k, --s3-key KEY         S3 key/path to the build archive"
    echo "  -s, --ssm-path PATH      SSM Parameter Store path for environment variables"
    echo "  -f, --file FILE          Local build archive file"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -b my-bucket -k builds/latest.tar.gz -s /musicalzoe/prod"
    echo "  $0 -f /tmp/build.tar.gz"
}

# Parse command line arguments
S3_BUCKET=""
S3_KEY=""
SSM_PATH=""
LOCAL_FILE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--s3-bucket)
            S3_BUCKET="$2"
            shift 2
            ;;
        -k|--s3-key)
            S3_KEY="$2"
            shift 2
            ;;
        -s|--ssm-path)
            SSM_PATH="$2"
            shift 2
            ;;
        -f|--file)
            LOCAL_FILE="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Run deployment
deploy_application "$S3_BUCKET" "$S3_KEY" "$SSM_PATH" "$LOCAL_FILE"
