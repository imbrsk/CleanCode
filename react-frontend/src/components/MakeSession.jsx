import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

const MakeSession = () => {
  const token = { "token": Cookies.get("token") };

  const createSession = async () => {
    try {
      const response = await fetch("http://localhost:8000/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      Cookies.set("session", jsonResponse["session"]);
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };

  useEffect(() => {
    createSession(); // This will execute when the component mounts
  }, []); // Empty dependency array to ensure it only runs once
  
  return null;
};

export default MakeSession;
