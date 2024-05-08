import NavbarSign from "../components/NavbarSign";
import Footer from "../components/Footer";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Account from "../components/Account";
import Subject from "../components/subject";
import { createSession } from "../components/MakeSession";
import Cookies from "js-cookie";
import "../css/profile.css";
import { Link } from "react-router-dom";

function Profile() {
  const userCookie = Cookies.get("session");
  const token = Cookies.get("token");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [tasks, setTasks] = React.useState("");

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
        const response = await fetch("https://api.example.com/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers as needed
          },
          body: userCookie,
          // Replace {} with the actual data you want to send in the request body
        });
        if (response.ok) {
          const data = await response.json();
          setName(data["username"]);
          setEmail(data["email"]);
          setTasks(data["solved"]);
        } else {
          throw new Error("Failed to fetch subjects");
        }
      } catch (error) {
        console.error(error);
      }
    };
  }, [userCookie, token]);

  const subjects = [
    {
      path: "/strukturno/test1?id=11",
      name: "test12",
      subject: "Структурно Програмирање",
      year: "2024",
      period: "Колоквиум 1",
      code: '// Online C++ compiler to run C++ program online\n#include <iostream>\n\nint main() {\n    // Write C++ code here\n    std::cout << "1";\n\n    return 0;\n}',
    },
    {
      path: "/strukturno/test1?id=12",
      name: "test12",
      subject: "Структурно Програмирање",
      year: "2024",
      period: "Колоквиум 1",
      code: '// Online C++ compiler to run C++ program online\n#include <iostream>\n\nint main() {\n    // Write C++ code here\n    std::cout << "1";\n\n    return 0;\n}',
    },
    {
      path: "/strukturno/test1?id=13",
      name: "test12",
      subject: "Структурно Програмирање",
      year: "2024",
      period: "Колоквиум 1",
      code: '// Online C++ compiler to run C++ program online\n#include <iostream>\n\nint main() {\n    // Write C++ code here\n    std::cout << "Try programiz.pro";\n\n    return 0;\n}',
    },
    {
      path: "/strukturno/test1?id=19",
      name: "test12",
      subject: "Структурно Програмирање",
      year: "2024",
      period: "Колоквиум 1",
      code: '// Online C++ compiler to run C++ program online\n#include <iostream>\n\nint main(){\n    // Write C++ code here\n    std::cout << "1";\n\n    return 0;\n}',
    },
  ];
  const subjectItems = subjects.map((subject) => (
    <Link to={subject.path} key={subject.path}>
      {subject.name} - {subject.year}
    </Link>
  ));

  return userCookie ? (
    <React.Fragment>
      <CssBaseline />
      <NavbarSign value="Sign Out" link="/" />
      <Container maxWidth="lg" className="container-home">
        <div className="acc-username">Name: {name}</div>
        <div className="acc-email">Email: {email}</div>
        <br></br>
        <div className="solved-container"> {subjectItems}</div>
      </Container>
      <Footer />
    </React.Fragment>
  ) : null;
}

export default Profile;
