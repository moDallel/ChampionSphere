import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function matchRouter(fastify: FastifyInstance) {

    fastify.route({
      method: 'GET',
      url: '/list',
      handler: controllers.listMatchs,
    })
}

export default matchRouter