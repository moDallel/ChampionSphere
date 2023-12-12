import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces";
import User from "../models/user.model"
import axios from "axios"

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'localhost:5001'

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
    const authUser = await axios.post(`http://${AUTH_SERVICE_URL}/api/auth/register`, {
      username: user.username,
      password: user.password
    })
    if (authUser.status != 201) {
      reply.code(authUser.status).send(authUser.data)
    }
    const newUser = await User.create(user)
    reply.code(201).send({ user: newUser })
  } catch (error) {
    reply.code(400).send({ message: "User already exists" })
    console.log(error)
  }
}

type GetUserRequest = FastifyRequest<{
  Params: {
    username: string
  }
}>

export const getUser = async (request: GetUserRequest, reply: FastifyReply) => {
  try {
    const { username } = request.params
    const user = await User.findOne({ username })
    if (user)
      reply.code(200).send({ message: "User found", user })
    else reply.code(400).send({ message: "User not found" })
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: 'User not found' })
  }
}