import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import mercurius from 'mercurius';
import schema from './graphql';

const server = fastify();

server.register(fastifyCors, {
    origin: true,
    preflightContinue: true,
});

server.register(mercurius, {
    schema,
    graphiql: false,
    ide: false,
    path: '/api/graphql',
});

server.setNotFoundHandler((_, reply) =>
    reply.code(404).send('404: Page Not Found')
);

export default server;
