import NavbarSign from "../components/NavbarSign";
import Footer from "../components/Footer";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Account from "../components/Account";
import Subject from "../components/subject";
import "../css/home.css";

function Home() {
  const subjects = ["Структурно Програмирање", "Напредно Програмирање", "Објектно-Ориентирано Програмирање", "Алгоритми и Податочни стриктури", "Визуелно Програмирање"];
  const subjectItems = subjects.map((subject) => 
    <Subject name={subject}></Subject>);
  return (
    <React.Fragment>
      <CssBaseline />
      <NavbarSign value="Sign Out" link="/"></NavbarSign>
      <Container maxWidth="lg" className="container-home">
        <Account user="Stefan19" tasks="70"></Account>
        {subjectItems}
      </Container>
      <Footer></Footer>
    </React.Fragment>
  );
}

export default Home;
