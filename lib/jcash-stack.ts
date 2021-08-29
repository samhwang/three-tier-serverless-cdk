import path from 'path';
import {
  Stack,
  Construct,
  StackProps,
  Duration,
  RemovalPolicy,
} from '@aws-cdk/core';
import {
  IResource,
  MockIntegration,
  LambdaIntegration,
  PassthroughBehavior,
  RestApi,
} from '@aws-cdk/aws-apigateway';
import { Runtime } from '@aws-cdk/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from '@aws-cdk/aws-lambda-nodejs';
import { Bucket, CfnBucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import {
  CloudFrontWebDistribution,
  CloudFrontAllowedMethods,
  CloudFrontAllowedCachedMethods,
  ViewerProtocolPolicy,
} from '@aws-cdk/aws-cloudfront';

interface FunctionProps {
  handler: string;
  entry: string;
  options?: NodejsFunctionProps;
}

const addCorsOptions = (apiResource: IResource) => {
  apiResource.addMethod(
    'OPTIONS',
    new MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers':
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials':
              "'false'",
            'method.response.header.Access-Control-Allow-Methods':
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    }
  );
};

export class JCashStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // LAMBDA CONSTRUCT
    const testLambda = this.getFunctionConstruct({
      handler: 'handler',
      entry: 'handler',
    });

    const testLambdaIntegration = new LambdaIntegration(testLambda);

    const api = new RestApi(this, 'JCashAPI', {
      restApiName: 'JCash API',
      description: 'The JCash API Service',
    });

    const test = api.root.addResource('test');
    test.addMethod('GET', testLambdaIntegration);
    test.addMethod('POST', testLambdaIntegration);
    addCorsOptions(test);

    // FE CONSTRUCT
    const siteBucket = new Bucket(this, 'JCashFEBucket', {
      bucketName: 'jcash-frontend-bucket',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const cfnBucket = siteBucket.node.findChild('Children') as CfnBucket;
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
        comment: 'JCashFrontend - CloudFront Distribution',
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    );

    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [Source.asset('./src/frontend/build')],
      destinationBucket: siteBucket,
      distribution: cfDistribution,
      distributionPaths: ['/*'],
    });
  }

  getFunctionConstruct({
    handler,
    entry,
    options,
  }: FunctionProps): NodejsFunction {
    return new NodejsFunction(this, handler, {
      runtime: Runtime.NODEJS_14_X,
      functionName: `jcash-${handler}-${process.env.ENV}`,
      entry: path.resolve(__dirname, `../src/lambda/${entry}.ts`),
      handler,
      timeout: Duration.seconds(30),
      memorySize: 256,
      depsLockFilePath: path.resolve(__dirname, '../yarn.lock'),
      ...options,
    });
  }
}
