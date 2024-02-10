import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Leaderboard from "../components/Leaderboard";
import '../css/app.css'
import Siteupdates from "../components/Siteupdates";
import Footer from "../components/Footer";

function Landingpage() {
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
          <Siteupdates></Siteupdates>
        </Container>
        <Footer></Footer>
      </React.Fragment>
    </>
  );
}

export default Landingpage;
