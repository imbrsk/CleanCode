import Cookies from 'js-cookie';

const createSession = async () => {
    const token = { "token": Cookies.get("token") };
    console.log("hello")
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
    window.location.reload();
  };

  export { createSession }