import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import axios from "axios"

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'localhost:5001'

export const validateToken = async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    try {
        const authHeader = request.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]
        if (token) {
            const validation = await axios.post(`http://${AUTH_SERVICE_URL}/api/auth/validate`, { token })
            if (validation.status == 200) {
                done()
            } else reply.code(validation.status).send(validation.data)
        }
        else reply.code(400).send({ message: "Unauthorized access with no token" })
    } catch (error) {
        reply.code(400).send({ message: "Invalid or non-existant token." })
    }
}