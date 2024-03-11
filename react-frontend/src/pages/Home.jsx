import NavbarSign from "../components/NavbarSign";
import Footer from "../components/Footer";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Account from "../components/Account";
import Subject from "../components/subject";
import { createSession } from "../components/MakeSession";
import Cookies from "js-cookie";
import "../css/home.css";

function Home() {
  const userCookie = Cookies.get("session");
  const token = Cookies.get("token");
  const subjectsJSON = [
    {
      name: "Структурно Програмирање",
      number: 1,
      link: "/strukturno",
    },
    {
      name: "Напредно Програмирање",
      number: 2,
      link: "/napredno",
    },
    {
      name: "Објектно-Ориентирано Програмирање",
      number: 3,
      link: "/objektno",
    },
    {
      name: "Алгоритми и Податочни структури",
      number: 4,
      link: "/algoritmi",
    },
    {
      name: "Визуелно Програмирање",
      number: 5,
      link: "/vizuelno",
    },
  ];
  const subjectItems = subjectsJSON.map((subject) => (
    <Subject key={subject.number} link={subject.link} name={subject.name} />
  ));

  if (!userCookie) {
    if (!token) {
      window.location.href = "/";
    } else {
      createSession();
    }
  }
  return userCookie ? (
    <React.Fragment>
      <CssBaseline />
      <NavbarSign value="Sign Out" link="/" />
      <Container maxWidth="lg" className="container-home">
        <Account />
        {subjectItems}
      </Container>
      <Footer />
    </React.Fragment>
  ) : null;
}

export default Home;
