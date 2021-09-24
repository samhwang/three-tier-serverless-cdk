import { Stack, Construct, StackProps } from '@aws-cdk/core';
import JCashBEConstruct from './jcashBEConstruct';
import JCashFEConstruct from './jcashFEConstruct';

export class JCashStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        new JCashBEConstruct(this, 'JCashBE');
        new JCashFEConstruct(this, 'JCashFE');
    }
}
