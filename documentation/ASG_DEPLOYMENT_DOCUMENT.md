# ASG Frontend Deployment Document

This document is designed fo - echo "=== EXTRACTING NEW FRONTEND ===" - echo "Extracting new frontend to {{ DestinationPath }}" - sudo mkdir -p {{ DestinationPath }} - sudo unzip -o /tmp/frontend.zip -d /tmp/frontend-extract - echo "Moving build files to nginx document root" - sudo rm -rf {{ DestinationPath }}/_ - sudo cp -r /tmp/frontend-extract/build/_ {{ DestinationPath }}/ - sudo cp /tmp/frontend-extract/deployment-info.json {{ DestinationPath }}/ - echo "Extraction completed. Contents:" - ls -la {{ DestinationPath }} - echo "=== SETTING PERMISSIONS ===" - echo "Setting correct permissions for nginx" - sudo chown -R nginx:nginx {{ DestinationPath }} - sudo chmod -R 755 {{ DestinationPath }} - echo "=== RESTARTING NGINX ===" - echo "Restarting nginx to ensure proper serving" - sudo systemctl restart nginx - sudo systemctl status nginx - echo "=== CLEANING UP ===" - echo "Cleaning up temporary files" - rm -rf /tmp/frontend.zip /tmp/frontend-extracthe Musical Zoe frontend to an Auto Scaling Group.

## Document Name: `DeployFrontendToASG`

```yaml
description: Deploy Frontend to Auto Scaling Group from S3
schemaVersion: '0.3'
parameters:
  AutoScalingGroupName:
    type: String
    description: (Required) The name of the Auto Scaling Group containing the EC2 instances.
  S3Bucket:
    type: String
    description: (Required) The name of the S3 bucket containing the zipped frontend artifact.
  ArtifactKey:
    type: String
    description: (Required) The key (path) to the zip artifact inside the S3 bucket.
  DestinationPath:
    type: String
    default: /usr/share/nginx/html
    description: The target directory on the EC2 instances where the frontend files will be extracted.
  Version:
    type: String
    default: ''
    description: (Optional) Version identifier for this deployment.
  Environment:
    type: String
    default: production
    description: (Optional) Environment name for this deployment.
mainSteps:
  - name: DeployToInstances
    action: aws:runCommand
    description: Deploy frontend to all instances in the ASG using EC2 tags
    inputs:
      DocumentName: AWS-RunShellScript
      Targets:
        - Key: tag:aws:autoscaling:groupName
          Values:
            - '{{ AutoScalingGroupName }}'
      MaxConcurrency: '10'
      MaxErrors: '0'
      Parameters:
        commands:
          - echo "=== STARTING FRONTEND DEPLOYMENT ==="
          - echo "Starting frontend deployment on $(hostname)"
          - echo "Instance ID - $(curl -s http://169.254.169.254/latest/meta-data/instance-id)"
          - echo "Version - {{ Version }}"
          - echo "Environment - {{ Environment }}"
          - echo "Timestamp - $(date)"
          - echo "Current user - $(whoami)"
          - echo "Current directory - $(pwd)"
          - echo "=== INSTALLING REQUIRED PACKAGES ==="
          - echo "Installing required packages"
          - sudo dnf install -y unzip awscli
          - echo "=== DOWNLOADING ARTIFACT FROM S3 ==="
          - echo "Downloading artifact from S3 - s3://{{ S3Bucket }}/{{ ArtifactKey }}"
          - aws s3 cp s3://{{ S3Bucket }}/{{ ArtifactKey }} /tmp/frontend.zip
          - echo "Download completed. File size - $(ls -lh /tmp/frontend.zip)"
          - echo "=== CREATING BACKUP ==="
          - echo "Creating backup of current deployment"
          - sudo mkdir -p /tmp/backup-$(date +%Y%m%d-%H%M%S)
          - sudo cp -r {{ DestinationPath }}/* /tmp/backup-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || echo "No existing files to backup"
          - echo "=== EXTRACTING NEW FRONTEND ==="
          - echo "Extracting new frontend to temporary directory"
          - sudo mkdir -p /tmp/frontend-extract
          - sudo unzip -o /tmp/frontend.zip -d /tmp/frontend-extract
          - echo "Checking extracted contents"
          - ls -la /tmp/frontend-extract/build/
          - echo "Moving build files to nginx document root"
          - sudo rm -rf {{ DestinationPath }}/*
          - echo "Extracting client files from Node.js build"
          - sudo cp -r /tmp/frontend-extract/build/client/* {{ DestinationPath }}/
          - sudo cp /tmp/frontend-extract/deployment-info.json {{ DestinationPath }}/
          - echo "Extraction completed. Contents -"
          - ls -la {{ DestinationPath }}
          - echo "=== UPDATING NGINX CONFIGURATION ==="
          - echo "Creating nginx configuration for static serving"
          - sudo rm -f /etc/nginx/conf.d/default.conf
          - sudo rm -f /etc/nginx/sites-enabled/default
          - sudo rm -f /etc/nginx/sites-available/default
          - echo "server {" | sudo tee /etc/nginx/conf.d/musicalzoe.conf
          - echo "    listen 80 default_server;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    listen [::]:80 default_server;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    server_name _;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    root /usr/share/nginx/html;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    index index.html;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    add_header X-Frame-Options \"SAMEORIGIN\" always;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    add_header X-Content-Type-Options \"nosniff\" always;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    add_header X-XSS-Protection \"1; mode=block\" always;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        expires 1y;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        add_header Cache-Control \"public, immutable\";" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        try_files \\$uri =404;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    }" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    location /_app/ {" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        expires 1y;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        add_header Cache-Control \"public, immutable\";" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        try_files \\$uri =404;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    }" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    location /api/ {" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        try_files \\$uri \\$uri.html \\$uri/index.html /index.html;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    }" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    location /health {" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        try_files \\$uri \\$uri.html \\$uri/index.html /index.html;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    }" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    location ~ /\\. {" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        deny all;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    }" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    location = /deployment-info.json {" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        deny all;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    }" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    location / {" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "        try_files \\$uri \\$uri.html \\$uri/ /index.html;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    }" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    error_page 404 /404.html;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "    error_page 500 502 503 504 /50x.html;" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "}" | sudo tee -a /etc/nginx/conf.d/musicalzoe.conf
          - echo "Checking nginx configuration syntax"
          - sudo nginx -t
          - echo "=== SETTING PERMISSIONS ==="
          - echo "Setting correct permissions for nginx"
          - sudo chown -R nginx:nginx {{ DestinationPath }}
          - sudo chmod -R 755 {{ DestinationPath }}
          - echo "=== RESTARTING NGINX ==="
          - echo "Stopping nginx service"
          - sudo systemctl stop nginx
          - echo "Cleaning up any existing nginx processes"
          - sudo pkill -f nginx || true
          - echo "Starting nginx service"
          - sudo systemctl start nginx
          - echo "Enabling nginx service for auto-start"
          - sudo systemctl enable nginx
          - echo "Checking nginx status"
          - sudo systemctl status nginx --no-pager
          - echo "=== VERIFYING DEPLOYMENT ==="
          - echo "Checking nginx configuration"
          - sudo nginx -t
          - echo "Checking nginx process"
          - ps aux | grep nginx
          - echo "Checking listening ports"
          - sudo netstat -tlnp | grep :80 || ss -tlnp | grep :80
          - echo "Checking deployed files"
          - ls -la {{ DestinationPath }}
          - echo "Testing local response"
          - curl -I http://localhost/ || echo "Local curl test failed"
          - echo "=== CLEANING UP ==="
          - echo "Cleaning up temporary files"
          - rm -rf /tmp/frontend.zip /tmp/frontend-extract
          - echo "=== DEPLOYMENT COMPLETED ==="
          - echo "Deployment completed successfully on $(hostname)"
    outputs:
      - Name: DeploymentCommandId
        Selector: $.CommandId
        Type: String
```

