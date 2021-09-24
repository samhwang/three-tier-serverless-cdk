import { Stack, Construct, StackProps } from '@aws-cdk/core';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import {
    CloudFrontWebDistribution,
    CloudFrontAllowedMethods,
    CloudFrontAllowedCachedMethods,
    ViewerProtocolPolicy,
    PriceClass,
} from '@aws-cdk/aws-cloudfront';
import JCashBEConstruct from './jcashBEConstruct';
import JCashFEConstruct from './jcashFEConstruct';

export class JCashStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        new JCashBEConstruct(this, 'JCashBE');
        const FEConstruct = new JCashFEConstruct(this, 'JCashFE');
        const FEBucket = FEConstruct.bucket;

        const cfDistribution = new CloudFrontWebDistribution(
            this,
            'JCashFEDistribution',
            {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: FEBucket,
                        },
                        behaviors: [
                            {
                                isDefaultBehavior: true,
                                compress: true,
                                allowedMethods: CloudFrontAllowedMethods.ALL,
                                cachedMethods:
                                    CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                                forwardedValues: {
                                    queryString: true,
                                    cookies: {
                                        forward: 'none',
                                    },
                                    headers: [
                                        'Access-Control-Request-Headers',
                                        'Access-Control-Request-Method',
                                        'Origin',
                                    ],
                                },
                            },
                        ],
                    },
                ],
                errorConfigurations: [
                    {
                        errorCode: 403,
                        responseCode: 200,
                        responsePagePath: '/index.html',
                    },
                    {
                        errorCode: 404,
                        responseCode: 200,
                        responsePagePath: '/index.html',
                    },
                ],
                comment: 'JCash CloudFront Distribution',
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                priceClass: PriceClass.PRICE_CLASS_ALL,
            }
        );

        new BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [Source.asset('./packages/frontend/build')],
            destinationBucket: FEBucket,
            distribution: cfDistribution,
            distributionPaths: ['/*'],
        });
    }
}
