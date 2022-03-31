import {
    expect as expectCDK,
    matchTemplate,
    MatchStyle,
} from '@aws-cdk/assert';
import { App } from 'aws-cdk-lib';
import { AppStack } from './app-stack';

it('Empty Stack', () => {
    const env = process.env.ENV || 'dev';
    const stage = process.env.STAGE || process.env.ENV || 'dev';
    const region = process.env.CDK_DEFAULT_REGION || 'ap-southeast-2';
    const stackName = `AppStack-${stage}`;
    const app = new App();
    const stack = new AppStack(app, 'MyTestStack', {
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

    expectCDK(stack).to(
        matchTemplate(
            {
                Resources: {},
            },
            MatchStyle.EXACT
        )
    );
});
