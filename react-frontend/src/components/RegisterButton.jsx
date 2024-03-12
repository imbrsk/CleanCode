import "../css/updates.css";
import "../css/btn.css";
import { Outlet, Link } from "react-router-dom";
import React, { useState } from "react";
import Cookies from "js-cookie";

function RegisterButton(props) {
  let user = props.user;
  let password = props.password;
  let email = props.email;
  let password2 = props.password2;
  let value = props.value;
  let link = props.link;
  let check;
  let jsonResponse;

  const requestData = {
    username: user,
    email: email,
    password: password,
  };

  const requestEmail = {
    email: email,
    status: "email",
  };
  const requestCode = {
    email: email,
    status: "verify",
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
    if (flag && props.code == "") {
      verifyEmail();
    }
    if(props.code != "")
      sendCode();
  };
  const verifyEmail = async () => {
    try {
      const response = await fetch("http://localhost:8000/verify_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestEmail),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      jsonResponse = await response.json();
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
    if (jsonResponse["status"] == "success") {
      props.handleRegister("passed");
    } else {
      check = jsonResponse["message"];
      props.passcheck(check);
    }
  };
  const sendCode = async () => {
    try {
      const response = await fetch("http://localhost:8000/verify_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestCode),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      jsonResponse = await response.json();
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
    if (jsonResponse["status"] == "success") {
      handleButtonClick();
    } else {
      check = jsonResponse["message"];
      props.passcheck(check);
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

      jsonResponse = await response.json();
      console.log(jsonResponse);
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
    if (jsonResponse["status"] === "success") {
      window.location.href = link;
    } else {
      check = jsonResponse["message"];
      props.passcheck(check);
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
