import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, ThemeProvider } from "@mui/system";
import Container from "@mui/material/Container";
import "./hero.css";
import study from "./assets/study.svg";
import practice from "./assets/practice.svg";
import solve from "./assets/solve.svg";

function Hero() {
  return (
    <>
      <div className="hero-container">
        <div className="hero-study">
          Study
          <img src={study} alt="" className="study-svg" />
        </div>
        <div className="hero-practice">
          Practice
          <img src={practice} alt="" className="practice-svg" />
        </div>
        <div className="hero-solve">
          Solve
          <img src={solve} alt="" className="solve-svg" />
        </div>
        <div className="hero-text">
          Welcome to clean code, whether you’re a cs student,<br></br>
          software engineer or anything else, it doesn’t matter.<br></br>
          Here you can practice your skills and strive to improve.<br></br>
        </div>
      </div>
    </>
  );
}

export default Hero;
