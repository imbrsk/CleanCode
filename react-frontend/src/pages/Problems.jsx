import React, { useState } from "react";
import Button from "@mui/material/Button";
import "../css/problems.css";
import NavbarSign from "../components/NavbarSign";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Subject from "../components/subject";
import Account from "../components/Account";
import Accordion from "../components/Accordion";
import Footer from "../components/Footer";
import MakeSession from "../components/MakeSession";

function Problems() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  // Dobivame za koj predmet sakame da gi prikazeme zadacite pa go passame kako prop na accordionot
  // Ili tuka go dobivame payloadot so jsonot za site zadaci i prakjame kako prop na accordion
  return (
    <>
      <CssBaseline />
      <NavbarSign value="Sign Out" link="/" />
      <Container maxWidth="lg" className="container-problems">
        <Account></Account>
        <Subject name="Структурно Програмирање" link=""></Subject>
        <div className="problem-years">
          <div className="problems">
            <div className="year"><div className="bracket-year">[</div>2024<div className="bracket-year">]</div></div>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Испити" index="1" year="2024" type="ispiti"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Прв Колоквиум" index="2" year="2024" type="prvkol"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Втор Колоквиум" index="3" year="2024" type="vtorkol"></Accordion>
          </div>
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
          <div className="problems">
            <div className="year"><div className="bracket-year">[</div>2021<div className="bracket-year">]</div></div>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Испити" index="10" year="2021" type="ispiti"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Прв Колоквиум" index="11" year="2021" type="prvkol"></Accordion>
            <Accordion toggle={toggleAccordion} active={activeIndex} title="Втор Колоквиум" index="12" year="2021" type="vtorkol"></Accordion>
          </div>
        </div>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default Problems;
