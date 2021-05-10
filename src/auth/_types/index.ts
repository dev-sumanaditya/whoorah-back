import { FastifyRequest } from 'fastify';

export type RequestWithUid = FastifyRequest & { body: { uid?: string } };
