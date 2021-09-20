import path from 'path';
import fastify from 'fastify';
import mercurius from 'mercurius';
import { makeSchema } from 'nexus';
import * as types from './graphql';

const schema = makeSchema({
  types,
  outputs: !process.env.ENV && {
    schema: path.join(__dirname, './schema.graphql'),
    typegen: path.join(__dirname, './schema-types.d.ts'),
  },
});

const server = fastify();

server.register(mercurius, {
  schema,
  graphiql: true,
  ide: true,
});

server.setNotFoundHandler((_, reply) =>
  reply.code(404).send('404: Page Not Found')
);

export default server;
