import React from 'react';

function TestPage() {
    // Handle button click event
    const handleClick = async () => {
        // Define the data object with the values you want to send
        const data = {
            code: "#include <iostream>\nusing namespace std;\nint main() {\n    // Write C++ code here\n    int a;\n    while(cin>>a){\n        cout<<a<<' ';\n    }\n}",
            language: 52, // Example value for language
            user: "",
            subject: "strukturno",
            problem: "Zad1"
        };
    try {
        const response = await fetch('http://localhost:8000/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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
        <button onClick={handleClick}>Click Me</button>
    );
}

export default TestPage;