import NavbarSign from "../components/NavbarSign";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Inputfield from "../components/inputfield";
import "../css/signin.css";
import { Checkbox } from "@mui/material";
import SignButton from "../components/SignButton";
import google from "../assets/google.svg"

function ForgotPassword() {
  const [email, setEmail] = React.useState(""); // State for email input
  const [password, setPassword] = React.useState(""); // State for password input

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
            
            <div>
              <SignButton value="RESET" link="/"
                          user={email} // Pass email state as prop
              ></SignButton>
            </div>
          </div>
        </div>
      </React.Fragment>
    </>
  );
}

export default ForgotPassword;
