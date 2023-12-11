import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces";
import User from "../models/user.model"

export const listUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await User.find({});
    reply.code(200).send(users)
  } catch (error) {
    console.error(error)
  }
}

type AddUserRequest = FastifyRequest<{
  Body: IUser
}>


export const addUser = async (request: AddUserRequest, reply: FastifyReply) => {
  try {
    const user = request.body
    const newUser = await User.create(user)
    reply.code(201).send({ user: newUser })
  } catch (error) {
    reply.code(400).send({ error: "User already exists" })
    console.log(error)
  }
}