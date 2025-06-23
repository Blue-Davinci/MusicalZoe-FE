#!/bin/bash
# Musical Zoe - Local Testing Script
# This script helps you test the NGINX configuration locally

set -e

echo "🎵 Musical Zoe - Local NGINX Testing Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NGINX_PORT=8080
SVELTEKIT_PORT=3000
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}Project root: ${PROJECT_ROOT}${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    if command_exists lsof; then
        lsof -ti:$1 >/dev/null 2>&1
    elif command_exists netstat; then
        netstat -an | grep ":$1 " >/dev/null 2>&1
    else
        return 1
    fi
}

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js is available${NC}"

if ! command_exists npm; then
    echo -e "${RED}❌ NPM is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ NPM is available${NC}"

# Check for NGINX (system only)
if ! command_exists nginx; then
    echo -e "${RED}❌ System NGINX is not installed${NC}"
    echo -e "${YELLOW}Install NGINX:${NC}"
    echo -e "${YELLOW}  Ubuntu/Debian: sudo apt-get install nginx${NC}"
    echo -e "${YELLOW}  CentOS/RHEL:   sudo yum install nginx${NC}"
    echo -e "${YELLOW}  macOS:         brew install nginx${NC}"
    exit 1
fi
echo -e "${GREEN}✅ System NGINX is available${NC}"

# Build the SvelteKit application
echo -e "\n${YELLOW}Building SvelteKit application...${NC}"
cd "$PROJECT_ROOT"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found in project root${NC}"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file for testing...${NC}"
    cat > .env << 'EOF'
# Test environment variables
API_BASE_URL=http://localhost:4000/v1
API_SIGNUP_URL=http://localhost:4000/v1/api
API_ACTIVATION_URL=http://localhost:4000/v1/api/activated
API_AUTHENTICATION_URL=http://localhost:4000/v1/api/authentication
MUSIC_API_NEWS_URL=http://localhost:4000/v1/musical/news
MUSIC_API_TRENDS_URL=http://localhost:4000/v1/musical/trends
MUSIC_API_LYRICS_URL=http://localhost:4000/v1/musical/lyrics
MUSIC_API_TRACK_INFO_URL=http://localhost:4000/v1/musical/track-info
MUSIC_API_HEALTH_URL=http://localhost:4000/v1/health

VITE_API_BASE_URL=http://localhost:4000/v1
VITE_API_SIGNUP_URL=http://localhost:4000/v1/api
VITE_API_ACTIVATION_URL=http://localhost:4000/v1/api/activated
VITE_API_AUTHENTICATION_URL=http://localhost:4000/v1/api/authentication
VITE_MUSIC_API_NEWS_URL=http://localhost:4000/v1/musical/news
VITE_MUSIC_API_TRENDS_URL=http://localhost:4000/v1/musical/trends
VITE_MUSIC_API_LYRICS_URL=http://localhost:4000/v1/musical/lyrics
VITE_MUSIC_API_TRACK_INFO_URL=http://localhost:4000/v1/musical/track-info
VITE_MUSIC_API_HEALTH_URL=http://localhost:4000/v1/health
VITE_APP_NAME="Musical Zoe"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENV="development"
EOF
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

if [ ! -d "build" ] && [ ! -d ".svelte-kit/output" ]; then
    echo -e "${RED}❌ Build failed - no build directory found${NC}"
    exit 1
fi

# Determine build directory
BUILD_DIR=""
if [ -d ".svelte-kit/output" ]; then
    BUILD_DIR=".svelte-kit/output"
elif [ -d "build" ]; then
    BUILD_DIR="build"
fi

echo -e "${GREEN}✅ Application built successfully in ${BUILD_DIR}${NC}"

# Check if ports are available
echo -e "\n${YELLOW}Checking port availability...${NC}"

if port_in_use $SVELTEKIT_PORT; then
    echo -e "${RED}❌ Port $SVELTEKIT_PORT is already in use${NC}"
    echo -e "${YELLOW}Stop the process using: sudo lsof -ti:$SVELTEKIT_PORT | xargs kill${NC}"
    exit 1
fi

if port_in_use $NGINX_PORT; then
    echo -e "${RED}❌ Port $NGINX_PORT is already in use${NC}"
    echo -e "${YELLOW}Stop the process using: sudo lsof -ti:$NGINX_PORT | xargs kill${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Ports $SVELTEKIT_PORT and $NGINX_PORT are available${NC}"

