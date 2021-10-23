import { fromGlobalId } from 'graphql-relay';
import { scalarType } from 'nexus';

export const RelayId = scalarType({
    name: 'RelayId',
    asNexusMethod: 'relayId',
    description: 'Must and only use for input',
    parseValue: (value) => fromGlobalId(value).id,
    parseLiteral: (node: any) => fromGlobalId(node.value).id,
});
