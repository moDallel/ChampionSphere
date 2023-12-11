import { FastifyInstance } from "fastify";
import userRouter from "./user.router";

async function router (fastify: FastifyInstance) {

    fastify.register(userRouter, { prefix: '/user' })

}

export default router