import { Link } from "react-router-dom";


const BotBar: React.FC = () => {
    return(
        <div className="App-botbar">
            © 2023 Beatrice's Daily Puzzle by Dominik Zimny | <a href="https://github.com/Ideefixze/daily-puzzle"><img width={24} src="github-mark-white.png"></img></a>
        </div>
    );
};

export default BotBar;