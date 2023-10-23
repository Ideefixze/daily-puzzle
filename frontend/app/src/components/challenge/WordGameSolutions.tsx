import React, { useEffect, useState } from 'react';
import { getCurrentWordGamePuzzle, submitSolution, getUserProfile, submitSolutionAnonymous, getCurrentWordGameSolutions, getUser} from '../../API';
import { DiscordUser, WordGamePuzzle, WordGameSolution } from '../../types';
import { parseWordGameToText, countCharacters, isGameCorrect, solutionGameDiff, solutionGameDiffString} from '../utils/UtilFunctions';
import { UserData } from '../Router';

const WordGameSolutions: React.FC = () => {
    const [solutions, setSolutions] = useState<[WordGameSolution]>();

  useEffect(() => {
    getCurrentWordGameSolutions().then((resp) => {
      setSolutions(resp);
  })
  }, []);

  return (
    <div>
    <p>Ranking for the yesterday's puzzle:</p>
    <table className="table table-bordered table-dark">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Solution</th>
          <th scope="col">Score</th>
          <th scope="col">Username</th>
        </tr>
      </thead>
      <tbody>
        {
        solutions &&
        solutions?.sort((sola, solb) => solb.score - sola.score).map((item, id)=> 
          <tr>
            <th scope='row'>{id+1}</th>
            <td>{item.solution}</td> 
            <td>{item.score}</td>
            <td><img src={item.solver.avatar || ""} className='discord-avatar'/>{item.solver.username}</td>
          </tr>)
        }
      </tbody>
    </table>
    </div>
  );
};

export default WordGameSolutions;