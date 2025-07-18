# Deployment Setup Guide

This guide explains how to set up the automated deployment pipeline for Musical Zoe Frontend.

## Required GitHub Secrets

The following secrets must be configured in your GitHub repository:

### AWS Configuration

- `AWS_ROLE_ARN`: IAM role for GitHub Actions to assume (e.g., `arn:aws:iam::123456789012:role/GitHubActionsRole`)
- `AWS_REGION`: AWS region where resources are deployed (e.g., `us-east-1`)

### S3 Configuration

- `S3_BUCKET_NAME`: S3 bucket name for deployment artifacts (e.g., `musical-zoe-deployments`)

### SSM Configuration

- `SSM_DOCUMENT_NAME`: Name of the pre-created SSM document for deployment automation

### Auto Scaling Group Configuration

- `ASG_NAME`: Name of the Auto Scaling Group containing your EC2 instances (optional, can be handled by tags)

## Auto Scaling Group Setup

### Option 1: Using ASG Name (Current Implementation)

The workflow can target a specific Auto Scaling Group by name using the `ASG_NAME` secret.

### Option 2: Using Tags (Recommended)

For better flexibility, your ASG should be tagged with:

- `App=frontend`
- `Environment=production`

If using tags, the SSM document should query instances using these tags instead of ASG name.

## Deployment Flow

1. **Trigger**: Push to `main` branch
2. **Test & Build**: Run tests, linting, and build the application
3. **Create Artifact**: Package the build with metadata
4. **Upload to S3**: Store the deployment artifact in S3
5. **Trigger SSM**: Start the SSM automation document
6. **Monitor**: Wait for deployment completion
7. **Report**: Provide deployment summary

## S3 Bucket Structure

```
s3://your-bucket-name/
├── deployments/
│   ├── musical-zoe-frontend-20240718-143022-abc12345.zip
│   ├── musical-zoe-frontend-20240718-151045-def67890.zip
│   └── ...
```

## Artifact Contents

Each deployment artifact contains:

- `build/`: SvelteKit build output
- `deployment-info.json`: Deployment metadata

## Troubleshooting

### Common Issues

1. **AWS credentials**: Ensure the GitHub Actions role has necessary permissions
2. **S3 permissions**: Role must have `s3:PutObject` permission on the deployment bucket
3. **SSM permissions**: Role must have `ssm:StartAutomationExecution` and `ssm:DescribeAutomationExecutions`
4. **ASG access**: Role must have `autoscaling:DescribeAutoScalingGroups` if using ASG targeting

### Monitoring Deployments

- Check GitHub Actions logs for deployment progress
- Monitor SSM automation execution in AWS Console
- Verify application health after deployment

## Security Considerations

- Use IAM roles with least privilege principle
- Encrypt S3 bucket with KMS
- Enable CloudTrail for audit logging
- Use GitHub environments for additional approval gates (optional)
