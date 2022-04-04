# Three Tier Serverless CDK Template

## The Project

This template will spin up and bootstrap an application with 3 stacks on AWS:
- Backend/API Stack:
  - Node + TypeScript
  - Fastify
  - Mercurius GraphQL Plugin
  - GraphQL Nexus
  - Prisma ORM
- Frontend Stack:
  - React TypeScript
  - GraphQL Relay
- Infrastructure Stacks:
  - AWS Aurora Serverless (with PostgreSQL compatibility)
- Managed by Turborepo and deployed with AWS CDK.

## Bootstrapping process

When deployed, this stack will:

- Create a Serverless Aurora cluster, and associated VPCs.
- Create a Prisma Migration Lambda that is attached to said VPCs so that we can connect to the database for migration work.
- Create a GraphQL Lambda endpoint built from esbuild typescripts.
- Create a REST API Gateway, having only 1 route `/api`, served by the graphQL Lambda.
- Create an S3 Bucket with the built React assets, and enable static page hosting.
- Create a CloudFront Distribution
  - The `/api` route will be handled by the API Gateway
  - All the other routes (including 404) will be handled by the React App.

## Requirements

- [Node 14](https://nodejs.org/en/download/ "Node URL")
  - NPM 8 (Usually bundled with Node. If you're not on v8, run `npm install -g npm@8`)
  - [Typescript 4.4+](https://www.typescriptlang.org/download "TS URL")
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
git clone git@github.com:samhwang/three-tier-serverless-cdk.git
npm install
```

### Running the backend lambda locally

```shell
cd packages/lambda
npm run start
```

### Testing the API Locally with SAM (to verify after cdk synth)

```shell
npm run synth:dev # For dev stage
sam local start-api --port 5000

npm run synth:prod # For prod stage
sam local start-api --port 5000
```

### Developing the Frontend locally

```shell
cd packages/frontend
npm run start
```

## Useful commands

- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Build process

```shell
npm run deploy:dev # To deploy dev stage
npm run deploy:prod # To deploy prod stage
```
