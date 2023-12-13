import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces";
import User from "../models/user.model"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const jwt_secret = process.env.jwt_secret || "auth_secret"

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
      if (validPassword) {
        const token = generateToken(username, user._id.toString());
        reply.code(200).send({ message: "User successfully logged in", token });
      }
      else reply.code(400).send({ message: "Wrong password" })
    }
    else reply.code(400).send({ message: "Username does not exist" })
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: error })
  }
}

type ValidateTokenRequest = FastifyRequest<{
  Body: { token: string }
}>

export const validateToken = async (request: ValidateTokenRequest, reply: FastifyReply) => {
  try {
    const { token } = request.body
    const decoded = jwt.verify(token, jwt_secret)
    reply.code(200).send({ message: "Valid token", decoded })
  } catch (error) {
    console.log(error)
    reply.code(400).send({ message: "Invalid token" })
  }
}

const generateToken = (username: string, _id: string) => {
  const payload = {
    _id,
    username
  }

  return jwt.sign(payload, jwt_secret, {
    expiresIn: '24h'
  })
}