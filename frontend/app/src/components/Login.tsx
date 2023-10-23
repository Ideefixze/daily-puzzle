import React, { useEffect, useState } from 'react';
import { discordLoginURL, refreshSession } from '../API';

const Login: React.FC = (props) => {
  const [loginUrl, setLoginUrl] = useState<string>('');

  useEffect(() => {
    discordLoginURL.then(url => setLoginUrl(url));
  }, []);

  return (
    <div>
      <a href={loginUrl}>
        <h2>Login using Discord</h2>
      </a>
    </div>
  );
};

export default Login;