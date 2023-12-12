import fastify from 'fastify'
import creatureRouter from './routes/creature.router'

const port = 5000;

const startServer = async () => {
  try {
	const server = fastify()

	const errorHandler = (error, address) => {
  	server.log.error(error, address);
	}

	server.register(creatureRouter, { prefix: '/api/match' })

	await server.listen({ port }, errorHandler)
  } catch (e) {
	console.error(e)
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

startServer()