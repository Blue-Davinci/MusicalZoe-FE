# Musical Zoe - NGINX Configuration

This directory contains NGINX configuration files and testing setup for the Musical Zoe SvelteKit application.

## 📁 Directory Structure

```
nginx/
├── nginx.conf                    # Main NGINX configuration
├── test-local.sh                 # Local testing script
└── sites-available/
    └── musicalzoe.conf          # Production site configuration
```

## 🚀 Quick Start

### 1. **Local Development (Simple)**
```bash
# From project root
npm run dev
# Access: http://localhost:5173
```

### 2. **Test with NGINX Locally**
```bash
# Install NGINX first (if not installed)
# Ubuntu/Debian: sudo apt-get install nginx
# macOS: brew install nginx

# Run test script
cd nginx
chmod +x test-local.sh
./test-local.sh

# Access: http://localhost:8080 (NGINX proxy)
# Direct: http://localhost:3000 (SvelteKit)
```

## 🔧 Configuration Files

### **nginx.conf** - Main Configuration
- Security optimizations and headers
- Performance tuning (gzip, caching)
- Rate limiting protection
- Enhanced logging format

### **sites-available/musicalzoe.conf** - Production Site
- Virtual host configuration for production
- Static file serving with caching
- Reverse proxy to SvelteKit application
- Security headers and CSP policies
- SSL/TLS configuration ready

### **test-local.sh** - Local Testing Script
- Automated local testing environment
- Builds SvelteKit application
- Starts NGINX with temporary configuration
- Tests proxy functionality and health checks

---

This simplified NGINX setup focuses on **ease of use** while maintaining **production readiness** for EC2 deployment.
- Gzip compression
- Security headers

### **sites-available/musicalzoe.conf** - Production Site
- SSL/TLS configuration (commented for demo)
- Static file optimization
- API route handling
- Authentication routes
- Error handling

### **dev.conf** - Development Configuration
- Relaxed security for development
- Enhanced logging
- CORS headers for API testing
- Minimal caching

## 🧪 Testing Commands

```bash
# Test configuration only
./test-local.sh test-config

# Start services
./test-local.sh start

# Test endpoints
./test-local.sh test-endpoints

# Show logs
./test-local.sh logs

# Show service status
./test-local.sh status

# Run performance test
./test-local.sh performance

# Stop services
./test-local.sh stop
```

## 🏗️ Architecture

```
Internet → NGINX (Port 8080) → SvelteKit (Port 3000)
              ↓
          Static Files
         (Direct serve)
```

### **NGINX Responsibilities**
- **Reverse Proxy**: Forward requests to SvelteKit
- **Static File Serving**: Serve CSS, JS, images directly
- **SSL Termination**: Handle HTTPS (in production)
- **Rate Limiting**: Protect against abuse
- **Compression**: Gzip static assets
- **Security Headers**: Add security headers
- **Load Balancing**: Distribute requests (with multiple instances)

### **SvelteKit Responsibilities**
- **Server-Side Rendering (SSR)**
- **API Routes**: Handle `/api/*` endpoints
- **Dynamic Content**: Generate pages on-demand
- **Authentication**: Handle user sessions

## 🔒 Security Features

### **Docker Security**
- Non-root user (`musicalzoe:1001`)
- Read-only filesystem
- No new privileges
- Minimal base image (Alpine)
- Health checks

### **NGINX Security**
- Security headers (XSS, CSRF, etc.)
- Rate limiting
- Request size limits
- Hidden server tokens
- CSP headers

### **Network Security**
- Internal Docker network
- No direct exposure of SvelteKit
- Proper port isolation

## 📊 Performance Optimizations

### **Caching Strategy**
- **Immutable assets**: 1 year cache
- **Static assets**: 30 days cache
- **API responses**: No cache
- **HTML pages**: No cache (SSR)

### **Compression**
- Gzip enabled for text assets
- Optimal compression levels
- Varies by content type

### **Connection Optimization**
- HTTP/2 support (with SSL)
- Keep-alive connections
- Upstream connection pooling

## 🚀 Production Deployment

### **EC2 Installation**
```bash
# Install NGINX
sudo yum install -y nginx

# Copy configuration files
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp sites-available/musicalzoe.conf /etc/nginx/conf.d/

# Test configuration
sudo nginx -t

# Start NGINX
sudo systemctl enable nginx
sudo systemctl start nginx
```

### **SSL Configuration**
```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🐛 Troubleshooting

### **Common Issues**

1. **Port Conflicts**
   ```bash
   # Check what's using ports
   sudo netstat -tulpn | grep :8080
   sudo netstat -tulpn | grep :3000
   ```

2. **Permission Issues**
   ```bash
   # Fix Docker permissions
   sudo usermod -aG docker $USER
   # Logout and login again
   ```

3. **Build Directory Missing**
   ```bash
   # Build SvelteKit
   npm run build
   ```

4. **NGINX Configuration Errors**
   ```bash
   # Test configuration
   nginx -t
   
   # Check syntax
   ./test-local.sh test-config
   ```

### **Log Locations**

- **Docker Logs**: `docker-compose logs`
- **NGINX Access**: `/var/log/nginx/access.log`
- **NGINX Error**: `/var/log/nginx/error.log`
- **Application**: PM2 logs or Docker logs

## 📈 Monitoring

### **Health Checks**
- **Application**: `GET /health`
- **NGINX**: `nginx -t`
- **Docker**: Container health checks

### **Metrics to Monitor**
- Response times
- Error rates
- Memory usage
- CPU usage
- Disk space
- Connection counts

## 🔄 Updates and Deployment

### **Local Testing Workflow**
1. Make changes to SvelteKit app
2. Build: `npm run build`
3. Test: `./test-local.sh full-test`
4. Verify all endpoints work

### **Production Deployment**
1. Upload build to S3
2. Use SSM to update EC2
3. Restart services with PM2
4. Verify health checks

## 🤝 Contributing

When updating NGINX configurations:

1. Test locally first
2. Update both dev and production configs
3. Test with `./test-local.sh full-test`
4. Document any new features
5. Update security headers if needed

## 📚 Additional Resources

- [NGINX Documentation](https://nginx.org/en/docs/)
- [SvelteKit Adapter Node](https://kit.svelte.dev/docs/adapters#supported-environments-node-js)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [SSL Configuration Guide](https://ssl-config.mozilla.org/)
