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
	url: '/',
	handler: controllers.addUser
  })

  fastify.route({
	method: 'GET',
	url: '/:username',
	handler: controllers.getUser,
	preHandler: validateToken
  })


/*
  fastify.route({
	method: 'POST',
	url: '/',
	handler: controllers.addUser,
  })
*/
}

export default userRouter