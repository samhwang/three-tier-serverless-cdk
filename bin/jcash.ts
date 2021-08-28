#!/usr/bin/env node
import 'source-map-support/register';
import { App, Tags } from '@aws-cdk/core';
import { JCashStack } from '../lib/jcash-stack';

const env = process.env.ENV || 'dev';
const stage = process.env.STAGE || 'dev';
const region = process.env.CDK_DEFAULT_REGION || 'ap-southeast-2';
const stackName = `JCashStack-${stage}`;

const app = new App();
const jcashStack = new JCashStack(app, stackName, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region,
  },
});

const tags = Tags.of(jcashStack);
tags.add('env', env);
tags.add('stage', stage);
tags.add('region', region);
tags.add('service', stackName);
