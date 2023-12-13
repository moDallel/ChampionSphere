type Winner = 1 | 2;

export interface IMatch {
    id: number
    player1Username: string
    player2Username?: string
    state: 'pending' | 'in_progress' | 'finished'
    start_date: string
    end_date: string
    rounds: Array<string>
    winner?: Winner
    game: Game
}

export interface IRound {
    id?: number
    matchId: number
    roundNumber: number
    creature1Id: string
    creature2Id: string
    winner?: Winner
}

export interface Game {
    determineWinner(round: IRound): Winner
}