# Provisioning

### Environment stack

#### Create/Update Environment Stack
This step assumes that you have already created [global resources stack](https://github.com/totem/totem-v3/tree/develop/provisioning#creating-global-resources).
To spin up new environment stack, execute the following command from [parent folder](..): 


```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $5}')" &&
    
aws --profile=$PROFILE cloudformation deploy \
  --capabilities=CAPABILITY_NAMED_IAM \
  --template-file=./totem-environment.yml \
  --s3-bucket="$TOTEM_BUCKET" \
  --s3-prefix="cloudformation/totem-config-service" \
  --stack-name=totem-config-service-environment \
  --tags \
    "app=totem-v3-config-service" \
    "env=development" \
    "client=meltmedia" \
    "stacktype=totem-environment"
```

where:
- **AWS_CLI_PROFILE**: [AWS CLI Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)


Note:
- You must modify tags for appropriate totem cluster

## Setup Pipeline

### Create/Update pipeline

To create a new pipeline execute following command: 

```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
ENVIRONMENT=[ENVIRONMENT]
GITHUB_OAUTH_TOKEN=[GITHUB_OAUTH_TOKEN]
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $5}')" &&

aws --profile=$PROFILE cloudformation deploy \
  --template-file=./totem-pipeline.yml \
  --s3-bucket="$TOTEM_BUCKET" \
  --s3-prefix="cloudformation/totem-orchestrator/" \
  --stack-name=totem-config-service-pipeline-${ENVIRONMENT} \
  --tags \
    "app=totem-v3-config-service" \
    "env=${ENVIRONMENT}" \
    "client=meltmedia" \
    "stacktype=totem-pipeline" \
  --parameter-overrides \
    "GitBranch=feature_config" \
    "GithubOauthToken=${GITHUB_OAUTH_TOKEN}" \
    "WebhookSecret=${WEBHOOK_SECRET}" \
    "TestGitRepo=totem-demo" \
    "TestGitOwner=totem" \
    "Environment=${ENVIRONMENT}"
```

where:
- **GITHUB_OAUTH_TOKEN**: Personal oauth token to access github repositories and for configuring webhooks.
- **AWS_CLI_PROFILE**: [AWS CLI Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)
- **ENVIRONMENT**: Environment for config service (feature, development, production)
