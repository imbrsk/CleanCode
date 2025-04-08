import NavbarSign from "../components/NavbarSign";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Inputfield from "../components/Inputfield";
import "../css/signin.css";
import { Checkbox } from "@mui/material";
import SignButton from "../components/SignButton";
import google from "../assets/google.svg";
import { md5 } from "js-md5";
import FgpassButton from "../components/FgpassButton";
import SendCode from "../components/SendCode";
import SendReset from "../components/SendReset";
import Cookies from "js-cookie";

function ForgotPassword() {
  const [email, setEmail] = React.useState(""); // State for email input
  const [password1, setPassword1] = React.useState(""); // State for email input
  const [password2, setPassword2] = React.useState(""); // State for email input
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [randomCode, setRandomCode] = React.useState("");
  const [randomHash, setRandomHash] = React.useState("");
  const reset = Cookies.get("reset");

  const handleRandomCode = (variable) => {
    setRandomCode(variable);
  };

  const handleRandomHash = (variable) => {
    setRandomHash(variable);
  };
  const handleMessage = (variable) => {
    setMessage(variable);
  };

  const getMail = Cookies.get("email");
  console.log(randomHash);
  if (reset == null) {
    return (
      <>
        <React.Fragment>
          <CssBaseline />
          <NavbarSign value="Sign In" link="/sign-in"></NavbarSign>
          <div className="sign_in-container">
            <div className="sing_in-form">
              <div>
                <Inputfield
                  placeholder="Enter your email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Update email state
                ></Inputfield>
              </div>
              <FgpassButton
                value="Reset"
                email={email}
                handleMessage={handleMessage}
                handleRandomCode={handleRandomCode}
              ></FgpassButton>
              {message}
            </div>
          </div>
        </React.Fragment>
      </>
    );
  } else if (reset == randomCode) {
    return (
      <>
        <CssBaseline />
        <NavbarSign value="Sign In" link="/sign-in"></NavbarSign>
        <div className="sign_in-container">
          <div className="sing_in-form">
            <div><Inputfield
              placeholder="Enter the verification code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)} // Update email state
            ></Inputfield></div>
            <div><SendCode
              value="Send"
              code={code}
              email={getMail}
              handleMessage={handleMessage}
              handleRandomHash={handleRandomHash}
            ></SendCode></div>
            <div>{message}</div>
          </div>
        </div>
      </>
    );
  } else if (reset == randomHash) {
    return (
      <>
        <CssBaseline></CssBaseline>
        <NavbarSign value="Sign In" link="/sign-in"></NavbarSign>
        <div className="sign_in-container">
          <div className="reset-pass">
            <Inputfield
              placeholder="Enter your password"
              type="password"
              onChange={(e) => setPassword1(e.target.value)} // Update email state
            ></Inputfield>
            <Inputfield
              placeholder="Enter your password again"
              type="password"
              onChange={(e) => setPassword2(e.target.value)} // Update email state
            ></Inputfield>
            <SendReset
              email={getMail}
              password1={password1}
              password2={password2}
              handleMessage={handleMessage}
              value="Reset Password"
            ></SendReset>
            {message}
          </div>
        </div>
      </>
    );
  }
}

export default ForgotPassword;
