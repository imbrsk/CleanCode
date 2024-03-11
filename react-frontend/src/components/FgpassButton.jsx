import * as React from "react";
import "../css/btn.css";
import { Outlet, Link } from "react-router-dom";
import Cookies from 'js-cookie';


function FgpassButton(props) {
  let jsonResponse;
  let requestData = {
    "email": props.email
  };
  let value = props.value;
  let msg;
  const handleCheck = async () => {
    try {
      const response = await fetch("http://localhost:8000/check_email", {
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
    if (jsonResponse['status'] == "success") {
      const fifteenMinutesFromNow = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes in milliseconds
      Cookies.set('reset', 'code', { expires: fifteenMinutesFromNow });
      Cookies.set('email', props.email, { expires: fifteenMinutesFromNow });
      window.location.reload();
    }
    else {
      msg = jsonResponse['message'];
      props.handleMessage(msg);
    }
  };

  return (
    <>
      <Link className="reg-btn" onClick={handleCheck}>
        {value}
      </Link>
    </>
  );

}

export default FgpassButton;
