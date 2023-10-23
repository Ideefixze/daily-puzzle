import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshSession } from '../API';

interface SessionRefresherProps {
  handleLogin: () => void,
  children: React.ReactNode
}

const SessionRefresher: React.FC<SessionRefresherProps> = (props) => {
    const [shouldLogin, setShouldLogin] = React.useState<boolean>(true)
    const navigate = useNavigate();
    
    useEffect(()=> {
        const codeParam = localStorage.getItem('refreshToken');
        if(codeParam)
        {
            refreshSession(codeParam).then((resp)=>{
                localStorage.setItem('token', resp.accessToken);
                localStorage.setItem('refreshToken', resp.refreshToken);
                props.handleLogin();
                navigate('/main');
            }).catch(()=>{
                setShouldLogin(true);
            })
        }
        else
        {
            setShouldLogin(true);
        }

    }, [])

    return (
        <div>
            {shouldLogin && props.children}
        </div>
    );
};

export default SessionRefresher;
