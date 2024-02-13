import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Leaderboard from "../components/Leaderboard";
import '../css/app.css'
import Siteupdates from "../components/Siteupdates";
import Footer from "../components/Footer";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function Landingpage() {

  const [user, setUser] = useState(null);

  useEffect(() => {
      const userCookie = Cookies.get('user');
      if (userCookie) {
          setUser(userCookie);
      }
  }, []);
  console.log(user);
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
