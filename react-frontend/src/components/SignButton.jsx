import '../css/updates.css'
import '../css/btn.css'
import { Outlet, Link } from "react-router-dom";
import React, { useState } from 'react';
import Cookies from 'js-cookie';

function SignButton(props){

    const [responseData, setResponseData] = useState(null);
    let jsonResponse;
    let user = props.user;
    let password = props.password;
    let checked = props.checked;
    const requestData = {
        email: user,
        password: password,
        remember_me: checked
    };
    const handleButtonClick = async () => {
        console.log(requestData);

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
            jsonResponse = await response.json();
        } catch (error) {
            console.error('Error during the fetch operation:', error);
        }

        if (jsonResponse["status"] === "success"){
            Cookies.set("session", jsonResponse["cookie"]["session"]);
            if (jsonResponse["cookie"]["token"] !== "none") {
                // Set a permanent cookie
                Cookies.set("token", jsonResponse["cookie"]["token"], { expires: 365 }); // Expires in 365 days
            }
            window.location.href = props.link;

        }
        else{
            let check = jsonResponse["message"];
            props.passcheck(check);
        }
    
    };
    
    let value = props.value;
    return(<>
        <Link to={''} className="reg-btn" onClick={handleButtonClick}>{value}</Link>
    </>);
}

export default SignButton;