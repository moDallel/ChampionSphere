import { FastifyReply, FastifyRequest } from "fastify"
import { IMatch, IRound } from "interfaces"
import Match from "../models/match.model"
import Round from "../models/match.model"


export const listMatchs = async (
 request: FastifyRequest, 
 reply: FastifyReply) => {
    try {
        const matches = await Match.find({});
        reply.code(200).send(matches)
      } catch (error) {
        console.error(error)
      }
}

