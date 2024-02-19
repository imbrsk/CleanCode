import React, { useState } from "react";
import Button from "@mui/material/Button";
import "../css/problems.css";
import NavbarSign from "../components/NavbarSign";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Subject from "../components/subject";
import Account from "../components/Account";
import Accordion from "../components/Accordion";

function Problems() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <CssBaseline />
      <NavbarSign value="Sign Out" link="/" />
      <Container maxWidth="lg">
        <Account></Account>
        <Subject name="Структурно Програмирање" link=""></Subject>
        <div className="problem-years">
          <div className="problems-2024">
            <div className="year">Year 2024</div>
            <div className="ispitjan-2024">
              <button
                className={`accordion ${activeIndex === 0 ? "active" : ""}`}
                onClick={() => toggleAccordion(0)}
              >
                Испит Јануари
              </button>
              <div
                className="panel"
                style={{
                  maxHeight: activeIndex === 0 ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            <div className="prvkol-2024">
              <button
                className={`accordion ${activeIndex === 3 ? "active" : ""}`}
                onClick={() => toggleAccordion(3)}
              >
                Прв Колоквиум
              </button>
              <div
                className="panel"
                style={{
                  maxHeight: activeIndex === 3 ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
            <div className="vtorkol-2024">
              <button
                className={`accordion ${activeIndex === 4 ? "active" : ""}`}
                onClick={() => toggleAccordion(4)}
              >
                Втор Колоквиум
              </button>
              <div
                className="panel"
                style={{
                  maxHeight: activeIndex === 4 ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
          <div className="problems-2023">
            <div className="year">Year 2023</div>
            <div className="ispitjan-2023">
              <button
                className={`accordion ${activeIndex === 5 ? "active" : ""}`}
                onClick={() => toggleAccordion(5)}
              >
                Испит Јануари
              </button>
              <div
                className="panel"
                style={{
                  maxHeight: activeIndex === 5 ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>

            <div className="prvkol-2023">
              <button
                className={`accordion ${activeIndex === 6 ? "active" : ""}`}
                onClick={() => toggleAccordion(6)}
              >
                Прв Колоквиум
              </button>
              <div
                className="panel"
                style={{
                  maxHeight: activeIndex === 6 ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
            <div className="vtorkol-2023">
              <button
                className={`accordion ${activeIndex === 7 ? "active" : ""}`}
                onClick={() => toggleAccordion(7)}
              >
                Втор Колоквиум
              </button>
              <div
                className="panel"
                style={{
                  maxHeight: activeIndex === 7 ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        <Accordion toggle={toggleAccordion} index="8"></Accordion>
        </div>
      </Container>
    </>
  );
}

export default Problems;
