import fastify from 'fastify';
import mercurius from 'mercurius';
import schema from './graphql';

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
