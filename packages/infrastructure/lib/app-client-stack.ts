import { execSync, ExecSyncOptions } from 'child_process';
import path from 'path';
import fs from 'fs';
import { Construct } from 'constructs';
import {
    CfnOutput,
    DockerImage,
    RemovalPolicy,
    Stack,
    StackProps,
} from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import {
    CloudFrontAllowedCachedMethods,
    CloudFrontAllowedMethods,
    CloudFrontWebDistribution,
    OriginAccessIdentity,
    PriceClass,
    ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import CustomStack from './custom-stack';

interface ClientProps extends StackProps {
    httpApiId: HttpApi['apiId'];
    apiUrlSuffix: Stack['urlSuffix'];
}

export default class AppClientStack extends CustomStack {
    constructor(scope: Construct, id: string, props: ClientProps) {
        super(scope, id, props);

        const siteBucket = new Bucket(this, `AppFEBucket-${this.stage}`, {
            bucketName: `app-frontend-bucket-${this.stage}`,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        const originAccessIdentity = new OriginAccessIdentity(
            this,
            'app-site-origin-access-identity'
        );
        siteBucket.grantRead(originAccessIdentity);

        const cfDistribution = new CloudFrontWebDistribution(
            this,
            `AppDistribution-${this.stage}`,
            {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: siteBucket,
                            originAccessIdentity,
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
                                viewerProtocolPolicy:
                                    ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                            },
                        ],
                    },
                    {
                        customOriginSource: {
                            domainName: `${props.httpApiId}.execute-api.${this.region}.${props.apiUrlSuffix}`,
                            originPath: `/${this.stage}`,
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

        const execOptions: ExecSyncOptions = {
            stdio: ['ignore', process.stderr, 'inherit'],
        };

        const clientPath = path.resolve(__dirname, '..', '..', 'frontend');
        const clientBundle = Source.asset(clientPath, {
            bundling: {
                image: DockerImage.fromRegistry('node:14'),
                local: {
                    tryBundle(outputDir: string): boolean {
                        try {
                            execSync('npx vite build', execOptions);
                            fs.copyFileSync(
                                path.resolve('..', 'build'),
                                outputDir
                            );
                            return true;
                        } catch (error: any) {
                            console.error(error);
                            return false;
                        }
                    },
                },
            },
        });

        new BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [clientBundle],
            destinationBucket: siteBucket,
            distribution: cfDistribution,
            distributionPaths: ['/*'],
        });

        new CfnOutput(this, 'DistributionDomain', {
            value: cfDistribution.distributionDomainName,
        });
    }
}
