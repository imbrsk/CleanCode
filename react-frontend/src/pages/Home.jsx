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
  const [subjects, setSubjects] = React.useState([]);

  React.useEffect(() => {
    if (!userCookie) {
      if (!token) {
        window.location.href = "/";
      } else {
        createSession();
      }
    }

    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/subjects");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data = await response.json();
        // Sort subjects by their number
        data.sort((a, b) => a.number - b.number);
        setSubjects(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchSubjects();
  }, [userCookie, token]);

  const subjectItems = subjects.map((subject) => (
    <Subject key={subject.path} link={subject.path} name={subject.subject} />
  ));

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
