import NavbarSign from "../components/NavbarSign";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Inputfield from "../components/inputfield";
import "../css/signin.css";
import { Checkbox } from "@mui/material";
import SignButton from "../components/SignButton";
import google from "../assets/google.svg";
import { md5 } from "js-md5";
import FgpassButton from "../components/FgpassButton";
import SendCode from "../components/SendCode";
import SendReset from "../components/SendReset";

function ForgotPassword() {
  const [email, setEmail] = React.useState(""); // State for email input
  const [password1, setPassword1] = React.useState(""); // State for email input
  const [password2, setPassword2] = React.useState(""); // State for email input
  const [clicked, setClicked] = React.useState(false); // State for password input
  const [message, setMessage] = React.useState("");
  const [code, setCode] = React.useState("");
  const [checkReset, setCheckReset] = React.useState(false);

  const handleClicked = (variable) => {
    setClicked(variable); // Update state with the variable from child
  };
  const handleMessage = (variable) => {
    setMessage(variable);
  };
  const handleCheckReset = (variable) => {
    setCheckReset(variable);
  }

  if (clicked != true) {
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
                handleClicked={handleClicked}
                handleMessage={handleMessage}
              ></FgpassButton>
              {message}
            </div>
          </div>
        </React.Fragment>
      </>
    );
  } else if(checkReset != true){
    return (
      <>
        <div>
          <Inputfield
            placeholder="Enter the verification code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)} // Update email state
          ></Inputfield>
        </div>
        <div>
          <SendCode
            value="Send" 
            code={code}
            handleMessage={handleMessage}
            handleCheckReset={handleCheckReset}
          ></SendCode>
        </div>
        {message}
      </>
    );
  }
  else{
    return(
      <>
      <div>
        <Inputfield
          placeholder="Enter your password"
          type="text"
          onChange={(e) => setPassword2(e.target.value)} // Update email state
        ></Inputfield>
        <Inputfield
          placeholder="Enter your password again"
          type="text"
          onChange={(e) => setPassword2(e.target.value)} // Update email state
        ></Inputfield>
        <SendReset
          email={email}
          password1={password1}
          password2={password2}
          handleMessage={handleMessage}
        >
        </SendReset>
      </div>
      {message}
      </>
    )
  }
}

export default ForgotPassword;
