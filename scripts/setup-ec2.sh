#!/bin/bash

# Musical Zoe - AWS EC2 Deployment Script
# This script sets up the production environment on AWS EC2

set -euo pipefail

# Configuration variables
APP_NAME="musical-zoe"
APP_USER="musicalzoe"
APP_DIR="/opt/musicalzoe"
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
LOG_DIR="/var/log/musicalzoe"

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

log_info "Starting Musical Zoe deployment setup..."

# Update system packages
log_info "Updating system packages..."
apt-get update && apt-get upgrade -y

# Install required packages
log_info "Installing required packages..."
apt-get install -y \
    nginx \
    nodejs \
    npm \
    curl \
    wget \
    unzip \
    git \
    htop \
    ufw \
    fail2ban \
    awscli

# Install PM2 globally
log_info "Installing PM2..."
npm install -g pm2@latest

# Create application user
if ! id "$APP_USER" &>/dev/null; then
    log_info "Creating application user: $APP_USER"
    useradd -r -m -s /bin/bash $APP_USER
    usermod -aG www-data $APP_USER
else
    log_info "User $APP_USER already exists"
fi

# Create application directories
log_info "Creating application directories..."
mkdir -p $APP_DIR/{app,logs,backups}
mkdir -p $LOG_DIR
chown -R $APP_USER:$APP_USER $APP_DIR
chown -R $APP_USER:$APP_USER $LOG_DIR

# Configure firewall
log_info "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Configure fail2ban
log_info "Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# Setup PM2 for auto-startup
log_info "Setting up PM2 startup..."
sudo -u $APP_USER bash -c "
    cd $APP_DIR
    pm2 startup systemd -u $APP_USER --hp /home/$APP_USER
"

# Create systemd service for PM2
log_info "Creating PM2 systemd service..."
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $APP_USER --hp /home/$APP_USER

# Setup log rotation
log_info "Setting up log rotation..."
cat > /etc/logrotate.d/musicalzoe << EOF
$LOG_DIR/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0644 $APP_USER $APP_USER
    postrotate
        systemctl reload nginx
    endscript
}

$APP_DIR/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0644 $APP_USER $APP_USER
    postrotate
        sudo -u $APP_USER pm2 reloadLogs
    endscript
}
EOF

# Create environment file template
log_info "Creating environment file template..."
cat > $APP_DIR/.env.template << 'EOF'
# Musical Zoe Environment Configuration
NODE_ENV=production
PORT=3000
HOST=127.0.0.1

# Database Configuration (update with your values)
DATABASE_URL=postgresql://username:password@localhost:5432/musicalzoe

# JWT Secret (generate a secure random string)
JWT_SECRET=your-jwt-secret-here

# API Keys (add your actual API keys)
OPENAI_API_KEY=your-openai-api-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# AWS Configuration (if using AWS services)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email Configuration (if using email services)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
EOF

chown $APP_USER:$APP_USER $APP_DIR/.env.template

# Set proper permissions
log_info "Setting file permissions..."
chmod 755 $APP_DIR
chmod 755 $APP_DIR/app
chmod 755 $APP_DIR/logs
chmod 755 $APP_DIR/backups
chmod 600 $APP_DIR/.env.template

log_info "Basic setup completed!"
log_info "Next steps:"
log_info "1. Configure your environment variables in $APP_DIR/.env"
log_info "2. Deploy your application files to $APP_DIR/app"
log_info "3. Configure NGINX with your domain/SSL certificates"
log_info "4. Start your application with PM2"
log_info ""
log_warn "Remember to:"
log_warn "- Update the .env file with your actual configuration"
log_warn "- Configure SSL certificates for production"
log_warn "- Set up monitoring and alerts"
log_warn "- Configure database connections"
log_warn "- Test the deployment thoroughly"
