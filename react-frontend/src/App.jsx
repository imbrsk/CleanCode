import React, { useState } from 'react';

function RocketPostRequest() {
    const [responseData, setResponseData] = useState(null);

    const handleButtonClick = async () => {
        const requestData = {
            user: "borisgjorgjievskiii@gmail.com",
            password: "eba368dc741e17a59d0a1101f772a0f7"
        };

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
            console.log(jsonResponse);
            setResponseData(jsonResponse);
        } catch (error) {
            console.error('Error during the fetch operation:', error);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Send POST Request</button>

            {responseData && (
                <div>
                    <p>Response Message: {responseData.message}</p>
                </div>
            )}
        </div>
    );
}

export default RocketPostRequest;
