#!/usr/bin/env node
import 'source-map-support/register';
import { App, StackProps } from 'aws-cdk-lib';
import AppNetworkStack from '../lib/app-network-stack';
import AppDBStack from '../lib/app-db-stack';
import AppApiStack from '../lib/app-api-stack';
import AppClientStack from '../lib/app-client-stack';

const env = process.env.ENV || 'dev';
const stage = process.env.STAGE || process.env.ENV || 'dev';
const region = process.env.CDK_DEFAULT_REGION || 'ap-southeast-2';

const app = new App();
const getStackProps = (stackId: string): StackProps => ({
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region,
  },
  description: stackId,
  tags: {
    env,
    stage,
    region,
  },
});

const networkStack = new AppNetworkStack(
  app,
  `AppNetworkStack-${stage}`,
  getStackProps(`AppNetworkStack-${stage}`)
);
const dbStack = new AppDBStack(app, `AppDBStack-${stage}`, {
  ...getStackProps(`AppNetworkStack-${stage}`),
  vpc: networkStack.vpc,
  securityGroup: networkStack.privateSG,
});
const apiStack = new AppApiStack(app, `AppApiStack-${stage}`, {
  ...getStackProps(`AppApiStack-${stage}`),
  databaseCluster: dbStack.dbCluster,
});
new AppClientStack(app, `AppClientStack-${stage}`, {
  ...getStackProps(`AppClientStack-${stage}`),
  httpApiId: apiStack.api.httpApiId,
  apiUrlSuffix: apiStack.urlSuffix,
});
