import * as React from "react";
import "../css/btn.css";
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";

function SendReset(props) {
  let jsonResponse;
  let requestData = {
    email: props.email,
    password: props.password2,
  };
  let value = props.value;
  let msg;
  const handlePass = () => {
    if (props.password1 != props.password2) {
      let msg = "Your password doesn't match.";
      props.handleMessage(msg);
    } else {
      handleCheck();
    }
  };
  const handleCheck = async () => {
    try {
      const response = await fetch("http://localhost:8000/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      jsonResponse = await response.json();
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
    if (jsonResponse["status"] == "success") {
      Cookies.remove("reset");
      Cookies.remove("email");
      window.location.href = "/sign-in";
    }
  };

  return (
    <>
      <Link className="reg-btn" onClick={handlePass}>
        {value}
      </Link>
    </>
  );
}

export default SendReset;
