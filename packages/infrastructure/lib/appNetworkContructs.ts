import { Stack, Construct, RemovalPolicy } from '@aws-cdk/core';
import {
    InterfaceVpcEndpoint,
    InterfaceVpcEndpointAwsService,
    Peer,
    Port,
    SecurityGroup,
    SubnetType,
    Vpc,
    Instance,
    InstanceType,
    InstanceClass,
    InstanceSize,
    MachineImage,
    OperatingSystemType,
} from '@aws-cdk/aws-ec2';
import { ConstructProps } from './interface';

export default class AppNetworkConstruct extends Construct {
    private readonly stage: string;

    private readonly region: string;

    private readonly appVpc: Vpc;

    private readonly publicSecurityGroup: SecurityGroup;

    private readonly privateSecurityGroup: SecurityGroup;

    constructor(parent: Stack, name: string, props: ConstructProps) {
        super(parent, name);

        this.stage = props.stage || 'dev';

        this.region = props.region || 'ap-southeast-2';

        this.appVpc = this.generateVPC();

        this.publicSecurityGroup = this.generateSecurityGroup(
            this.appVpc,
            `App-Public-Security-Group-${this.stage}-${this.region}`
        );
        this.publicSecurityGroup.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(22),
            'allow SSH access'
        );

        this.privateSecurityGroup = this.generateSecurityGroup(
            this.appVpc,
            'App-Security-Group'
        );
        this.privateSecurityGroup.addIngressRule(
            this.privateSecurityGroup,
            Port.allTraffic(),
            'allow internal security group access'
        );
        this.privateSecurityGroup.addIngressRule(
            this.publicSecurityGroup,
            Port.tcp(5432),
            'allow Aurora Serverless Postgres access'
        );

        this.getVPCEndpoint({
            vpc: this.appVpc,
            securityGroup: this.privateSecurityGroup,
        });

        this.generateJumpbox();
    }

    generateVPC(): Vpc {
        return new Vpc(this, 'AppVPC', {
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

    get vpc(): Vpc {
        return this.appVpc;
    }

    generateSecurityGroup(vpc: Vpc, securityGroupName: string): SecurityGroup {
        return new SecurityGroup(this, securityGroupName, {
            vpc,
            securityGroupName,
        });
    }

    get publicSG(): SecurityGroup {
        return this.publicSecurityGroup;
    }

    get privateSG(): SecurityGroup {
        return this.privateSecurityGroup;
    }

    getVPCEndpoint({
        vpc,
        securityGroup,
    }: {
        vpc: Vpc;
        securityGroup: SecurityGroup;
    }): InterfaceVpcEndpoint {
        return new InterfaceVpcEndpoint(this, 'secrets-manager', {
            service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            vpc,
            privateDnsEnabled: true,
            subnets: { subnetType: SubnetType.PRIVATE_ISOLATED },
            securityGroups: [securityGroup],
        });
    }

    generateJumpbox(): void {
        const machineImage = MachineImage.fromSsmParameter(
            '/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id',
            { os: OperatingSystemType.LINUX }
        );
        new Instance(this, 'App-Jumpbox', {
            vpc: this.appVpc,
            securityGroup: this.publicSecurityGroup,
            vpcSubnets: { subnetType: SubnetType.PUBLIC },
            instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
            machineImage,
            keyName: this.node.tryGetContext('keyName'),
        });
    }
}
