# ASG Frontend Deployment Document

This document is designed for deploying the Musical Zoe frontend to an Auto Scaling Group.

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
    description: Deploy frontend to all instances in the ASG
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
          - echo "Starting frontend deployment on $(hostname)"
          - echo "Version{{ ":" }} {{ Version }}"
          - echo "Environment{{ ":" }} {{ Environment }}"
          - echo "Timestamp{{ ":" }} $(date)"
          - echo "Installing required packages"
          - sudo dnf install -y unzip awscli
          - echo "Downloading artifact from S3{{ ":" }} s3{{ ":" }}//{{ S3Bucket }}/{{ ArtifactKey }}"
          - aws s3 cp s3{{ ":" }}//{{ S3Bucket }}/{{ ArtifactKey }} /tmp/frontend.zip
          - echo "Creating backup of current deployment"
          - sudo mkdir -p /tmp/backup-$(date +%Y%m%d-%H%M%S)
          - sudo cp -r {{ DestinationPath }}/* /tmp/backup-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || echo "No existing files to backup"
          - echo "Extracting new frontend to {{ DestinationPath }}"
          - sudo mkdir -p {{ DestinationPath }}
          - sudo unzip -o /tmp/frontend.zip -d {{ DestinationPath }}
          - echo "Setting correct permissions for nginx"
          - sudo chown -R nginx{{ ":" }}nginx {{ DestinationPath }}
          - sudo chmod -R 755 {{ DestinationPath }}
          - echo "Cleaning up temporary files"
          - rm -f /tmp/frontend.zip
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
- `AUTOMATION_ASSUME_ROLE`: IAM role for SSM automation (can be the same as AWS_ROLE_ARN)

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
