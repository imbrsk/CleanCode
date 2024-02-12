import NavbarSign from "../components/NavbarSign";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Inputfield from "../components/inputfield";
import "../css/register.css";
import { Checkbox } from "@mui/material";
import RegisterButton from "../components/RegisterButton";
import google from "../assets/google.svg"

function Register() {
  const [email, setEmail] = React.useState(""); // State for email input
  const [password, setPassword] = React.useState(""); // State for password input
  const [password2, setPassword2] = React.useState(""); // State for password input
  const [user, setUser] = React.useState(""); // State for email input
  const [check, setCheck] = React.useState("");

  const handleCheck = (variable) => {
    setCheck(variable); // Update state with the variable from child
  };

  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <NavbarSign value="Sign In" link="/sign-in"></NavbarSign>
        <div className="sign_in-container">
          <div className="sing_in-form">
            <div>
              <Inputfield placeholder="Username" type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}>
              </Inputfield>
            </div>
            <div>
              <Inputfield placeholder="Email address" type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}> 
              </Inputfield>
            </div>
            <div>
              <Inputfield placeholder="Password" type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}>
              </Inputfield>
            </div>
            <div>
              <Inputfield
                placeholder="Confirm Password"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              ></Inputfield>
            </div>
            <RegisterButton value="REGISTER" link="/sign-in"
                            user={user}
                            password={password}
                            password2={password2}
                            email={email}
                            passcheck={handleCheck}>
            </RegisterButton>
            <div className="check-msg">{check}</div>
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
