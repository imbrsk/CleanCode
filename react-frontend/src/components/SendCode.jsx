import * as React from "react";
import "../css/btn.css";
import { Outlet, Link } from "react-router-dom";
import Cookies from 'js-cookie';


function SendCode(props) {
  let jsonResponse;
  let value = props.value;
  let msg;
  const handleCheck = async () => {
    let requestData = {
      "email": props.email,
      "code": props.code
    };
    try {
      const response = await fetch("http://localhost:8000/verify_code", {
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
    console.log(jsonResponse['status'])
    if (jsonResponse['status'] == "success") {
      const fifteenMinutesFromNow = new Date(new Date().getTime() + 5 * 60 * 1000); // 15 minutes in milliseconds
      Cookies.remove("reset");
      Cookies.set('reset', 'reset', { expires: fifteenMinutesFromNow });
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

export default SendCode;
