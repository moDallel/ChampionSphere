import fastify from 'fastify'
import userRouter from './routes/user.router'

const port = 5000;

const startServer = async () => {
  try {
	const server = fastify()

	const errorHandler = (error, address) => {
  	server.log.error(error, address);
	}

	server.register(userRouter, { prefix: '/api/user' })

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