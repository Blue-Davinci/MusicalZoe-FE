# Test ASG Deployment Document

This is a simplified version for testing the tag-based targeting.

## Document Name: `TestDeployFrontendToASG`

```yaml
description: Test Deploy Frontend to Auto Scaling Group
schemaVersion: '0.3'
parameters:
  AutoScalingGroupName:
    type: String
    description: (Required) The name of the Auto Scaling Group containing the EC2 instances.
mainSteps:
  - name: TestDeployToInstances
    action: aws:runCommand
    description: Test deployment to all instances in the ASG using EC2 tags
    inputs:
      DocumentName: AWS-RunShellScript
      Targets:
        - Key: tag:aws:autoscaling:groupName
          Values:
            - '{{ AutoScalingGroupName }}'
      MaxConcurrency: "10"
      MaxErrors: "0"
      Parameters:
        commands:
          - echo "TEST: Starting deployment test on $(hostname)"
          - echo "TEST: Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)"
          - echo "TEST: Current directory: $(pwd)"
          - echo "TEST: Available disk space: $(df -h /)"
          - echo "TEST: Current user: $(whoami)"
          - echo "TEST: Can we reach S3?"
          - aws s3 ls || echo "S3 access failed"
          - echo "TEST: Directory contents of /usr/share/nginx/html:"
          - ls -la /usr/share/nginx/html
          - echo "TEST: Deployment test completed successfully on $(hostname)"
    outputs:
      - Name: TestCommandId
        Selector: $.CommandId
        Type: String
```

## Usage

1. Create this document in AWS Console with name `TestDeployFrontendToASG`
2. Run it manually with parameter `AutoScalingGroupName = FrontendASG-Main`
3. Check if it can reach your instances

If this works, then the issue is with the actual deployment commands, not the targeting.
