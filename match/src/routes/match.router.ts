import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'
import { validateToken } from '../middleware/auth.middleware'

async function matchRouter(fastify: FastifyInstance) {

    fastify.route({
      method: 'GET',
      url: '/list',
      handler: controllers.listMatchs,
      preHandler: validateToken
    })

    fastify.route({
      method: 'POST',
      url: '/create',
      handler: controllers.createMatch,
      preHandler: validateToken
    })

    fastify.route({
      method: 'POST',
      url: '/join/:matchId',
      handler: controllers.joinMatch,
      preHandler: validateToken
    })

    fastify.route({
      method: 'POST',
      url: '/send-creature/:matchId',
      handler: controllers.sendCreature,
      preHandler: validateToken
    })

    fastify.route({
      method: 'GET',
      url: '/:matchId/rounds',
      handler: controllers.getRounds,
      preHandler: validateToken
    })

    fastify.route({
      method: 'GET',
      url: '/:matchId',
      handler: controllers.getMatch,
      preHandler: validateToken
    })

}

export default matchRouter