import path from 'path';
import { makeSchema, connectionPlugin } from 'nexus';
import NexusPrismaScalars from 'nexus-prisma/scalars';
import Hello from './Hello';
import * as Interface from './Interface';
import * as User from './User';

const types = {
    Hello,
    Interface,
    User,
};

const schema = makeSchema({
    types: {
        NexusPrismaScalars,
        ...types,
    },
    plugins: [
        connectionPlugin({
            disableBackwardPagination: true,
            strictArgs: true,
            nonNullDefaults: { output: true },
        }),
    ],
    contextType: {
        module: path.join(__dirname, 'context', 'index.ts'),
        export: 'Context',
    },
    shouldGenerateArtifacts: !process.env.ENV,
    outputs: {
        schema: path.join(__dirname, '..', '/schema.graphql'),
        typegen: path.join(__dirname, '..', '/schema-types.gen.ts'),
    },
});

export default schema;
