import path from 'path';
import { Stack, Construct, Duration, RemovalPolicy } from '@aws-cdk/core';
import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Runtime } from '@aws-cdk/aws-lambda';
import {
    NodejsFunction,
    NodejsFunctionProps,
} from '@aws-cdk/aws-lambda-nodejs';
import { Port, SecurityGroup, SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import {
    DatabaseClusterEngine,
    ParameterGroup,
    ServerlessCluster,
    SubnetGroup,
} from '@aws-cdk/aws-rds';
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

        const vpc = this.generateVPC();
        const securityGroup = this.generateSecurityGroup(vpc);
        const subnetGroup = this.generateSubnetGroup(vpc);

        this.auroraCluster = this.generateAuroraCluster({
            vpc,
            subnetGroup,
            securityGroup,
        });

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
                ENV: process.env.ENV || 'development',
            },
            bundling: {
                minify: true,
                sourceMap: true,
            },
            ...options,
        });
    }

    generateVPC(): Vpc {
        return new Vpc(this, 'JCashVPC', {
            cidr: '10.0.0.0/20',
            natGateways: 0,
            maxAzs: 2,
            enableDnsHostnames: true,
            enableDnsSupport: true,
            subnetConfiguration: [
                {
                    cidrMask: 22,
                    name: 'public',
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    cidrMask: 22,
                    name: 'private',
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
            ],
        });
    }

    generateSecurityGroup(vpc: Vpc): SecurityGroup {
        const securityGroup = new SecurityGroup(this, 'JCash-Security-Group', {
            vpc,
            securityGroupName: 'JCash-Security-Group',
        });
        securityGroup.addIngressRule(
            securityGroup,
            Port.allTraffic(),
            'allow internal security group access'
        );

        return securityGroup;
    }

    generateSubnetGroup(vpc: Vpc): SubnetGroup {
        return new SubnetGroup(this, 'JCash-RDS-Subnet-Group', {
            vpc,
            subnetGroupName: 'JCash-RDS-Subnet-Group',
            vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
            removalPolicy: RemovalPolicy.DESTROY,
            description: 'private isolated subnet group for db',
        });
    }

    generateAuroraCluster({
        vpc,
        subnetGroup,
        securityGroup,
    }: {
        vpc: Vpc;
        subnetGroup: SubnetGroup;
        securityGroup: SecurityGroup;
    }): ServerlessCluster {
        return new ServerlessCluster(this, 'JCashAuroraCluster', {
            engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
            parameterGroup: ParameterGroup.fromParameterGroupName(
                this,
                'JCashParameterGroup',
                'default.aurora-postgresql10'
            ),
            defaultDatabaseName: `JCashDB-${this.stage}`,
            enableDataApi: true,
            vpc,
            subnetGroup,
            securityGroups: [securityGroup],
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }
}
