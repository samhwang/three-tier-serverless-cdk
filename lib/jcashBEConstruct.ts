import path from 'path';
import { Stack, Construct, Duration } from '@aws-cdk/core';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Runtime } from '@aws-cdk/aws-lambda';
import {
    NodejsFunction,
    NodejsFunctionProps,
} from '@aws-cdk/aws-lambda-nodejs';
import { ConstructProps } from './interface';

interface FunctionProps {
    id: string;
    handler: string;
    entry: string;
    options?: NodejsFunctionProps;
}

export default class JCashBEConstruct extends Construct {
    private restApiInstance: LambdaRestApi;

    private stage: string;

    constructor(parent: Stack, name: string, props: ConstructProps) {
        super(parent, name);

        this.stage = props.stage || 'dev';

        const graphqlAPILambda = this.getFunctionConstruct({
            id: 'graphqlAPILambda',
            handler: 'handler',
            entry: 'handler',
            options: {
                functionName: `jcash-graphqlAPILambda-${this.stage}`,
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
                                'packages/lambda/src/schema.graphql'
                            );
                            const prismaPath = path.join(
                                inputDir,
                                'packages/lambda/prisma'
                            );
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

        this.restApiInstance = new LambdaRestApi(this, 'JCashAPI', {
            restApiName: 'JCash API',
            description: 'The JCash API Service',
            handler: graphqlAPILambda,
            proxy: false,
            deployOptions: {
                stageName: this.stage || 'dev',
            },
        });
        const apiPath = this.restApiInstance.root.addResource('api');
        apiPath.addProxy({
            anyMethod: true,
        });
    }

    get api(): LambdaRestApi {
        return this.restApiInstance;
    }

    getFunctionConstruct({
        id,
        handler,
        entry,
        options,
    }: FunctionProps): NodejsFunction {
        return new NodejsFunction(this, id, {
            runtime: Runtime.NODEJS_14_X,
            functionName: `jcash-${handler}-${this.stage}`,
            entry: path.resolve(
                __dirname,
                `../packages/lambda/src/${entry}.ts`
            ),
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
