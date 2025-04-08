import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import Leaderboard from "../components/Leaderboard";
import '../css/app.css'
import Siteupdates from "../components/Siteupdates";
import Footer from "../components/Footer";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function About() {

  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <Navbar></Navbar>
        <Container maxWidth="lg">
          <div className="first-plot">
            <div>
              <AboutUs></AboutUs>
            </div>
          </div>
        </Container>
        <Footer></Footer>
      </React.Fragment>
    </>
  );
}

export default About;
