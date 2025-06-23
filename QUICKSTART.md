# Musical Zoe - Quick Start Guide

## Summary of Changes Made

I've updated the Musical Zoe application to be production-ready with the following changes:

### ✅ SvelteKit Configuration
- **Changed adapter**: From `@sveltejs/adapter-auto` to `@sveltejs/adapter-node`
- **Build output**: Now correctly outputs to `.svelte-kit/output/server/index.js` (Node.js server)
- **Static assets**: Available in `.svelte-kit/output/client/` (HTML, CSS, JS)

### ✅ Updated All Configurations
- **NGINX configs**: Updated to serve static files from `.svelte-kit/output/client/`
- **PM2 ecosystem**: Updated to start `.svelte-kit/output/server/index.js`
- **Docker files**: Updated to copy and run correct build output
- **Deployment scripts**: Created for AWS EC2 setup and deployment

---

## How to Start the App Locally

### Method 1: Direct Node.js (Recommended for Testing)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the server**:
   ```bash
   node .svelte-kit/output/server/index.js
   ```

3. **Access**: http://localhost:3000

**What's happening**: The Node.js server serves both static files and handles SSR.

---

### Method 2: PM2 (Production-like)

1. **Install PM2** (if not already installed):
   ```bash
   npm install -g pm2
   ```

2. **Build and start**:
   ```bash
   npm run build
   pm2 start nginx/ecosystem.config.js
   ```

3. **Monitor**:
   ```bash
   pm2 status
   pm2 logs musical-zoe-frontend
   ```

4. **Stop**:
   ```bash
   pm2 stop musical-zoe-frontend
   ```

**What's happening**: PM2 manages the Node.js process with clustering, auto-restart, and logging.

---

### Method 3: Docker Compose (Full Stack)

1. **Build first**:
   ```bash
   npm run build
   ```

2. **Start containers**:
   ```bash
   cd nginx/
   docker-compose up --build
   ```

3. **Access**:
   - **NGINX (recommended)**: http://localhost
   - **Direct Node.js**: http://localhost:3000

4. **Stop**:
   ```bash
   docker-compose down
   ```

**What's happening**: 
- App container runs the SvelteKit Node.js server
- NGINX container acts as reverse proxy
- NGINX serves static files directly for better performance

---

## How It All Works

### Traditional Architecture (What we've built)
```
User Request → NGINX (Port 80) → Node.js Server (Port 3000)
                   ↓
              Static Files (.svelte-kit/output/client/)
                   ↓
              SSR/API Requests → SvelteKit Node.js App
```

### Key Components:

1. **SvelteKit Node.js Server** (`.svelte-kit/output/server/index.js`):
   - Handles server-side rendering (SSR)
   - Serves API routes
   - Can serve static files (but NGINX is better for this)

2. **NGINX Reverse Proxy**:
   - Serves static files directly (CSS, JS, images) for better performance
   - Proxies dynamic requests to Node.js server
   - Handles SSL termination
   - Provides caching, compression, and security headers

3. **PM2 Process Manager**:
   - Keeps Node.js app running (auto-restart on crash)
   - Enables clustering (multiple Node.js processes)
   - Provides logging and monitoring
   - Zero-downtime deployments

---

## Testing Checklist

Before deploying to production, test locally:

### ✅ Basic Functionality
```bash
# Test 1: Direct Node.js
npm run build
node .svelte-kit/output/server/index.js
curl http://localhost:3000

# Test 2: PM2
pm2 start nginx/ecosystem.config.js
curl http://localhost:3000
pm2 logs musical-zoe-frontend

# Test 3: Docker Compose
docker-compose -f nginx/docker-compose.yml up --build
curl http://localhost
curl http://localhost:3000
```

### ✅ Health Checks
```bash
# Check health endpoint
curl http://localhost:3000/health
curl http://localhost/health  # via NGINX
```

### ✅ Static Assets
```bash
# Check if static files are served
curl -I http://localhost/_app/immutable/assets/app.css
```

---

## Next Steps

Once local testing is complete:

1. **AWS EC2 Deployment**: Use the scripts in `scripts/` folder
2. **Environment Variables**: Set up `.env` file with real API endpoints
3. **SSL/HTTPS**: Configure SSL certificates for production
4. **Monitoring**: Set up logging and monitoring
5. **CI/CD**: Update GitHub Actions workflow

---

## Troubleshooting

### Common Issues:

1. **Build fails**: Make sure all dependencies are installed
   ```bash
   npm ci
   npm run build
   ```

2. **Port 3000 in use**: Kill existing processes
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

3. **NGINX errors**: Check configuration
   ```bash
   sudo nginx -t
   ```

4. **Docker issues**: Check build output exists
   ```bash
   ls -la .svelte-kit/output/
   ```

The setup is now ready for testing! Start with Method 1 (Direct Node.js) to verify everything works, then try the other methods.
