import React, { useState } from "react";
import Button from "@mui/material/Button";
import "../css/problems.css";
import NavbarSign from "../components/NavbarSign";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Subject from "../components/subject";
import Account from "../components/Account";
import Accordion from "../components/Accordion";
import FirstTerm from "../components/FirstTerm";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import { createSession } from "../components/MakeSession";
import { Link } from "react-router-dom";
import SecondTerm from "../components/SecondTerm";
import Exams from "../components/Exams";
import { useEffect } from "react";

function Problems() {
  const userCookie = Cookies.get("session");
  const token = Cookies.get("token");
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  if (!userCookie) {
    if (!token) {
      window.location.href = "/";
    } else {
      createSession();
    }
  }
  const [ispiti2024, setIspiti2024] = useState([]);
  const requestData = {
    name: window.location.pathname,
    session: Cookies.get("session"),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/subject_problem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        //console.log(data);
        setIspiti2024(data);
      } catch (error) {
        console.error("Error during the fetch operation:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <CssBaseline />
      <NavbarSign value="Sign Out" link="/" />
      <Container maxWidth="lg" className="page-container">
        <Account></Account>
        <div className="subject">
          <div className="bracket">[</div>
          <div className="subject-value">Структурно Програмирање</div>
          <div className="bracket">]</div>
        </div>
        <div className="problem-sections">
          <FirstTerm problems={ispiti2024}></FirstTerm>
          <SecondTerm problems={ispiti2024}></SecondTerm>
          <Exams problems={ispiti2024}></Exams>
        </div>
        {/* 
        <div className="problem-years">
          <div className="problems">
            <div className="year"><div className="bracket-year">[</div>2024<div className="bracket-year">]</div></div>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Испити" index="1" year="2024" type="ispiti"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Прв Колоквиум" index="2" year="2024" type="prvkol"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Втор Колоквиум" index="3" year="2024" type="vtorkol"></Accordion>
          </div>
        </div>
        <div className="problem-years">
        <div className="problems">
            <div className="year"><div className="bracket-year">[</div>2023<div className="bracket-year">]</div></div>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Испити" index="4" year="2023" type="ispiti"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Прв Колоквиум" index="5" year="2023" type="prvkol"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Втор Колоквиум" index="6" year="2023" type="vtorkol"></Accordion>
          </div>
        </div>
        <div className="problem-years">
          <div className="problems">
            <div className="year"><div className="bracket-year">[</div>2022<div className="bracket-year">]</div></div>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Испити" index="7" year="2022" type="ispiti"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Прв Колоквиум" index="8" year="2022" type="prvkol"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Втор Колоквиум" index="9" year="2022" type="vtorkol"></Accordion>
          </div>
        </div>
        <div className="problem-years">
        <div className="problems">
            <div className="year"><div className="bracket-year">[</div>2021<div className="bracket-year">]</div></div>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Испити" index="10" year="2021" type="ispiti"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Прв Колоквиум" index="11" year="2021" type="prvkol"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Втор Колоквиум" index="12" year="2021" type="vtorkol"></Accordion>
          </div>
        </div> */}
      </Container>
      <Footer></Footer>
    </>
  );
}

export default Problems;
