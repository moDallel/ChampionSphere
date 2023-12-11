import { FastifyReply, FastifyRequest } from "fastify"
import { User } from "interfaces"

const staticUsers: User[] = [
  {
	id: 1,
	firstname: 'Joyce',
    lastname: 'Byers',
    username: 'joyce_byers',
    email: 'joycebyers@gmail.com',
    credits: 0,
    isAdmin: false
  }
]

export const listUsers = async (
 request: FastifyRequest, 
 reply: FastifyReply) => {

  Promise.resolve(staticUsers)
  .then((users) => {
	reply.send({ data: users })
  })
}