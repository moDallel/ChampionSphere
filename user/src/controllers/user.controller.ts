import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces";
import User from "../models/user.model"
import axios from "axios"
import jwt from "jsonwebtoken"

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'localhost:5001'
const CREATURE_SERVICE_URL = process.env.CREATURE_SERVICE_URL || 'localhost:5002'

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

export const getCreatures = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization
    const username = getUsernameFromRequestHeaders(request)
    const user = await User.findOne({ username })
    const creatures = await Promise.all(user.creatures.map(async (creatureName: string) => {
      const creatureRequest = await axios.get(`http://${CREATURE_SERVICE_URL}/api/creature/name/${creatureName}`, {
        headers: {
          Authorization: authHeader
        }
      })
      return creatureRequest.data.creature
    }))
    reply.code(200).send({ creatures })
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: "There was an error while fetching user creatures" })
  }
}

type BuyCreatureRequest = FastifyRequest<{
  Params: {
    creatureName: string
  }
}>

export const buyCreature = async (request: BuyCreatureRequest, reply: FastifyReply) => {
  try {
    const { creatureName } = request.params
    const authHeader = request.headers.authorization
    const creatureRequest = await axios.get(`http://${CREATURE_SERVICE_URL}/api/creature/name/${creatureName}`, {
      headers: {
        Authorization: authHeader
      }
    })
    if (creatureRequest.status != 200) {
      reply.code(400).send(creatureRequest.data)
      return
    }
    const creature = creatureRequest.data.creature
    const username = getUsernameFromRequestHeaders(request)
    const user = await User.findOne({ username })
    const creatures = user.creatures
    if (creatures.includes(creature.name))
      reply.code(400).send({ message: "User already has creature" })
    else if (user.credits < creature.price)
      reply.code(400).send({ message: "Not enough credit to buy creature" })
    else {
      creatures.push(creature.name)
      await User.findOneAndUpdate({ username }, {
        creatures,
        credits: user.credits - creature.price
      })
      reply.code(200).send({ message: "Creature bought successfully", creature })
    }
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: "Error while trying to buy creature" })
  }
}

type AddCreditRequest = FastifyRequest<{
  Body: {
    credit: number,
    username: string
  }
}>
export const addCredit = async (request: AddCreditRequest, reply: FastifyReply) => {
  try {
    const { credit, username } = request.body
    const user = await User.findOne({ username })
    const newUser = await User.findOneAndUpdate({ username }, { credits: user.credits + credit })
    reply.code(200).send({ message: 'Added credits successfully', user: newUser })
  } catch (error) {
    console.error(error)
    reply.send(400).send({ message: 'Error while adding credit to user' })
  }
}

const getUsernameFromRequestHeaders = (request: FastifyRequest) => {
  const authHeader = request.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  return jwt.decode(token).username
}
