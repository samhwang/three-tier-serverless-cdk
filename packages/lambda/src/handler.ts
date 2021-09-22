import awsLambdaFastify from 'aws-lambda-fastify';
import server from './server';

export const handler = awsLambdaFastify(server);
