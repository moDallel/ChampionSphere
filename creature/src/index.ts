import fastify from 'fastify'
import mongoose from 'mongoose';
import router from './routes';
import dotenv from "dotenv"

dotenv.config()

const port = 5002;
const host = '0.0.0.0'
const MONGO_URL = process.env.MONGO_URL

const startServer = async () => {
  try {
	const server = fastify()

	const errorHandler = (error, address) => {
  		server.log.error(error, address);
	}

	mongoose.connect(MONGO_URL + '/creatures?authSource=admin&retryWrites=true&w=majority', {})
		.then(() => console.log("Connected to the database"))
		.catch((e) => console.error("Error connecting: ", e))

	server.register(router, { prefix: '/api' })

	await server.listen({ host, port }, errorHandler)
  } catch (e) {
	console.error(e)
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

startServer()