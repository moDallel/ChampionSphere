import { FastifyInstance } from "fastify";
import matchRouter from "./match.router";

async function router (fastify: FastifyInstance) {

    fastify.register(matchRouter, { prefix: '/match' })

}

export default router