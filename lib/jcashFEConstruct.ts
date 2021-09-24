import { Construct, RemovalPolicy, Stack } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';

export default class JCashFEConstruct extends Construct {
    private siteBucket: Bucket;

    constructor(parent: Stack, name: string) {
        super(parent, name);

        const siteBucket = new Bucket(this, 'JCashFEBucket', {
            bucketName: 'jcash-frontend-bucket',
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        this.siteBucket = siteBucket;
    }

    get bucket(): Bucket {
        return this.siteBucket;
    }
}
