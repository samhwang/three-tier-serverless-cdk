# CDK TypeScript Node GraphQL React Template

## The Project

This template will spin up and bootstrap an application stack on AWS using AWS CDK.

## Requirements

- [Node 14](https://nodejs.org/en/download/ "Node URL")
  - [Yarn 1.22](https://classic.yarnpkg.com/en/docs/install "Yarn URL")
  - [Typescript 4.4](https://www.typescriptlang.org/download "TS URL")
- AWS Tools
  - [AWS CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/cli.html "AWS CDK URL")
  - [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html "AWS SAM URL")
  - [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html "AWS CLI Download")
    - After installing, you will need to [configure it with your AWS Crendentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html "AWS CLI Configure").
- [Docker](https://docs.docker.com/get-docker/ "Docker URL")

## Setup

The `cdk.json` file tells the CDK Toolkit how to execute your app.

### Install

```shell
git clone git@github.com:samhwang/cdk-ts-node-lambda-react-graphql.git
yarn install
```

### Running the backend lambda locally

```shell
cd packages/lambda
yarn start
```

### Testing the API Locally with SAM (to verify after cdk synth)

```shell
yarn synth:dev # For dev stage
sam local start-api --port 5000

yarn synth:prod # For prod stage
sam local start-api --port 5000
```

### Developing the Frontend locally

```shell
cd packages/frontend
yarn start
```

## Useful commands

- `yarn test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Build process

```shell
yarn build:workspaces
yarn deploy:dev # To deploy dev stage
yarn deploy:prod # To deploy prod stage
```
