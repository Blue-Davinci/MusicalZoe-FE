# Musical Zoe - Production Deployment Guide

This guide covers deploying the Musical Zoe SvelteKit application to AWS EC2 using automated CI/CD pipelines and traditional infrastructure.

## Deployment Methods

### 🚀 Automated Deployment (Recommended)

- **GitHub Actions CI/CD** - Automated build, test, and deployment
- **AWS S3 + SSM** - Artifact storage and deployment automation
- **Zero-downtime deployments** with automatic rollback
- **Environment-specific configurations**

### 🛠️ Manual Deployment

- Traditional EC2 setup with NGINX and PM2
- Manual build and deployment process
- Suitable for development and testing

---

## 🚀 Automated Deployment (Production)

### Overview

The automated deployment uses GitHub Actions to build, test, and deploy your application to AWS infrastructure.

**Flow**: `GitHub Push → CI/CD → S3 → SSM → EC2 Deployment`

### Required GitHub Secrets

Configure these secrets in your GitHub repository:

| Secret              | Description                 | Example                                            |
| ------------------- | --------------------------- | -------------------------------------------------- |
| `AWS_ROLE_ARN`      | IAM role for GitHub Actions | `arn:aws:iam::123456789012:role/GitHubActionsRole` |
| `AWS_REGION`        | AWS region                  | `us-east-1`                                        |
| `S3_BUCKET_NAME`    | Deployment artifacts bucket | `musical-zoe-deployments`                          |
| `SSM_DOCUMENT_NAME` | SSM automation document     | `MusicalZoeDeployment`                             |

### Deployment Process

1. **Push to `main`** - Triggers the CI/CD pipeline
2. **Build & Test** - Runs linting, type checking, and tests
3. **Create Artifact** - Packages build output with metadata
4. **Upload to S3** - Stores deployment artifact
5. **SSM Automation** - Executes deployment on EC2 instances
6. **Health Check** - Verifies deployment success

### Monitoring

- **GitHub Actions** - View deployment status and logs
- **AWS Console** - Monitor SSM automation execution
- **Application Health** - Automated health checks verify deployment

---

## 🛠️ Manual Deployment (Development)

## Architecture Overview

```
Internet → ALB/CloudFront → EC2 Instance
                              ├── NGINX (Port 80/443)
                              └── Node.js/SvelteKit (Port 3000)
                                  └── PM2 Process Manager
```

## Deployment Options Comparison

| Method              | Complexity | Speed  | Cost   | Best For                  |
| ------------------- | ---------- | ------ | ------ | ------------------------- |
| **Traditional EC2** | Low        | Fast   | Low    | Demos, MVP, Small Apps    |
| Docker on EC2       | Medium     | Medium | Low    | Standardized Deployments  |
| ECS Fargate         | High       | Medium | Medium | Scalable Production       |
| EKS                 | Very High  | Slow   | High   | Enterprise, Microservices |

**Recommendation**: Traditional EC2 for this demo due to simplicity and speed.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **EC2 Instance** (Ubuntu 20.04/22.04 recommended)
3. **Security Groups** configured for SSH (22), HTTP (80), HTTPS (443)
4. **Domain/Subdomain** (optional, can use IP)
5. **SSL Certificate** (for production)

## Quick Start

### 1. Server Setup

Run the setup script on your EC2 instance:

```bash
# On your EC2 instance
sudo ./scripts/setup-ec2.sh
```

This script will:

- Install Node.js, NGINX, PM2, and dependencies
- Create application user and directories
- Configure firewall and security
- Set up log rotation

### 2. Build and Package

On your development machine:

```bash
# Build and create deployment package
./scripts/build-package.sh

# Optional: Upload to S3
S3_BUCKET=your-deployment-bucket ./scripts/build-package.sh
```

### 3. Deploy Application

On your EC2 instance:

```bash
# Deploy from local file
sudo ./scripts/deploy.sh -f /path/to/your-build.tar.gz

# Or deploy from S3
sudo ./scripts/deploy.sh \
  -b your-deployment-bucket \
  -k builds/musicalzoe-build-YYYYMMDD-HHMMSS.tar.gz \
  -s /musicalzoe/prod
```

## Detailed Setup Instructions

### Server Configuration

#### 1. EC2 Instance Requirements

- **Instance Type**: t3.micro (for demo) or t3.small (for production)
- **AMI**: Ubuntu 22.04 LTS
- **Storage**: 20GB GP3 (minimum)
- **Security Group**:
  ```
  SSH (22) - Your IP only
  HTTP (80) - 0.0.0.0/0
  HTTPS (443) - 0.0.0.0/0
  ```

#### 2. Environment Variables

Configure environment variables using AWS Systems Manager Parameter Store:

