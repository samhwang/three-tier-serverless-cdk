import path from 'path';
import { Stack, Construct, Duration } from '@aws-cdk/core';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
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
          nodeModules: ['readable-stream', '@prisma/client'],
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
              ];
            },
          },
        },
      },
    });

    new LambdaRestApi(this, 'JCashAPI', {
      restApiName: 'JCash API',
      description: 'The JCash API Service',
      handler: graphqlAPILambda,
      proxy: true,
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
      entry: path.resolve(__dirname, `../packages/lambda/src/${entry}.ts`),
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
}
