import mongoose from "mongoose"

const Schema = mongoose.Schema

const matchSchema = new Schema({
    player1Username: {
        type: String,
        required: true,
    },
    game: {
        type: String,
        default: 'random'
    },
    player2Username: {
        type: String,
        default: "empty"
    },
    state: {
        type: 'String',
        default: 'pending'
    },
    start_date: {
        type: String,
        default: new Date().toISOString()
    },
    end_date: {
        type: String
    },
    winner: {
        type: Number
    },
    rounds: [
        { type: Schema.Types.ObjectId, ref: 'round' }
    ],
    roundsWonByPlayer1: {
        type: Number,
        default: 0
    }
})

const Match = mongoose.model('match', matchSchema)

export default Match;