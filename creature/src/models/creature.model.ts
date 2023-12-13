import mongoose from "mongoose"

const Schema = mongoose.Schema

const creatureSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: false,
        // unique: true
    },
    price: {
        type: Number,
        required: true,
        default: 500
    },
    attack_power: {
        type: Number,
        required: true,
        default: 20
    },
    defense_power: {
        type: Number,
        required: true,
        default: 200
    },
    attack_delay: {
        type: Number,
        required: true,
        default: 5
    }
})

const Creature = mongoose.model('creature', creatureSchema)

export default Creature