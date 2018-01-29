# totem-v3-config-service [![Coverage Status](https://coveralls.io/repos/github/totem/totem-v3-config-service/badge.svg?branch=feature_config)](https://coveralls.io/github/totem/totem-v3-config-service?branch=feature_config) [![Build Status](https://travis-ci.org/totem/totem-v3-config-service.svg?branch=feature_config)](https://travis-ci.org/totem/totem-v3-config-service)
Manages the lifecycle for building, deploying  and decommissioning projects on totem-v3

## Documentation
 
The core documentation for this project can be found in the current repository. For open source documentation see [https://github.com/totem/totem-v3](https://github.com/totem/totem-v3)

### Architecture

See [Totem V3 Architecture](https://github.com/totem/totem-v3/tree/develop/architecture)

 
## Setup
 
### Local

- [AWS SAM Local](https://github.com/awslabs/aws-sam-local#windows-linux-osx-with-npm-recommended)
- [node 6.10](https://nodejs.org)
- [npm 5.x](https://www.npmjs.com/package/npm5)
- [gulp-cli](https://www.npmjs.com/package/gulp-cli/tutorial)
 
## Build
 
```
npm install
```
 
## Run
 
### Local

To invoke config load task lambda function locally, execute command:

```bash
env AWS_ACCESS_KEY_ID='[AWS_ACCESS_KEY_ID]' \
    AWS_SECRET_ACCESS_KEY='[AWS_SECRET_ACCESS_KEY]' \
    AWS_REGION=us-west-2 \
    GITHUB_TOKEN='[GITHUB_TOKEN]' \
    TOTEM_BUCKET='[TOTEM_BUCKET]'
    sam local invoke --template totem-deploy.yml --event events/load-config-event.json
```
where:
- **GITHUB_TOKEN**: Github token used for fetching configs from github repo.
- **AWS_REGION**: Aws region where config-service is deployed
- **AWS_ACCESS_KEY_ID**: AWS Access Key ID (For S3 Totem bucket)
- **AWS_SECRET_ACCESS_KEY**: AWS Access Key ID (For S3 Totem bucket)
- **TOTEM_BUCKET**: S3 bucket for totem (for storing configs)

## Test

### Travis
The unit and integration tests ar run automatically in [travis](https://travis-ci.org/totem/totem-v3-config-service). 


To run unit and integration tests locally, use command:

```
gulp test
```

### Unit Tests
To run just unit tests, use command:

```
gulp test:unit
```

### Integration Tests
To run just integration tests, use command:

```
gulp test:integration
```

### Functional Tests
The functional tests run automatically as part of continuous deployment pipeline for
config-service. These tests expect to run in  full functional environment for totem-v3.

To execute functional tests locally, use command:

```
env GITHUB_TOKEN=[GITHUB_TOKEN] \
  TEST_REPO=[TEST_REPO] \
  TEST_OWNER=[TEST_OWNER] \
  TEST_BRANCH=[TEST_BRANCH] \
  AWS_REGION=[AWS_REGION] \
  gulp test:functional
```

- **GITHUB_TOKEN**: Github token used for validating totem v3 setup.
- **TEST_REPO**: Github test repository used to configure with totem-v3 (e.g: totem-demo)
- **TEST_OWNER**: Github test repository owner (e.g.: totem)
- **TEST_BRANCH**: Github test repository branch (e.g.: develop)
- **AWS_REGION**: Aws region where config-service is deployed

 
## Deploy
 
This project is deployed to AWS in a continuous fashion using [codepipeline](https://aws.amazon.com/codepipeline/)

To setup, configure and manage the the pipeline see [provisioning guide](./provisioning)
 
 
## Release
 
This project uses the [Git Flow](https://confluence.meltdev.com/display/DEV/Git+Flow) process for getting changes into the project.


## Resources

- [AWS SAM Model](https://github.com/awslabs/serverless-application-model)
- [Lambda Continuous Deploy](http://docs.aws.amazon.com/lambda/latest/dg/automating-deployment.html) 
- [Codepipeline Cloudformation](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-pipeline.html)
- [Gateway - Step Functions](http://docs.aws.amazon.com/step-functions/latest/dg/tutorial-api-gateway.html)