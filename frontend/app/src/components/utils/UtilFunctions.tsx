import { WordGamePuzzle } from "../../types";


export function ordinalSuffix(i: number) {
    var j = i % 10,
        k = i % 100;
    const iStr = String(i);
    if (j == 1 && k != 11) {
        return iStr + "st";
    }
    if (j == 2 && k != 12) {
        return iStr + "nd";
    }
    if (j == 3 && k != 13) {
        return iStr + "rd";
    }
    return iStr + "th";
}

export function parseWordGameToText(wordGame: WordGamePuzzle):string {

    return Object.entries(wordGame).sort(([a], [b]) => a.localeCompare(b)).map(([char, count]) => char.repeat(count)).join('');
}

export function countCharacters(input: string): WordGamePuzzle {
    return input
        .replace(/\s/g, '') // Remove white spaces
        .split('')
        .reduce((result:WordGamePuzzle, char) => {
            result[char] = (result[char] || 0) + 1;
            return result;
        }, {});
}

export function isGameCorrect(solution: WordGamePuzzle, game: WordGamePuzzle): boolean {
    return Object.entries(solution).every(([char, count]) => count <= (game[char] || 0));
}

export function solutionGameDiff(solution: WordGamePuzzle, game: WordGamePuzzle): WordGamePuzzle {
    return Object.fromEntries(Object.entries(game).map(([char, count]) => [char, count - (solution[char] || 0)]))
}

export function solutionGameDiffString(solution: string, game: WordGamePuzzle): string {
    return parseWordGameToText(solutionGameDiff(countCharacters(solution), game))
}