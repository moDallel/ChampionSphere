import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'
import { validateToken } from '../middleware/auth.middleware'

async function userRouter(fastify: FastifyInstance) {

  fastify.route({
	method: 'GET',
	url: '/',
	handler: controllers.listUsers,
	preHandler: validateToken
  })

  fastify.route({
	method: 'POST',
	url: '/register',
	handler: controllers.addUser
  })

  fastify.route({
	method: 'GET',
	url: '/:username',
	handler: controllers.getUser,
	preHandler: validateToken
  })

  fastify.route({
	method: 'GET',
	url: '/creatures',
	handler: controllers.getCreatures,
	preHandler: validateToken
  })

  fastify.route({
	method: 'POST',
	url: '/creatures/buy/:creatureName',
	handler: controllers.buyCreature,
	preHandler: validateToken
  })

  fastify.route({
	method: 'POST',
	url: '/add/credits',
	handler: controllers.addCredit,
	preHandler: validateToken
  })

}

export default userRouter