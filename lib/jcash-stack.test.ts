import {
    expect as expectCDK,
    matchTemplate,
    MatchStyle,
} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { JCashStack } from './jcash-stack';

it('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new JCashStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(
        matchTemplate(
            {
                Resources: {},
            },
            MatchStyle.EXACT
        )
    );
});
