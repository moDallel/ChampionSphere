import { FastifyInstance } from 'fastify'
import * as controllers from '../controllers'

async function creatureRouter(fastify: FastifyInstance) {

  fastify.route({
	method: 'GET',
	url: '/',
	handler: controllers.listCreatures,
  })

  fastify.route({
	method: 'GET',
	url: '/name/:creatureName',
	handler: controllers.getCreatureByName,
  })

  fastify.route({
	method: 'GET',
	url: '/name/:creatureId',
	handler: controllers.getCreatureById,
  })

  fastify.route({
	method: 'POST',
	url: '/add',
	handler: controllers.addCreature,
  })

  fastify.route({
	method: 'PUT',
	url: '/update',
	handler: controllers.updateCreature,
  })
}

export default creatureRouter