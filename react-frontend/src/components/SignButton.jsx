import '../css/updates.css'
import '../css/btn.css'
import { Outlet, Link } from "react-router-dom";
import React, { useState } from 'react';
import Cookies from 'js-cookie';

function SignButton(props){

    const [responseData, setResponseData] = useState(null);
    let user = props.user;
    let password = props.password;
    let checked = props.checked;
    const requestData = {
        user: user,
        password: password,
        remember_me: checked
    };
    const handleButtonClick = async () => {
        console.log(requestData);
        if (checked) {
            Cookies.set('user', user);
            const userCookie = Cookies.get('user');
            console.log(userCookie);
        }
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonResponse = await response.json();
            setResponseData(jsonResponse);
        } catch (error) {
            console.error('Error during the fetch operation:', error);
        }
    };

    let value = props.value;
    let link = props.link;
    return(<>
        <Link to={link} className="reg-btn" onClick={handleButtonClick}>{value}</Link>
    </>);
}

export default SignButton;