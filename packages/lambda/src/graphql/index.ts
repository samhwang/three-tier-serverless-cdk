import path from 'path';
import { makeSchema, connectionPlugin } from 'nexus';
import NexusPrismaScalars from 'nexus-prisma/scalars';
import Hello from './hello';
import * as Interface from './interfaces';

const types = {
    Hello,
    Interface,
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
