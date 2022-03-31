import { Construct } from 'constructs';
import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { ConstructProps } from './interface';

export default class AppFEConstruct extends Construct {
    private readonly siteBucket: Bucket;

    constructor(parent: Stack, name: string, props: ConstructProps) {
        super(parent, name);

        const stage = props.stage || 'dev';

        this.siteBucket = new Bucket(this, `AppFEBucket-${stage}`, {
            bucketName: `app-frontend-bucket-${stage}`,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
    }

    get bucket(): Bucket {
        return this.siteBucket;
    }
}
