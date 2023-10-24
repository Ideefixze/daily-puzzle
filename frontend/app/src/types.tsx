export interface AnyObject {
    [key: string]: any;
}

export interface Tokens {
    accessToken: string,
    refreshToken: string,
}

export interface WordGamePuzzle {
    [key: string]: number;
}

export interface WordGameSolutionStatus {
    status: string,
    score: number,
    place: number
}

export interface WordGameSolution {
    id: number,
    solution: string,
    solver: DiscordUser,
    score: number,
    wordGameId: number
}

export interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
}