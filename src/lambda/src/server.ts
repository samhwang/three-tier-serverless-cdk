import fastify from 'fastify';
import mercurius from 'mercurius';
import { gql } from 'mercurius-codegen';

const server = fastify();

const schema = gql`
  type Query {
    hello: HelloType
  }

  type HelloType {
    message: String!
    success: Boolean!
    errors: [String]!
  }
`;

const resolvers = {
  Query: {
    hello: async () => ({
      message: 'Hello World',
      success: true,
      errors: [],
    }),
  },
};

server.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
});

server.setNotFoundHandler((_, reply) =>
  reply.code(404).send('404: Page Not Found')
);

export default server;
