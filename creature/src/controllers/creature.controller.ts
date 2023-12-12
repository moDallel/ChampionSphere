import { FastifyReply, FastifyRequest } from "fastify"
import { ICreature } from "interfaces"
import Creature from "../models/creature.model"


export const listCreatures = async (
 request: FastifyRequest, 
 reply: FastifyReply) => {
    try {
        const users = await Creature.find({});
        reply.code(200).send(users)
      } catch (error) {
        console.error(error)
      }
}

type GetCreatureByNameRequest = FastifyRequest<{
    Params: { creatureName: string }
  }>

export const getCreatureByName = async (
    request: GetCreatureByNameRequest, 
    reply: FastifyReply) => {
        const { creatureName } = request.params;
        try {
            const creature = await Creature.findOne({name: +creatureName});
            reply.code(200).send(creature)
          } catch (error) {
            console.error(error)
          }
   }

   type GetCreatureByIdRequest = FastifyRequest<{
    Params: { creatureId: string }
  }>

export const getCreatureById = async (
    request: GetCreatureByIdRequest, 
    reply: FastifyReply) => {
        const { creatureId } = request.params;
        try {
            const creature = await Creature.findOne({id: +creatureId});
            reply.code(200).send(creature)
          } catch (error) {
            console.error(error)
          }
   }

   type AddCreatureRequest = FastifyRequest<{
    Body: ICreature
  }>
  
  
  export const addCreature = async (request: AddCreatureRequest, reply: FastifyReply) => {
    try {
      const creature = request.body
      const newCreature = await Creature.create(creature)
      reply.code(201).send({ creature: newCreature })
    } catch (error) {
      reply.code(400).send({ error: "Invalid inputs" })
      console.log(error)
    }
  }

  export const updateCreature = async (request: AddCreatureRequest, reply: FastifyReply) => {
    try {
      const creature = request.body
      const creatureId = creature["id"]
      const newCreature = await Creature.create(creature)
      reply.code(201).send({ creature: newCreature })
    } catch (error) {
      reply.code(400).send({ error: "Invalid inputs" })
      console.log(error)
    }
  }

