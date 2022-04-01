import path from 'path';
import { Construct } from 'constructs';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import {
    CloudFrontWebDistribution,
    CloudFrontAllowedMethods,
    CloudFrontAllowedCachedMethods,
    ViewerProtocolPolicy,
    PriceClass,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';

interface ClientProps extends StackProps {
    httpApiId: HttpApi['apiId'];
}

export default class AppClientStack extends Stack {
    constructor(scope: Construct, id: string, props: ClientProps) {
        super(scope, id, props);

        const stage = props.tags?.stage || 'dev';

        const siteBucket = new Bucket(this, `AppFEBucket-${stage}`, {
            bucketName: `app-frontend-bucket-${stage}`,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        const cfDistribution = new CloudFrontWebDistribution(
            this,
            `AppDistribution-${stage}`,
            {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: siteBucket,
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
                    {
                        customOriginSource: {
                            domainName: `${props.httpApiId}.execute-api.${this.region}.${this.urlSuffix}`,
                            originPath: `/${stage}`,
                        },
                        behaviors: [
                            {
                                pathPattern: '/api/*',
                                allowedMethods: CloudFrontAllowedMethods.ALL,
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
                comment: 'App CloudFront Distribution',
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                priceClass: PriceClass.PRICE_CLASS_ALL,
            }
        );

        new BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [Source.asset(path.resolve('..', 'frontend', 'build'))],
            destinationBucket: siteBucket,
            distribution: cfDistribution,
            distributionPaths: ['/*'],
        });
    }
}
