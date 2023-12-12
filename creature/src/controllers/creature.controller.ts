import { FastifyReply, FastifyRequest } from "fastify"
import { ICreature } from "interfaces"
import Creature from "../models/creature.model"


export const listCreatures = async (
 request: FastifyRequest, 
 reply: FastifyReply) => {
    try {
        const creatures = await Creature.find({});
        reply.code(200).send({creatures})
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
            const creature = await Creature.findOne({name: creatureName});
            reply.code(200).send({ creature, message: 'Creature found' })
          } catch (error) {
            console.error(error)
            reply.code(400).send({ message: 'Not creature found with that name.' })
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
            const creature = await Creature.findById(creatureId);
            reply.code(200).send({ creature, message: 'Creature found' })
          } catch (error) {
            console.error(error)
            reply.code(400).send({ message: 'Not creature found with that name.' })
          }
   }

   type AddCreatureRequest = FastifyRequest<{
    Body: ICreature
  }>
  
  
  export const addCreature = async (request: AddCreatureRequest, reply: FastifyReply) => {
    try {
      const creature = request.body
      const newCreature = await Creature.create(creature)
      reply.code(201).send({ creature: newCreature, message: "Creature created successfully." })
    } catch (error) {
      reply.code(400).send({ message: "Invalid inputs" })
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

