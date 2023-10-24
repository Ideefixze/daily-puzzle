import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { startSession } from '../API';

interface SessionStarterProps {
  handleLogin: () => void,
}

const SessionStarter: React.FC<SessionStarterProps> = (props) => {

    const [loginStatus, setLoginStatus] = useState<string>("Logging...");
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    
    useEffect(()=> {
        const codeParam = params.get('code') || '';

        startSession(codeParam).then((resp)=>{
            localStorage.setItem('token', resp.accessToken);
            localStorage.setItem('refreshToken', resp.refreshToken);
            props.handleLogin();
            setTimeout(()=> {
                navigate('/main')
            }, 500)
        }).catch(()=>{
            setLoginStatus("Failed :(")
        })
    }, [])

    return (
        <div>
            <h2>Hello!</h2>
            <p>{loginStatus}</p>
        </div>
    );
};

export default SessionStarter;
