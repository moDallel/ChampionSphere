import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function authRouter(fastify: FastifyInstance) {

  fastify.route({
	method: 'POST',
	url: '/register',
	handler: controllers.addUser
  })

  fastify.route({
	method: 'POST',
	url: '/login',
	handler: controllers.login,
  })

  fastify.route({
	method: 'POST',
	url: '/validate',
	handler: controllers.validateToken
  })

}

export default authRouter