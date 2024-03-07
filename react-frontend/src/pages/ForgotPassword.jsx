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

function ForgotPassword() {
  const [email, setEmail] = React.useState(""); // State for email input
  const [clicked, setClicked] = React.useState(false); // State for password input
  const [message, setMessage] = React.useState("");
  const handleClicked = (variable) => {
    setClicked(variable); // Update state with the variable from child
  };
  const handleMessage = (variable) => {
    setMessage(variable);
  };

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
  }
  else{
    return (
      <>
      </>
    )
  }
}

export default ForgotPassword;
