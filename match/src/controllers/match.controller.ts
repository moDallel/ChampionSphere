import { FastifyReply, FastifyRequest } from "fastify"
import Match from "../models/match.model"
import { RandomGame } from "../models/game.model"
import jwt from "jsonwebtoken"
import axios from "axios"
import Round from "../models/round.model"

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'localhost:5000'

export const listMatchs = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const matches = await Match.find({});
    reply.code(200).send({ matches })
  } catch (error) {
    console.error(error)
  }
}

type CreateMatchRequest = FastifyRequest<{
  Body: {
    game?: string
  }
}>

export const createMatch = async (request: CreateMatchRequest, reply: FastifyReply) => {
  try {
    const username = getUsernameFromRequestHeaders(request)
    // const game = request.body.game || 'default'
    const match = await Match.create({
      player1Username: username
      // game
    })
    reply.code(200).send({ message: "Match created successfully", match })
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: 'Could not create match' })
  }
}

type JoinMatchRequest = FastifyRequest<{
  Params: {
    matchId: string
  }
}>

export const joinMatch = async (request: JoinMatchRequest, reply: FastifyReply) => {
  try {
    const username = getUsernameFromRequestHeaders(request)
    const { matchId } = request.params
    const oldMatch = await Match.findById(matchId)
    if (oldMatch.player1Username == username) {
      reply.code(400).send({ message: 'User has already joined this match thus cannot rejoin it.' })
      return
    }
    if (oldMatch.player2Username != "empty") {
      reply.code(400).send({ message: 'Another user has already joined this match.' })
      return
    }
    const match = await Match.findByIdAndUpdate(matchId, {
      player2Username: username,
      state: 'in_progress'
    })
    reply.code(200).send({ message: 'Joined match successfully.', match })
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: 'Could not join match' })
  }
}

type SendCreatureRequest = FastifyRequest<{
  Params: {
    matchId: string
  },
  Body: {
    creatureName: string
  }
}>

export const sendCreature = async (request: SendCreatureRequest, reply: FastifyReply) => {
  try {
    const { matchId } = request.params
    const { creatureName } = request.body
    const username = getUsernameFromRequestHeaders(request)
    const userCreaturesReq = await axios.get(`http://${USER_SERVICE_URL}/api/user/creatures`, {
      headers: {
        Authorization: request.headers.authorization
      }
    })
    if (userCreaturesReq.status != 200) {
      reply.code(400).send(userCreaturesReq.data)
      return
    }
    const userCreatures = userCreaturesReq.data.creatures
    if (!userCreatures.map(creature => creature.name).includes(creatureName)) {
      console.log(userCreatures)
      reply.code(400).send({ message: "You do not own this creature, please send a creature you do own." })
      return
    }
    const match = await Match.findById(matchId)
    if (username != match.player1Username && username != match.player2Username) {
      reply.code(400).send({ message: 'You are not a participant in this match' })
      return
    }
    if (match.state != 'in_progress') {
      reply.code(400).send({ message: 'You cannot send creature when match is ' + match.state })
      return
    }
    if (match.rounds.length == 0) {
      const newRound = await createAndPlayRound(match, username, creatureName, 1)
      reply.code(200).send({ message: 'Creature sent successfully, round was played', newRound })
    } else {
      const lastRoundId = match.rounds.at(-1)
      const lastRound = await Round.findById(lastRoundId)
      if (hasPlayerAlreadyPlayedRound(username, match.player1Username, match.player2Username, lastRound)) {
        reply.code(400).send({ message: 'You have to wait until the other plays finishes round ' + lastRound.roundNumber })
      }
      else if (lastRound.winner != 0) {
        const newRound = await createAndPlayRound(match, username, creatureName, match.rounds.length + 1)
        reply.code(200).send({ message: 'Creature sent successfully, round was played', newRound })
      } else {
        const newLastRound = await finishRound(match, username, creatureName, lastRound)
        if (match.rounds.length == 5) {
          await finishMatch(match, request)
        }
        await Match.findByIdAndUpdate(matchId, match)
        reply.code(200).send({ message: 'Creature sent successfully, round was played', newLastRound })
      }
    }
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: 'Could not send creature, check error' })
  }
}

const hasPlayerAlreadyPlayedRound = (username: string, player1Username: string, player2Username: string, lastRound): boolean => {
  return (username == player1Username && lastRound.creature2Id == null) || (username == player2Username && lastRound.creature1Id == null)
}

const finishMatch = async (match, request) => {
  let matchWinner = match.player2Username
  if (match.roundsWonByPlayer1 >= 3) {
    match.winner = 1
    matchWinner = match.player1Username
  }
  else
    match.winner = 2
  match.state = 'finished'
  match.end_date = new Date().toISOString()
  await axios.post(`http://${USER_SERVICE_URL}/api/user/add/credits`, {
    credit: 100,
    username: matchWinner
  }, {
    headers: {
      Authorization: request.headers.authorization
    }
  })
}

const finishRound = async (match, username, creatureName, lastRound) => {
  const lastRoundId = lastRound._id
  if (username == match.player1Username)
    lastRound.creature1Id = creatureName
  else lastRound.creature2Id = creatureName
  lastRound.winner = RandomGame.determineWinner(lastRound.toObject())
  if (lastRound.winner == 1) match.roundsWonByPlayer1 += 1
  const newLastRound = await Round.findByIdAndUpdate(lastRoundId, lastRound)
  return newLastRound
}

const createAndPlayRound = async (match, username, creatureName, roundNumber) => {
  const matchId = match._id
  let newRound
  if (username == match.player1Username)
    newRound = await createNewRound({ matchId: match._id, roundNumber: roundNumber, creature1Id: creatureName }) //await Round.create({matchId, roundNumber: 1, creature1Id: creatureName})
  else newRound = await Round.create({ matchId, roundNumber: roundNumber, creature2Id: creatureName })
  match.rounds.push(newRound._id)
  await Match.findByIdAndUpdate(matchId, match)
  return newRound
}

const createNewRound = async (round: { matchId: string, roundNumber: number, creature1Id?: string, creature2Id?: string }) => {
  const newRound = await Round.create({
    matchId: round.matchId,
    roundNumber: round.roundNumber,
    creature1Id: round.creature1Id,
    creature2Id: round.creature2Id
  })
  return newRound
}

type GetRoundsRequest = FastifyRequest<{
  Params: {
    matchId: string
  }
}>
export const getRounds = async (request: GetRoundsRequest, reply: FastifyReply) => {
  try {
    const { matchId } = request.params
    const match = await Match.findById(matchId)
    const rounds = await Promise.all(match.rounds.map(async (roundId) => {
      const round = await Round.findById(roundId)
      return round
    }))
    reply.code(200).send({ rounds, message: 'Retrieved match rounds successfully' })
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: 'Error while retrieving match rounds' })
  }
}

export const getMatch = async (request: GetRoundsRequest, reply: FastifyReply) => {
  try {
    const { matchId } = request.params
    const match = await Match.findById(matchId)
    reply.code(200).send({ match, message: 'Retrieved match' })
  } catch (error) {
    console.error(error)
    reply.code(400).send({ message: 'Error while retrieving match' })
  }
}

const getUsernameFromRequestHeaders = (request: FastifyRequest) => {
  const authHeader = request.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  return jwt.decode(token).username
}