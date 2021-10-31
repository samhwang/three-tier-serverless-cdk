import path from 'path';
import { Stack, Construct, Duration, RemovalPolicy } from '@aws-cdk/core';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Runtime } from '@aws-cdk/aws-lambda';
import {
    NodejsFunction,
    NodejsFunctionProps,
} from '@aws-cdk/aws-lambda-nodejs';
import { ServerlessCluster } from '@aws-cdk/aws-rds';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';
import { ConstructProps } from './interface';

interface BackendProps extends ConstructProps {
    databaseCluster: ServerlessCluster;
}

interface FunctionProps {
    id: string;
    handler: string;
    entry: string;
    options?: NodejsFunctionProps;
}

export default class AppBEConstruct extends Construct {
    private readonly restApiInstance: LambdaRestApi;

    private readonly auroraCluster: ServerlessCluster;

    private readonly stage: string;

    private readonly region: string;

    constructor(parent: Stack, name: string, props: BackendProps) {
        super(parent, name);

        this.stage = props.stage || 'dev';

        this.region = props.region || 'ap-southeast-2';

        this.auroraCluster = props.databaseCluster;

        const graphqlAPILambda = this.getFunctionConstruct({
            id: 'graphqlAPILambda',
            handler: 'handler',
            entry: 'handler',
            options: {
                functionName: `app-graphqlAPILambda-${this.stage}`,
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

        this.restApiInstance = new LambdaRestApi(this, 'AppAPI', {
            restApiName: 'App API',
            description: 'The App API Service',
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

    getLambdaRolePolicy() {
        return new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['secretsmanager:GetSecretValue'],
            resources: [this.auroraCluster.secret?.secretArn || ''],
        });
    }

    getFunctionConstruct({
        id,
        handler,
        entry,
        options,
    }: FunctionProps): NodejsFunction {
        const lambda = new NodejsFunction(this, id, {
            runtime: Runtime.NODEJS_14_X,
            functionName: `app-${handler}-${this.stage}`,
            entry: path.resolve(
                __dirname,
                '..',
                '..',
                `lambda/src/${entry}.ts`
            ),
            handler,
            timeout: Duration.seconds(30),
            memorySize: 256,
            depsLockFilePath: path.resolve(
                __dirname,
                '..',
                '..',
                '..',
                'package-lock.json'
            ),
            environment: {
                ENV: process.env.ENV || 'development',
                REGION: this.region || 'ap-southeast-2',
                SECRET_ID: this.auroraCluster.secret?.secretArn || '',
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            },
            bundling: {
                minify: true,
                sourceMap: true,
            },
            ...options,
        });
        const policy = this.getLambdaRolePolicy();
        lambda.addToRolePolicy(policy);

        return lambda;
    }
}
