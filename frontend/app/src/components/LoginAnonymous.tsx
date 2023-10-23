import React, { MouseEventHandler, useEffect, useState } from 'react';
import { discordLoginURL, refreshSession } from '../API';
import { UserData } from './Router'
import { Link } from 'react-router-dom';

interface LoginAnonymousProps {
  setUserData: (arg0: UserData) => void
  handleLogin: () => void
}

const LoginAnonymous: React.FC<LoginAnonymousProps> = (props) => {

  const handleAnonymousLogin: MouseEventHandler<HTMLAnchorElement> = (e) => {
    props.setUserData({id: 'anon'});
    props.handleLogin();
  }

  return (
    <div>
      <Link to={"\main"} onClick={handleAnonymousLogin}>
        <h2>Play as Guest</h2>
      </Link>
    </div>
  );
};

export default LoginAnonymous;