import fastify from 'fastify';

const server = fastify();
server.get('/', async (_, reply) =>
  reply.send({
    statusCode: 200,
    body: 'Hello World!',
  })
);

export default server;
