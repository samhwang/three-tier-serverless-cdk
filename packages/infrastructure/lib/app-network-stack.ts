import { StackProps } from 'aws-cdk-lib';
import {
  InterfaceVpcEndpoint,
  InterfaceVpcEndpointAwsService,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import CustomStack from './custom-stack';

export default class AppNetworkStack extends CustomStack {
  private readonly appVpc: Vpc;

  private readonly privateSecurityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.appVpc = this.generateVPC();

    this.privateSecurityGroup = this.generateSecurityGroup(
      this.appVpc,
      'App-Security-Group'
    );
    this.privateSecurityGroup.addIngressRule(
      this.privateSecurityGroup,
      Port.allTraffic(),
      'allow internal security group access'
    );

    this.getVPCEndpoint({
      vpc: this.appVpc,
      securityGroup: this.privateSecurityGroup,
    });
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
}
