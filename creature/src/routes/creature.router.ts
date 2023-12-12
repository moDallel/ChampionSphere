import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'
import { validateToken } from '../middleware/auth.middleware'

async function creatureRouter(fastify: FastifyInstance) {

  fastify.route({
	method: 'GET',
	url: '/',
	handler: controllers.listCreatures,
	preHandler: validateToken
  })

  fastify.route({
	method: 'GET',
	url: '/name/:creatureName',
	handler: controllers.getCreatureByName,
	preHandler: validateToken
  })

  fastify.route({
	method: 'GET',
	url: '/:creatureId',
	handler: controllers.getCreatureById,
	preHandler: validateToken
  })

  fastify.route({
	method: 'POST',
	url: '/add',
	handler: controllers.addCreature,
	preHandler: validateToken
  })

  /* fastify.route({
	method: 'PUT',
	url: '/update',
	handler: controllers.updateCreature,
	preHandler: validateToken
  }) */
}

export default creatureRouter