# Start SvelteKit application in background
echo -e "\n${YELLOW}Starting SvelteKit application...${NC}"
cd "$PROJECT_ROOT"

# Start the preview server (production build)
echo -e "${BLUE}Starting SvelteKit preview server...${NC}"
npm run preview -- --port $SVELTEKIT_PORT &
SVELTEKIT_PID=$!
echo -e "${GREEN}✅ SvelteKit preview server started with PID: $SVELTEKIT_PID${NC}"

# Wait for SvelteKit to start
echo -e "${YELLOW}Waiting for SvelteKit to start...${NC}"
sleep 5

# Test SvelteKit is running
if ! curl -s "http://localhost:$SVELTEKIT_PORT/api/health" >/dev/null 2>&1; then
    echo -e "${RED}❌ SvelteKit health check failed${NC}"
    kill $SVELTEKIT_PID 2>/dev/null || true
    exit 1
fi
echo -e "${GREEN}✅ SvelteKit is running and healthy${NC}"

# Start NGINX
echo -e "\n${YELLOW}Starting NGINX...${NC}"

# Create temporary NGINX config
TEMP_NGINX_CONF="/tmp/musical-zoe-nginx.conf"
cat > "$TEMP_NGINX_CONF" << EOF
user $(whoami);
worker_processes 1;
error_log /tmp/nginx-error.log;
pid /tmp/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    access_log /tmp/nginx-access.log;
    
    upstream sveltekit_backend {
        server 127.0.0.1:$SVELTEKIT_PORT;
    }
    
    server {
        listen $NGINX_PORT;
        server_name localhost;
        
        # Health check endpoint
        location /health {
            proxy_pass http://sveltekit_backend/health;
            proxy_http_version 1.1;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # API routes
        location /api/ {
            proxy_pass http://sveltekit_backend;
            proxy_http_version 1.1;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # Main application
        location / {
            proxy_pass http://sveltekit_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
        }
    }
}
EOF

# Start NGINX with custom config
nginx -c "$TEMP_NGINX_CONF" -g "daemon off;" &
NGINX_PID=$!
echo -e "${GREEN}✅ NGINX started with PID: $NGINX_PID${NC}"

# Wait for NGINX to start
echo -e "${YELLOW}Waiting for NGINX to start...${NC}"
sleep 3

# Test the complete setup
echo -e "\n${YELLOW}Testing the complete setup...${NC}"

# Test NGINX is responding
if curl -s "http://localhost:$NGINX_PORT" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ NGINX is responding on port $NGINX_PORT${NC}"
else
    echo -e "${RED}❌ NGINX test failed${NC}"
fi

# Test API proxy
if curl -s "http://localhost:$NGINX_PORT/api/health" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ API proxy is working${NC}"
else
    echo -e "${YELLOW}⚠️  API proxy test failed (API server may not be running)${NC}"
fi

# Display results
echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo -e "${BLUE}=========================================="
echo -e "🎵 Musical Zoe is now running:"
echo -e "   • SvelteKit App: http://localhost:$SVELTEKIT_PORT"
echo -e "   • NGINX Proxy:   http://localhost:$NGINX_PORT"
echo -e "   • Health Check:  http://localhost:$NGINX_PORT/health"
echo -e "=========================================="
echo -e ""
echo -e "${YELLOW}To stop the services:${NC}"
echo -e "   • Kill SvelteKit: kill $SVELTEKIT_PID"
echo -e "   • Kill NGINX: kill $NGINX_PID"
echo -e ""
echo -e "${YELLOW}Logs:${NC}"
echo -e "   • SvelteKit: Check terminal output"
echo -e "   • NGINX Access: /tmp/nginx-access.log"
echo -e "   • NGINX Error:  /tmp/nginx-error.log"
echo -e "${NC}"

# Keep script running
echo -e "${BLUE}Press Ctrl+C to stop all services...${NC}"
trap 'echo -e "\n${YELLOW}Stopping services...${NC}"; kill $SVELTEKIT_PID 2>/dev/null || true; kill $NGINX_PID 2>/dev/null || true; rm -f /tmp/musical-zoe-nginx.conf; echo -e "${GREEN}Services stopped${NC}"; exit 0' INT

# Wait indefinitely
while true; do
    sleep 1
done
