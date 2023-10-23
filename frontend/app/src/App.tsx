import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, BrowserRouter as Router} from 'react-router-dom';
import { AppSwitch } from './components/Router';
import Navbar from './Navbar';
import BotBar from './Footbar';

function App() {
  return (
    <div className="App">
        <Router>
          <Navbar/>
          <div className="App-header">
            <AppSwitch/>
          </div>
          <BotBar/>
        </Router>
    </div>
  );
}

export default App;
