import NavbarSign from "../components/NavbarSign";
import Footer from "../components/Footer";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Account from "../components/Account";
import Subject from "../components/subject";
import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
import "../css/home.css";

function Home() {
  const userCookie = Cookies.get("session");
  const token = {"token": Cookies.get("token")};

  const createSession = async () => {
    try {
      const response = await fetch("http://localhost:8000/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(token),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      Cookies.set("session", jsonResponse["session"]);
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };

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
    } 
    else {
      createSession();
    }
  } 
  else {
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
}

export default Home;
