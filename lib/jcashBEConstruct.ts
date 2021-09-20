import path from 'path';
import { Stack, Construct, Duration } from '@aws-cdk/core';
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

interface FunctionProps {
  handler: string;
  entry: string;
  options?: NodejsFunctionProps;
}

export default class JCashBEConstruct extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const graphqlAPILambda = this.getFunctionConstruct({
      handler: 'handler',
      entry: 'handler',
      options: {
        functionName: `jcash-graphqlAPILambda-${process.env.ENV}`,
        bundling: {
          minify: true,
          sourceMap: true,
          nodeModules: ['@prisma/client'],
          commandHooks: {
            beforeBundling(): string[] {
              return [];
            },
            beforeInstall(): string[] {
              return [];
            },
            afterBundling(inputDir: string, outputDir: string) {
              const schemaPath = path.join(
                inputDir,
                'src/lambda/src/schema.graphql'
              );
              const prismaPath = path.join(inputDir, 'src/lambda/prisma');
              return [
                `cp -R ${prismaPath}/ ${outputDir}/`,
                `cp ${schemaPath} ${outputDir}/`,
                `cd ${outputDir}`,
                `npx prisma generate`,
                `rm -rf node_modules/@prisma/engines node_modules/@prisma/client/node_modules node_modules/.bin node_modules/prisma`,
                '',
              ];
            },
          },
        },
      },
    });

    const lambdaIntegration = new LambdaIntegration(graphqlAPILambda);

    const api = new RestApi(this, 'JCashAPI', {
      restApiName: 'JCash API',
      description: 'The JCash API Service',
    });

    const endpoint = api.root.addResource('graphql');
    endpoint.addMethod('GET', lambdaIntegration);
    endpoint.addMethod('POST', lambdaIntegration);
    JCashBEConstruct.addCorsOptions(endpoint);

    const playgroundEndpoint = api.root.addResource('graphiql');
    playgroundEndpoint.addMethod('GET', lambdaIntegration);
    JCashBEConstruct.addCorsOptions(playgroundEndpoint);
  }

  getFunctionConstruct({
    handler,
    entry,
    options,
  }: FunctionProps): NodejsFunction {
    return new NodejsFunction(this, handler, {
      runtime: Runtime.NODEJS_14_X,
      functionName: `jcash-${handler}-${process.env.ENV}`,
      entry: path.resolve(__dirname, `../src/lambda/src/${entry}.ts`),
      handler,
      timeout: Duration.seconds(30),
      memorySize: 256,
      depsLockFilePath: path.resolve(__dirname, '../yarn.lock'),
      environment: {
        ENV: process.env.ENV || '',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
      ...options,
    });
  }

  static addCorsOptions(apiResource: IResource) {
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
  }
}
