# Provisioning

### Environment stack

#### New Environment Stack
This step assumes that you have already created [global resources stack](./global-resources-stack).
To spin up new environment stack, execute the following command from [parent folder](..): 


```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $1}')" &&

OUTPUT_TEMPLATE="$TOTEM_BUCKET/cloudformation/totem-config-service-environment.yml" && 

aws --profile=$PROFILE s3 cp ./totem-environment.yml s3://$OUTPUT_TEMPLATE &&

aws --profile=$PROFILE cloudformation create-stack \
  --template-url=https://s3.amazonaws.com/$OUTPUT_TEMPLATE \
  --stack-name=totem-config-service-environment \
  --capabilities=CAPABILITY_NAMED_IAM \
  --tags \
    "Key=app,Value=totem-config-service" \
    "Key=env,Value=development" \
    "Key=client,Value=totem" \
    "Key=stacktype,Value=totem-config-service-environment"
```

where:
- **AWS_CLI_PROFILE**: [AWS CLI Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)


To monitor the status of the stack creation, use command:

```bash
aws --profile=contrail cloudformation describe-stacks \
  --stack-name=totem-config-service-environment  
```

Note:
- You must modify tags for appropriate totem cluster

#### Update Environment Stack
To update existing environmnet stack, run command:

```bash
aws --profile=contrail cloudformation deploy \         
  --template-file=./totem-environment.yml \                    
  --stack-name=totem-config-service-environment \
  --capabilities=CAPABILITY_NAMED_IAM
```


## Setup Pipeline

### Create new pipeline

To create a new pipeline execute following command: 

```bash
set -o pipefail
PROFILE=[AWS_CLI_PROFILE]
GITHUB_OAUTH_TOKEN=[GITHUB_OAUTH_TOKEN]
TOTEM_BUCKET="$(aws --profile=$PROFILE cloudformation describe-stack-resource \
  --logical-resource-id=TotemBucket \
  --stack-name=totem-global \
  --output text | tail -1 | awk '{print $1}')" &&

OUTPUT_TEMPLATE="$TOTEM_BUCKET/cloudformation/totem-config-service-pipeline-development.yml" && 

aws --profile=$PROFILE s3 cp ./totem-pipeline.yml s3://$OUTPUT_TEMPLATE &&

aws --profile=$PROFILE cloudformation create-stack \
  --template-url=https://s3.amazonaws.com/$OUTPUT_TEMPLATE \
  --stack-name=totem-config-service-pipeline-development \
  --parameters \
    "ParameterKey=GithubOauthToken,ParameterValue=${GITHUB_OAUTH_TOKEN}" \
    "ParameterKey=GitBranch,ParameterValue=feature_config" \
    "ParameterKey=TestGitOwner,ParameterValue=totem" \
    "ParameterKey=TestGitRepo,ParameterValue=totem-demo" \
  --tags \
    "Key=app,Value=totem-config-service" \
    "Key=env,Value=development" \
    "Key=client,Value=totem" \
    "Key=stacktype,Value=totem-config-service-pipeline"
```
where:
- **GITHUB_OAUTH_TOKEN**: Personal oauth token to access github repositories and for configuring webhooks.
- **AWS_CLI_PROFILE**: [AWS CLI Profile](http://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html)

To monitor the status of the stack creation, use command:

```bash
PROFILE=[AWS_CLI_PROFILE]
aws --profile=$PROFILE cloudformation describe-stacks \
  --stack-name=totem-config-service-pipeline-development
```

### Update existing pipeline

```bash
PROFILE=[AWS_CLI_PROFILE]
aws --profile=$PROFILE cloudformation deploy \
  --template-file=./totem-pipeline.yml \
  --stack-name=totem-config-service-pipeline-development \
  --parameter-overrides \
    "GitBranch=develop"
```

where:
- **AWS_CLI_PROFILE**: AWS CLI Profile
