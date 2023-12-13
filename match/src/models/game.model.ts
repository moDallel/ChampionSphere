import { Game, IRound } from "../interfaces";

export const RandomGame: Game = {
    determineWinner: (round: IRound) => {
        const number = Math.floor(Math.random()*2)+1
        if (number == 1) return 1
        return 2
    }
}