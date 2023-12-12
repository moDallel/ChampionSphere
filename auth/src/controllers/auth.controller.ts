import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces";
import User from "../models/user.model"
import bcrypt from "bcrypt"

type AddUserRequest = FastifyRequest<{
  Body: IUser
}>

export const addUser = async (request: AddUserRequest, reply: FastifyReply) => {
  try {
    const { username, password } = request.body
    const newUser = await User.create({
      username,
      password: await bcrypt.hash(password, 10)
    })
    reply.code(201).send({ user: newUser })
  } catch (error) {
    reply.code(400).send({ error: "User already exists" })
    console.log(error)
  }
}

export const login = async (request: AddUserRequest, reply: FastifyReply) => {
  try {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password)
      if (validPassword)
        reply.code(200).send({ message: "Valid username and password" })
      else reply.code(400).send({ message: "Wrong password" })
    }
    else reply.code(400).send({ message: "Username does not exist" })
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: error })
  }
}