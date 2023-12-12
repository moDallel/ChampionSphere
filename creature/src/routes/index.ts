import { FastifyInstance } from "fastify";
import creatureRouter from "./creature.router";

async function router (fastify: FastifyInstance) {

    fastify.register(creatureRouter, { prefix: '/creature' })

}

export default router