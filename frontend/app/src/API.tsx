import axios from 'axios';
import { AnyObject, DiscordUser, Tokens, WordGamePuzzle, WordGameSolution, WordGameSolutionStatus } from './types';
const API_URL = process.env.REACT_APP_API_URL;
  
function convertKeysToCamelCase(obj: AnyObject): AnyObject {
    if (obj === null || typeof obj !== 'object') return obj;
  
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      acc[camelKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {} as AnyObject);
}


export const discordLoginURL: Promise<string> = axios.get(`${API_URL}/login`).then(resp => resp.data.url).catch((resp)=>'')

export const startSession: (code: string) => Promise<Tokens> = (code) => axios.get(`${API_URL}/callback?code=${code}`).then(resp => convertKeysToCamelCase(resp.data) as Tokens);

export const refreshSession: (code: string) => Promise<Tokens> = (code) => axios.get(`${API_URL}/refresh_token?code=${code}`).then(resp => convertKeysToCamelCase(resp.data) as Tokens);

export const getCurrentWordGamePuzzle: () => Promise<WordGamePuzzle> = () => axios.get(`${API_URL}/word_game/current`).then(resp => resp.data.word_game)

export const getCurrentWordGameSolutions: () => Promise<[WordGameSolution]> = () => axios.get(`${API_URL}/word_game/solutions`).then(resp => Object.values(convertKeysToCamelCase(resp.data)) as [WordGameSolution]);

export const checkSolution: (puzzleSolution: string) => Promise<WordGameSolutionStatus> = (puzzleSolution) => axios.get(`${API_URL}/word_game/check?solution=${puzzleSolution}`).then(resp => resp.data);

export const submitSolution: (puzzleSolution: string, token: string) => Promise<WordGameSolutionStatus> = (puzzleSolution, token) => axios.post(`${API_URL}/word_game/submit`, {solution: puzzleSolution}, {headers:{Authorization: `Bearer ${token}`}}).then(resp => resp.data);

export const getUserProfile: (token: string) => Promise<string> = (token) => axios.get(`${API_URL}/user`, {headers:{Authorization: `Bearer ${token}`}}).then(resp => resp.data);

export const getUser: (userId: string) => Promise<DiscordUser> = (userId) => {
    if(userId == "anon")
    {
        return Promise.resolve({
            id: "anon",
            username: "Anonymous",
            avatar: "https://c4.wallpaperflare.com/wallpaper/528/829/200/anime-umineko-when-they-cry-beatrice-umineko-no-naku-koro-ni-wallpaper-preview.jpg"
        })
    }
    else
        return axios.get(`${API_URL}/user/${userId}`).then(resp => resp.data as DiscordUser);
}