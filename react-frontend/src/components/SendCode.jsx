import * as React from "react";
import "../css/btn.css";
import { Outlet, Link } from "react-router-dom";

function SendCode(props) {
  let jsonResponse;
  let requestData = {
    "code": props.code
  };
  let value = props.value;
  let msg;
  const handleCheck = async () => {
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
    if(jsonResponse['status'] == "success"){
        props.handleCheckReset(true);
    }
    else{
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
