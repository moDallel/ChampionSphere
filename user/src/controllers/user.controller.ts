import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces";
import User from "../models/user.model"
import axios from "axios"

export const listUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await User.find({});
    reply.code(200).send(users)
  } catch (error) {
    console.error(error)
  }
}

type AddUserRequest = FastifyRequest<{
  Body: IUser & { password: string }
}>


export const addUser = async (request: AddUserRequest, reply: FastifyReply) => {
  try {
    const user = request.body
    const authUser = await axios.post("http://localhost:5001/api/auth/register", {
      username: user.username,
      password: user.password
    })
    if (authUser.status != 201) {
      reply.code(authUser.status).send(authUser.data)
    }
    const newUser = await User.create(user)
    reply.code(201).send({ user: newUser })
  } catch (error) {
    reply.code(400).send({ error: "User already exists" })
    console.log(error)
  }
}