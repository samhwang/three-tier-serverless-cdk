#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { JCashStack } from '../lib/jcash-stack';

const env = process.env.ENV || 'dev';
const stage = process.env.STAGE || process.env.ENV || 'dev';
const region = process.env.CDK_DEFAULT_REGION || 'ap-southeast-2';
const stackName = `JCashStack-${stage}`;

const app = new App();
new JCashStack(app, stackName, {
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
