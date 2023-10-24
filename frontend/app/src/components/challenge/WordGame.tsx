import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { getCurrentWordGamePuzzle, submitSolution, checkSolution} from '../../API';
import { WordGamePuzzle} from '../../types';
import {  countCharacters, isGameCorrect, ordinalSuffix, solutionGameDiffString} from '../utils/UtilFunctions';
import { useNavigate } from 'react-router-dom';

const WordGame: React.FC = () => {
    const [submitStatus, setSubmitStatus] = useState('');
    const [recentStatus, setRecentStatus] = useState('');
    const [solutionInput, setSolutionInput] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [puzzle, setPuzzle] = useState<WordGamePuzzle>({});
    const [solutionScore, setSolutionScore] = useState(0);
    const [solutionRankingPlace, setSolutionRankingPlace] = useState(-1);
    const navigate = useNavigate();

  useEffect(() => {
    getCurrentWordGamePuzzle().then((resp) => {
        setPuzzle(resp);
        setLoaded(true);
    })
  }, []);

  useEffect(() => {
    
    // Debouce request - check if correct on the server and get score
    const delay = 500;
    if(loaded)
    {
      const timeoutId = setTimeout(() => {
        checkSolution(solutionInput).then((resp) => {
          setSolutionScore(resp.score);
          setRecentStatus(resp.status ? "good.png" : "bad.png")
          setSolutionRankingPlace(resp.place);
        })
      }, delay);

      return () => clearTimeout(timeoutId);
    }

  }, [solutionInput])

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
        setSubmitStatus(resp.status);
        if(resp.status==="OK")
        {
          setTimeout(()=>{navigate('/solutions')}, 500);
        }
    })
  }


  return (
    <div className='App-word-game-window'>
      <small >Create a sentence of words in English using provided letters. Sentence doesn't have to be gramatically correct. Use more letters, create long words to get higher score.</small>
      <p className='App-word-game-letters'>
        {loaded && (solutionGameDiffString(solutionInput, puzzle) || "😎")}
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
        Score: {solutionScore} {solutionRankingPlace >= 0 ? `, you would be ${ordinalSuffix(solutionRankingPlace)}` : ''}
      </div>
      <div>
        <img src={recentStatus} width={100}/>
      </div>
      <div>
        {submitStatus}
      </div>
    </div>
  );
};

export default WordGame;