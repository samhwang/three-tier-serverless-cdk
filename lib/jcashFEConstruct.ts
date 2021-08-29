import { Construct, RemovalPolicy, Stack } from '@aws-cdk/core';
import { Bucket, CfnBucket, IBucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import {
  CloudFrontWebDistribution,
  CloudFrontAllowedMethods,
  CloudFrontAllowedCachedMethods,
  ViewerProtocolPolicy,
  PriceClass,
} from '@aws-cdk/aws-cloudfront';

export default class JCashFEConstruct extends Construct {
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
    JCashFEConstruct.enableCorsOnBucket(siteBucket);

    const cfDistribution = new CloudFrontWebDistribution(
      this,
      'JCashFEDistribution',
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
                cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
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
        comment: 'JCashFrontend - CloudFront Distribution',
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        priceClass: PriceClass.PRICE_CLASS_ALL,
      }
    );

    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [Source.asset('./src/frontend/build')],
      destinationBucket: siteBucket,
      distribution: cfDistribution,
      distributionPaths: ['/*'],
    });
  }

  static enableCorsOnBucket(bucket: IBucket) {
    const cfnBucket = bucket.node.findChild('Resource') as CfnBucket;
    cfnBucket.addPropertyOverride('CorsConfiguration', {
      CorsRules: [
        {
          AllowedOrigins: ['*'],
          AllowedMethods: ['HEAD', 'GET', 'PUT', 'POST', 'DELETE'],
          ExposedHeaders: [
            'x-amz-server-side-encryption',
            'x-amz-request-id',
            'x-amz-id-2',
          ],
          AllowedHeaders: ['*'],
        },
      ],
    });
  }
}
