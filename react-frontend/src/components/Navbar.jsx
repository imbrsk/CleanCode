import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, ThemeProvider } from "@mui/system";
import Container from "@mui/material/Container";
import "../css/index.css";
import { Outlet, Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div
        style={{
          height: 100,
          backgroundImage: "linear-gradient(to right, #111111, #292929)",
        }}
      >
        <Container maxWidth="lg" style={{ height: 100 }}>
          <div className="navbar">
            <Link className="link" to={"/"}> <div className="logo"><img src="\public\CleanCodeLogo.svg" alt="CleanCode" />Clean Code</div></Link>
           
            <div className="nav-right">
            <Link 
              className="nav-about"
              to={"/about"}>
              About
              </Link>
              <Link to="sign-in" className="nav-sign">Sign In</Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Navbar;
