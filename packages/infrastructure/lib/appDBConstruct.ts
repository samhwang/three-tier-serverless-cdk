import { Construct } from 'constructs';
import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import {
    DatabaseClusterEngine,
    ParameterGroup,
    ServerlessCluster,
    SubnetGroup,
} from 'aws-cdk-lib/aws-rds';
import { ConstructProps } from './interface';

interface DBProps extends ConstructProps {
    vpc: Vpc;
    securityGroup: SecurityGroup;
}

export default class AppDBConstruct extends Construct {
    private readonly auroraCluster: ServerlessCluster;

    private readonly stage: string;

    private readonly region: string;

    constructor(parent: Stack, name: string, props: DBProps) {
        super(parent, name);

        this.stage = props.stage || 'dev';

        this.region = props.region || 'ap-southeast-2';

        const subnetGroup = this.generateSubnetGroup(props.vpc);

        this.auroraCluster = this.generateAuroraCluster({
            ...props,
            subnetGroup,
        });
    }

    generateSubnetGroup(vpc: Vpc): SubnetGroup {
        return new SubnetGroup(this, 'App-RDS-Subnet-Group', {
            vpc,
            subnetGroupName: 'App-RDS-Subnet-Group',
            vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
            removalPolicy: RemovalPolicy.DESTROY,
            description: 'private isolated subnet group for db',
        });
    }

    get dbCluster(): ServerlessCluster {
        return this.auroraCluster;
    }

    generateAuroraCluster({
        vpc,
        subnetGroup,
        securityGroup,
    }: DBProps & { subnetGroup: SubnetGroup }): ServerlessCluster {
        return new ServerlessCluster(this, `AppAuroraCluster${this.stage}`, {
            engine: DatabaseClusterEngine.AURORA_POSTGRESQL,
            parameterGroup: ParameterGroup.fromParameterGroupName(
                this,
                'AppParameterGroup',
                'default.aurora-postgresql10'
            ),
            defaultDatabaseName: `AppDB${this.stage}`,
            enableDataApi: true,
            vpc,
            subnetGroup,
            securityGroups: [securityGroup],
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }
}
