import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, ThemeProvider } from "@mui/system";
import Container from "@mui/material/Container";
import "./index.css";

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
            <div className="logo">Clean Code</div>
            <div className="nav-right">
              <div className="nav-about">About</div>
              <div className="nav-sign" onClick={{}}>
                Sign In
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Navbar;
