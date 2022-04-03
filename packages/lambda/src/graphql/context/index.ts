import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '.prisma/client';

export type Context = {
  prisma: PrismaClient;
};

const prisma = new PrismaClient();
export const context = async (
  _request: FastifyRequest,
  _response: FastifyReply
): Promise<Context> => ({ prisma });