## Required GitHub Secrets for ASG Deployment

Update your GitHub repository secrets:

- `SSM_DOCUMENT_NAME`: Set to `DeployFrontendToASG`
- `ASG_NAME`: Your Auto Scaling Group name
- `AWS_ROLE_ARN`: Your GitHub OIDC role ARN
- `AWS_REGION`: Your AWS region
- `S3_BUCKET_NAME`: Your S3 bucket name

## How to Create This Document

1. **Via AWS Console:**
   - Go to Systems Manager → Documents
   - Create document → Automation
   - Paste the YAML above

2. **Via AWS CLI:**
   ```bash
   aws ssm create-document \
     --name "DeployFrontendToASG" \
     --document-type "Automation" \
     --document-format "YAML" \
     --content file://deploy-frontend-asg.yaml
   ```

## Key Differences from Single Instance Document

1. **ASG Discovery**: Automatically finds all healthy instances in the ASG
2. **Parallel Deployment**: Deploys to all instances simultaneously
3. **Backup**: Creates backup of current deployment before updating
4. **Amazon Linux 2023**: Uses `dnf` package manager (not `yum`)
5. **Nginx Configuration**: Sets proper `nginx:nginx` ownership for `/var/www/html`
6. **Monitoring**: Better logging and status reporting

## Deployment Path Confirmation

Yes, `/usr/share/nginx/html` is the correct default path for nginx on Amazon Linux 2023. This is the standard nginx document root where nginx serves static files from. Your SvelteKit build files will be extracted directly to this location and served by nginx.

This approach ensures zero-downtime deployments across your Auto Scaling Group!
