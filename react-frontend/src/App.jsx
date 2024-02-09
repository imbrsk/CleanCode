import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Leaderboard from "./Leaderboard";
import './app.css'

function App() {
  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <Navbar></Navbar>
        <Container maxWidth="lg">
          <div className="first-plot">
            <div>
              <Hero></Hero>
            </div>
            <div>
              <Leaderboard></Leaderboard>
            </div>
          </div>
        </Container>
      </React.Fragment>
    </>
  );
}

export default App;
