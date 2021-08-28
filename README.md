# JCash

## Requirements

- Node 14
  - Yarn 1.22
  - Typescript 4.3
- AWS CDK CLI
- AWS SAM CLI
- Docker

## Setup

The `cdk.json` file tells the CDK Toolkit how to execute your app.

### Install

```shell
git clone git@github.com:jcakery/jcash.git
yarn install
```

### Testing the API Locally

```shell
cdk synth --no-staging > template.yml
sam local start-api --port 5000
```

### Developing the Frontend locally

```shell
cd src/frontend
yarn start
```

## Useful commands

- `yarn build` compile typescript to js
- `yarn watch` watch for changes and compile
- `yarn test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
