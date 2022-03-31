#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { AppStack } from '../lib/app-stack';

const env = process.env.ENV || 'dev';
const stage = process.env.STAGE || process.env.ENV || 'dev';
const region = process.env.CDK_DEFAULT_REGION || 'ap-southeast-2';
const stackName = `AppStack-${stage}`;

const app = new App();
new AppStack(app, stackName, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region,
    },
    description: stackName,
    tags: {
        env,
        stage,
        region,
        service: stackName,
    },
});