```bash
# Example parameters
aws ssm put-parameter \
  --name "/musicalzoe/prod/NODE_ENV" \
  --value "production" \
  --type "String"

aws ssm put-parameter \
  --name "/musicalzoe/prod/DATABASE_URL" \
  --value "postgresql://user:pass@host:5432/db" \
  --type "SecureString"
```

Or create a local `.env` file:

```bash
# Copy template and configure
cp /opt/musicalzoe/.env.template /opt/musicalzoe/.env
sudo nano /opt/musicalzoe/.env
```

### NGINX Configuration

The deployment includes optimized NGINX configurations:

- **Main Config**: `nginx/nginx.conf` - Global settings, security headers, compression
- **Site Config**: `nginx/sites-available/musicalzoe.conf` - Virtual host configuration
- **Local Config**: `nginx/sites-available/local.conf` - Docker Compose testing

Key features:

- Static file serving from `.svelte-kit/output/client/`
- Reverse proxy to Node.js server at `.svelte-kit/output/server/index.js`
- Rate limiting for API and auth endpoints
- Security headers and SSL configuration
- Gzip compression and caching

### PM2 Process Management

PM2 configuration (`nginx/ecosystem.config.js`):

```javascript
{
  name: 'musical-zoe-frontend',
  script: './.svelte-kit/output/server/index.js',
  instances: 2,
  exec_mode: 'cluster',
  max_memory_restart: '512M'
}
```

Key features:

- Cluster mode for load balancing
- Automatic restarts on crashes
- Memory management
- Health checks
- Log management

## Docker Deployment (Alternative)

### Local Testing with Docker Compose

```bash
# Build and run locally
docker-compose up --build

# Access the application
curl http://localhost/health
```

### Production Docker Deployment

```bash
# Build production image
docker build -t musicalzoe:latest .

# Run with proper configuration
docker run -d \
  --name musicalzoe \
  -p 3000:3000 \
  --env-file .env \
  musicalzoe:latest
```

## Monitoring and Maintenance

### Health Checks

- **Application**: `GET /health`
- **PM2 Status**: `pm2 status`
- **NGINX Status**: `systemctl status nginx`

### Log Management

- **Application Logs**: `/opt/musicalzoe/logs/`
- **NGINX Logs**: `/var/log/nginx/`
- **PM2 Logs**: `pm2 logs`

### Automatic Updates

The CI/CD workflow can be configured to:

1. Build and test on push
2. Create deployment package
3. Upload to S3
4. Trigger deployment via webhook

## SSL/HTTPS Configuration

### Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Manual SSL Certificate

1. Upload certificates to `/etc/ssl/certs/` and `/etc/ssl/private/`
2. Update NGINX configuration
3. Test and reload NGINX

## Troubleshooting

### Common Issues

1. **Build failures**: Check Node.js version and dependencies
2. **Permission errors**: Verify file ownership and permissions
3. **Port conflicts**: Ensure ports 80, 443, 3000 are available
4. **Environment variables**: Verify all required env vars are set

### Debug Commands

```bash
# Check application status
sudo -u musicalzoe pm2 status
sudo -u musicalzoe pm2 logs musical-zoe-frontend --lines 50

# Check NGINX
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
free -h
```

## Security Considerations

1. **Firewall**: UFW configured with minimal open ports
2. **Fail2ban**: Protection against brute force attacks
3. **HTTPS**: Always use SSL in production
4. **Environment Variables**: Use AWS SSM Parameter Store
5. **Regular Updates**: Keep system packages updated
6. **Monitoring**: Set up CloudWatch or similar monitoring

## CI/CD Integration

The deployment can be integrated with GitHub Actions:

```yaml
- name: Build and Deploy
  run: |
    ./scripts/build-package.sh
    aws s3 cp *.tar.gz s3://your-bucket/builds/
    # Trigger deployment webhook
```

## Performance Optimization

1. **PM2 Clustering**: Multiple Node.js processes
2. **NGINX Caching**: Static file caching and compression
3. **CDN**: Use CloudFront for static assets
4. **Database**: Optimize queries and use connection pooling
5. **Monitoring**: Set up performance monitoring

## Backup and Recovery

1. **Application Backups**: Automated before each deployment
2. **Database Backups**: Regular automated backups
3. **Configuration Backups**: Version control all configs
4. **Disaster Recovery**: Document recovery procedures

## Cost Optimization

- **Instance Sizing**: Start small and scale based on usage
- **Reserved Instances**: For predictable workloads
- **Spot Instances**: For non-critical environments
- **Auto Scaling**: Scale based on demand
- **Resource Monitoring**: Regular cost analysis

## Support and Maintenance

- **Documentation**: Keep deployment docs updated
- **Runbooks**: Document common procedures
- **Monitoring**: Set up alerts for critical issues
- **Updates**: Regular security and dependency updates
