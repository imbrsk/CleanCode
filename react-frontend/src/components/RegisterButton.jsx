import "../css/updates.css";
import "../css/btn.css";
import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
import Cookies from "js-cookie";

function RegisterButton(props) {
  const [responseData, setResponseData] = useState(null);
  let user = props.user;
  let password = props.password;
  let email = props.email;
  let password2 = props.password2;
  let value = props.value;
  let link = props.link;
  let check;

  const requestData = {
    username: user,
    email: email,
    password: password,
  };

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const checkInfo = () => {
    console.log(requestData);
    let flag = true;
    if (user == "") {
      flag = false;
      check = "Enter a username.";
      props.passcheck(check);
    } else if (!isValidEmail(props.email)) {
      check = "Please enter a valid email address.";
      props.passcheck(check);
      flag = false;
    } else if (password == "" || password2 == "") {
      flag = false;
      check = "Enter a password.";
      props.passcheck(check);
    } else if (password.length < 8) {
      flag = false;
      check = "Your password should be longer than 8 characters.";
      props.passcheck(check);
    } else if (password != "" && password2 != "") {
      if (password !== password2) {
        flag = false;
        check = "Your password doesn't match.";
        props.passcheck(check);
      }
    }
    if (flag) {
      handleButtonClick();
    }
  };

  const handleButtonClick = async () => {
    console.log(requestData);
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonResponse = await response.json();
      setResponseData(jsonResponse);
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
    if (responseData["status"] === "error") {
      check = responseData["message"];
      props.passcheck(check);
    } else {
      window.location.href = link;
    }
  };

  return (
    <>
      <Link className="reg-btn" onClick={checkInfo}>
        {value}
      </Link>
    </>
  );
}

export default RegisterButton;
