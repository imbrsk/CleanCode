import NavbarSign from "../components/NavbarSign";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Inputfield from "../components/inputfield";
import "../css/register.css";
import { Checkbox } from "@mui/material";
import DarkButton from "../components/Darkbutton";
import google from "../assets/google.svg"

function Register() {
  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <NavbarSign value="Sign In" link="/sign-in"></NavbarSign>
        <div className="sign_in-container">
          <div className="sing_in-form">
            <div>
              <Inputfield placeholder="Username" type="text"></Inputfield>
            </div>
            <div>
              <Inputfield placeholder="Email address" type="text"></Inputfield>
            </div>
            <div>
              <Inputfield placeholder="Password" type="password"></Inputfield>
            </div>
            <div>
              <Inputfield
                placeholder="Confirm Password"
                type="password"
              ></Inputfield>
            </div>
            <DarkButton value="REGISTER" link="/sign-in"></DarkButton>
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

export default Register;
