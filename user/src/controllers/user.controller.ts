import { FastifyReply, FastifyRequest } from "fastify"
import { IUser } from "interfaces";
import User from "../models/user.model"
import axios from "axios"
import jwt from "jsonwebtoken"

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'localhost:5001'
const CREATURE_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'localhost:5002'

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
    const token = authHeader && authHeader.split(' ')[1]
    const username = jwt.decode(token).username
    const user = await User.findOne({ username })
    const creatures = await Promise.all(user.creatures.map(async (creatureId: string) => {
      const creatureRequest = await axios.get(`http://${CREATURE_SERVICE_URL}/api/creature/${creatureId}`, {
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
    creatureId: string
  }
}>

export const buyCreature = async (request: BuyCreatureRequest, reply: FastifyReply) => {
  try {
    const { creatureId } = request.params
    const authHeader = request.headers.authorization
    const creatureRequest = await axios.get(`http://${CREATURE_SERVICE_URL}/api/creature/${creatureId}`, {
      headers: {
        Authorization: authHeader
      }
    })
    if (creatureRequest.status != 200) {
      reply.code(400).send(creatureRequest.data)
      return
    }
    const creature = creatureRequest.data.creature
    const token = authHeader && authHeader.split(' ')[1]
    const username = jwt.decode(token).username
    const user = await User.findOne({ username })
    const creatures = user.creatures
    if (creatures.includes(creature._id))
      reply.code(400).send({ message: "User already has creature" })
    else if (user.credits < creature.price)
      reply.code(400).send({ message: "Not enough credit to buy creature" })
    else {
      creatures.push(creature._id.toString())
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