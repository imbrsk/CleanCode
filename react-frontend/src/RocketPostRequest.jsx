import React, { useState } from 'react';

function RocketPostRequest() {
    const [responseData, setResponseData] = useState(null);

    const handleButtonClick = async () => {
        const requestData = {
            field1: 'YourStringData',
            field2: 42, // Your integer data
        };

        try {
            const response = await fetch('http://localhost:8000/process_json', {
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
