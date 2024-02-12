import NavbarSign from "../components/NavbarSign";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Inputfield from "../components/inputfield";
import "../css/signin.css";
import { Checkbox } from "@mui/material";
import DarkButton from "../components/Darkbutton";
import google from "../assets/google.svg"

function Sign() {
  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <NavbarSign value="Register" link="/register"></NavbarSign>
        <div className="sign_in-container">
          <div className="sing_in-form">
            <div>
              <Inputfield
                placeholder="Enter your email address"
                type="email"
              ></Inputfield>
            </div>
            <div>
              <Inputfield placeholder="Password" type="password"></Inputfield>
            </div>
            <div className="sign-assist">
              <div className="sign-remember">
                <Checkbox defaultChecked />
                <div>Remember me</div>
              </div>
              <div className="sign-forgot">Forgot Password?</div>
            </div>
            <div>
              <DarkButton value="SIGN IN" link="/"></DarkButton>
            </div>
            <div className="sign-connect">
              <div className="horz-line"></div>
              <div>Or connect with</div>
              <div className="horz-line"></div>
            </div>
            <div className="sign-google"><img src={google} alt="" className="google"/></div>
          </div>
        </div>
      </React.Fragment>
    </>
  );
}

export default Sign;
