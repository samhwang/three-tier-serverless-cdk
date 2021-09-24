import path from 'path';
import { makeSchema } from 'nexus';
import Query from './schema/query';

const types = {
    Query,
};

const schema = makeSchema({
    types,
    outputs: !process.env.ENV && {
        schema: path.join(__dirname, '../schema.graphql'),
        typegen: path.join(__dirname, '../schema-types.d.ts'),
    },
});

export default schema;
