import React, { useEffect, useState } from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import Login  from './Login';
import SessionStarter from './SessionStarter';
import ProtectedRoute from './utils/ProtectedRoute';
import SessionRefresher from './SessionRefresher';
import WordGame from './challenge/WordGame';
import LoginAnonymous from './LoginAnonymous';
import WordGameSolutions from './challenge/WordGameSolutions';

export interface UserData {
  id: string
}

export const AppSwitch = () => {  
    const [userData, setUserData] = React.useState<UserData>({id: ""});
    const [isLogged, setIsLogged] = React.useState<boolean>(false);

    const handleLogin = () => {setIsLogged(true)};
    const handleLogout = () => setIsLogged(false);

    return (
      <div>
      <Routes>
        <Route path='' element={
          <SessionRefresher handleLogin={handleLogin}>
            <Login/>
            <LoginAnonymous setUserData={setUserData} handleLogin={handleLogin}/>
          </SessionRefresher>}
        />
        <Route path='/callback' element={<SessionStarter handleLogin={handleLogin}/>}/>
        <Route
            path="/main"
            Component={ 
              () => (
                <ProtectedRoute isSignedIn={isLogged}>
                  <WordGame/>
                </ProtectedRoute>
              )
            }
          />
          <Route path="/solutions" element={<WordGameSolutions/>}/>
      </Routes>
              
      </div>
    );
  };