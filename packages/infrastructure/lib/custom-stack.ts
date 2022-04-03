import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export default class CustomStack extends Stack {
    public readonly stage: string;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        this.stage = props.tags?.stage || 'dev';
    }
}
