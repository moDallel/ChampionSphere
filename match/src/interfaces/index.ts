export interface IMatch {
    id: number
    player_1_id: number
    player_2_id: number
    state: string
    start_date: string
    end_date: string
    rounds: Array<IRound>
}

export interface IRound {
    id: number
    match_id: number
    round_number: number
    creature_p1_id: number
    creature_p2_id: number
    winner: number
}