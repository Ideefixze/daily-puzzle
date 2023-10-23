import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { getCurrentWordGamePuzzle, submitSolution, getUserProfile, submitSolutionAnonymous, getCurrentWordGameSolutions, getUser} from '../../API';
import { DiscordUser, WordGamePuzzle, WordGameSolution } from '../../types';
import { parseWordGameToText, countCharacters, isGameCorrect, solutionGameDiff, solutionGameDiffString} from '../utils/UtilFunctions';
import { UserData } from '../Router';
import { useNavigate } from 'react-router-dom';

const WordGame: React.FC = () => {
    const [recentStatus, setRecentStatus] = useState('');
    const [solutionInput, setSolutionInput] = useState('');
    const [puzzle, setPuzzle] = useState<WordGamePuzzle>({});
    const navigate = useNavigate();

  useEffect(() => {
    getCurrentWordGamePuzzle().then((resp) => {
        setPuzzle(resp);
    })
  }, []);

  const handleSolutionChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newSolutionText = e.target.value;
    const newSolution = countCharacters(newSolutionText);
    if(isGameCorrect(newSolution, puzzle))
    {
        setSolutionInput(newSolutionText);
    }
  }

  const handleSolutionSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    submitSolution(solutionInput, localStorage.getItem('token') || "anon").then((resp)=>{
        setSolutionInput('');
        setRecentStatus(resp.status);
        if(resp.status==="OK")
        {
          setTimeout(()=>{navigate('/solutions')}, 500);
        }
    })
  }


  return (
    <div>
      <p className='m-5'>
        {solutionGameDiffString(solutionInput, puzzle) || "😎"}
      </p>
      <input
        type="text"
        value={solutionInput}
        onChange={handleSolutionChange}
      />
      <button onClick={handleSolutionSubmit}>
        Submit
      </button>
      <div>
        {recentStatus}
      </div>
    </div>
  );
};

export default WordGame;