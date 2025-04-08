import '../css/account.css';
import Cookies from "js-cookie";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Account(props){
    const [userState, setUserState] = useState('');
    const [tasksState, setTasksState] = useState('');
    
    useEffect(() => {
        const session = Cookies.get("session");
        if(session) {
            getAccount();
        }
    }, []);

    const getAccount = async () => {
        try {
            const token = {"session": Cookies.get("session")};
            const response = await fetch('http://localhost:8000/getuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(token),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonResponse = await response.json();
            
            setUserState(jsonResponse['username']);
            setTasksState(jsonResponse['solved']);
            
        } catch (error) {
            console.error('Error during the fetch operation:', error);
        }
    };

    return(
        <div className="account">
            <Link to="/profile" className='account-info'>Profile</Link>
            <div className='account-user'>User: <div className='account-userstyle'>{userState}</div></div>
            <div className='account-tasks'>Activity: <div className='account-tasksstyle'>{tasksState} tasks solved</div></div>
        </div>
    );
}

export default Account;
