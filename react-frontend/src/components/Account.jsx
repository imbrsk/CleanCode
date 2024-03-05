import '../css/account.css'
import Cookies from "js-cookie";
import React, { useState } from 'react';


function Account(props){


    const [userState, setUserState] = useState('');
    const [tasksState, setTasksState] = useState('');
    
    const token = {"session": Cookies.get("session")};

    const getAccount = async () => {
        try {
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
    }
    getAccount();
    return(<>
    <div className="account">
        <div className="account-info">Account</div>
        <div className='account-user'>User: <div className='account-userstyle'>{userState}</div></div>
        <div className='account-tasks'>Activity: <div className='account-tasksstyle'>{tasksState} tasks solved</div></div>

    </div>
    </>);
}

export default Account;