import mongoose from "mongoose"

const Schema = mongoose.Schema

const matchSchema = new Schema({
    player_1_id: {
        type: Number,
        required: true,
    },
    player_2_id: {
        type: Number,
    },
    state: {
        type: String,
        required: true,
    },
    start_date: {
        type: String,
        required: true,
    },
    end_date: {
        type: String,
    },
    rounds:{
        type: Array<round>,
        required: true,
    }
})

const roundSchema = new Schema({
    match_id: {
        type: Number,
        required: true,
    },
    round_number: {
        type: Number,
        required: true,
    },
    creature_p1_id: {
        type: Number,
        required: true,
    },
    creature_p2_id: {
        type: Number,
        required: true,
    },
    winner: {
        type: Number,
        required: true,
    },
})

const match = mongoose.model('match', matchSchema)
const round = mongoose.model('round', roundSchema)

export default match; round;