import { FastifyInstance } from "fastify";
import authRouter from "./auth.router";

async function router (fastify: FastifyInstance) {

    fastify.register(authRouter, { prefix: '/auth' })

}

export default router