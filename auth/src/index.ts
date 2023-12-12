import fastify from 'fastify'
import router from './routes';
import mongoose from "mongoose";

const port = 5001;

const startServer = async () => {
  try {
	const server = fastify()

	const errorHandler = (error, address) => {
  		server.log.error(error, address);
	}

	mongoose.connect('mongodb://root:rootpassword@localhost:27017/auth?authSource=admin', {})
		.then(() => console.log("Connected to the database"))
		.catch((e) => console.error("Error connecting: ", e))

	server.register(router, { prefix: '/api' })

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