import fastify from 'fastify'
import router from './routes';
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const port = 5000;
const host = '0.0.0.0'
const MONGO_URL = process.env.MONGO_URL

const startServer = async () => {
  try {
	const server = fastify()

	const errorHandler = (error, address) => {
  		server.log.error(error, address);
	}

	mongoose.connect(MONGO_URL + '/users?authSource=admin&retryWrites=true&w=majority', {})
		.then(() => console.log("Connected to the database"))
		.catch((e) => console.error("Error connecting: ", e))

	server.register(router, { prefix: '/api' })

	await server.listen({ host, port }, errorHandler)
  } catch (e) {
	console.error(e)
	process.exit(1)
  }
}

process.on('unhandledRejection', (e) => {
  console.error(e)
  process.exit(1)
})

startServer()