import NavbarSign from "../components/NavbarSign";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Inputfield from "../components/Inputfield";
import "../css/signin.css";
import { Checkbox } from "@mui/material";
import SignButton from "../components/SignButton";
import google from "../assets/google.svg";
import { Outlet, Link } from "react-router-dom";
import Cookies from "js-cookie";

function Sign() {
  const [email, setEmail] = React.useState(""); // State for email input
  const [password, setPassword] = React.useState(""); // State for password input
  const [isChecked, setIsChecked] = React.useState(true); // Set the initial state to true for checked
  const token = Cookies.get("token");
  const [check, setCheck] = React.useState("");

  const handleCheck = (variable) => {
    setCheck(variable); // Update state with the variable from child
  };
  // Function to handle checkbox change
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked); // Update the state when checkbox value changes
  };

  React.useEffect(() => {
    if (token) {
      window.location.href = "/home";
    }
    else{
      
    }
  }, []);

  return !token ? (
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
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
              ></Inputfield>
            </div>
            <div>
              <Inputfield
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Inputfield>
            </div>
            <div className="sign-assist">
              <div className="sign-remember">
                <Checkbox
                  checked={isChecked} // Pass checked state
                  onChange={handleCheckboxChange} // Handle checkbox change
                />
                <div>Remember me</div>
              </div>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                <div className="sign-forgot">Forgot Password?</div>
              </Link>
            </div>
            <div>
              <SignButton
                value="SIGN IN"
                link="/home"
                user={email} // Pass email state as prop
                password={password} // Pass password state as prop
                checked={isChecked}
                passcheck={handleCheck}
              ></SignButton>
            </div>
            <div className="check-msg">{check}</div>
            <div className="sign-connect">
              <div className="horz-line"></div>
              <div>Or connect with</div>
              <div className="horz-line"></div>
            </div>
            <div className="sign-google">
              <img src={google} alt="" className="google" />
            </div>
          </div>
        </div>
      </React.Fragment>
    </>
  ) : null;
}

export default Sign;
