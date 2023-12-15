import mongoose from "mongoose"

const Schema = mongoose.Schema

const roundSchema = new Schema({
    matchId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'match'
    },
    roundNumber: {
        type: Number,
        required: true,
    },
    creature1Id: {
        type: String,
        required: false,
    },
    creature2Id: {
        type: String,
        required: false,
    },
    winner: {
        type: Number,
        default: 0
    },
})

const Round = mongoose.model('round', roundSchema)

export default Round