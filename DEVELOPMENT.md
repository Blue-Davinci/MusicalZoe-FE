# Musical Zoe - Development Guide

A simplified guide for local development and testing of the Musical Zoe SvelteKit application.

## 🚀 Quick Start

### Local Development (Simple)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access: http://localhost:5173
```

### Local Testing with NGINX (Production-like)
```bash
# Install NGINX first (if not installed)
# Ubuntu/Debian: sudo apt-get install nginx
# macOS: brew install nginx

# Run the test script
cd nginx
chmod +x test-local.sh
./test-local.sh

# Access: http://localhost:8080 (NGINX proxy)
# Direct:  http://localhost:3000 (SvelteKit)
```

## 📁 Simplified Project Structure

```
/
├── src/                    # SvelteKit application source
├── static/                 # Static assets
├── nginx/
│   ├── nginx.conf         # Main NGINX configuration
│   ├── test-local.sh      # Local testing script
│   └── sites-available/
│       └── musicalzoe.conf # Production site config
├── scripts/
│   ├── setup-ec2.sh       # EC2 server setup
│   ├── deploy.sh          # Deployment script
│   └── build-package.sh   # Build and package
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview built application (port 4173)

### Testing & Quality
- `npm run check` - Type checking
- `npm run lint` - ESLint checking
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests

### Local NGINX Testing
- `nginx/test-local.sh` - Test with NGINX proxy locally

### Production Deployment
- `scripts/setup-ec2.sh` - Set up EC2 server (run once)
- `scripts/build-package.sh` - Build and package for deployment
- `scripts/deploy.sh` - Deploy to EC2 server

## 🌐 Development Workflow

### 1. Daily Development
```bash
# Start development server
npm run dev

# Make changes to src/ files
# Browser auto-reloads at http://localhost:5173
```

### 2. Test Before Deployment
```bash
# Build and test locally
npm run build
npm run preview

# Test with NGINX (optional)
cd nginx && ./test-local.sh
```

### 3. Deploy to EC2
```bash
# Build and package
./scripts/build-package.sh

# Deploy to server
./scripts/deploy.sh
```

## 🔍 NGINX Local Testing

The `nginx/test-local.sh` script provides a production-like environment locally:

### What it does:
1. **Builds** your SvelteKit application
2. **Starts** SvelteKit server on port 3000
3. **Configures** NGINX to proxy requests
4. **Tests** the complete setup

### Access URLs:
- **Main App**: http://localhost:8080 (via NGINX)
- **Direct App**: http://localhost:3000 (direct to SvelteKit)
- **Health Check**: http://localhost:8080/health
- **API Endpoints**: http://localhost:8080/api/*

### Requirements:
- System NGINX installed
- Ports 3000 and 8080 available

## 🚨 Environment Variables

Create a `.env` file in the root directory:

```bash
# Server-side variables
API_BASE_URL=http://localhost:4000/v1
API_SIGNUP_URL=http://localhost:4000/v1/api
# ... (other API endpoints)

# Client-side variables (VITE_ prefix)
VITE_API_BASE_URL=http://localhost:4000/v1
VITE_APP_NAME="Musical Zoe"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENV="development"
```

## 🏗️ Production Deployment

### Architecture
```
Internet → EC2 Instance
           ├── NGINX (Port 80/443) → Reverse Proxy
           └── SvelteKit (Port 3000) → Node.js Server
                                    └── PM2 Process Manager
```

### Setup Steps
1. **Prepare EC2**: Run `scripts/setup-ec2.sh`
2. **Build**: Run `scripts/build-package.sh`
3. **Deploy**: Run `scripts/deploy.sh`

## 📊 Monitoring & Logs

### Local Development
- Development server logs in terminal
- Browser DevTools for client-side debugging

### Local NGINX Testing
- NGINX Access Log: `/tmp/nginx-access.log`
- NGINX Error Log: `/tmp/nginx-error.log`
- SvelteKit logs in terminal

### Production (EC2)
- PM2 process logs: `pm2 logs`
- NGINX logs: `/var/log/nginx/`
- Application logs: `/opt/musicalzoe/logs/`

## 🆘 Troubleshooting

### Port Already In Use
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :8080

# Kill the process
sudo lsof -ti :3000 | xargs kill
```

### NGINX Issues
```bash
# Check NGINX status
sudo systemctl status nginx

# Test NGINX config
sudo nginx -t

# View NGINX error logs
sudo tail -f /var/log/nginx/error.log
```

### Build Issues
```bash
# Clean build
rm -rf .svelte-kit node_modules
npm install
npm run build
```

---

This simplified setup focuses on **traditional EC2 deployment** while maintaining the ability to test locally with NGINX when needed.
