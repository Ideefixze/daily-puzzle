import { Link } from "react-router-dom";


const Navbar: React.FC = () => {

    return(
        <div className="App-navbar">
            <div className='App-navbar-item App-navbar-item-left'>
                Beatrice's Daily Puzzle
            </div>
            <div className='App-navbar-item App-navbar-item-right'>
                <Link to="/">Play</Link>
            </div>
            <div className='App-navbar-item App-navbar-item-right'>
                <Link to="/solutions">Solutions</Link>
            </div>
        </div>
    );

};

export default Navbar;