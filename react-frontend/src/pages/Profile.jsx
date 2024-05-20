import NavbarSign from "../components/NavbarSign";
import Footer from "../components/Footer";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Account from "../components/Account";
import Subject from "../components/Subject";
import { createSession } from "../components/MakeSession";
import Cookies from "js-cookie";
import "../css/profile.css";
import { Link, json } from "react-router-dom";
import Popup from "reactjs-popup";
import Editor from "@monaco-editor/react";

function Profile() {
  const userCookie = Cookies.get("session");
  const token = Cookies.get("token");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [tasks, setTasks] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [changedFlag, setChangedFlag] = React.useState(false);

  React.useEffect(() => {
    if (!userCookie) {
      if (!token) {
        window.location.href = "/";
      } else {
        createSession();
      }
    }

    const fetchSubjects = async () => {
      const req = {
        session: userCookie,
      };
      console.log(req);
      try {
        const response = await fetch(
          "http://localhost:8000/load_profile_page",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any other headers as needed
            },
            body: JSON.stringify(req),
            // Replace {} with the actual data you want to send in the request body
          }
        );
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
    fetchSubjects();
  }, [userCookie, token]);

  const saveProfile = async () => {
    const req = {
      session: userCookie,
      username: name,
    };
    console.log(req);
    try {
      const response = await fetch("http://localhost:8000/change_username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed
        },
        body: JSON.stringify(req),
        // Replace {} with the actual data you want to send in the request body
      });
      if (response.ok) {
        const data = await response.json();
        if (data["status"] === "success") {
          setMessage(data["response"]);
          setChangedFlag(true);
        } else {
          setMessage(data["response"]);
          setChangedFlag(false);
        }
      } else {
        throw new Error("Failed to fetch subjects");
      }
    } catch (error) {
      console.error(error);
    }
  };
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
  const subjectItems = tasks.map((subject) => (
    // <Link to={subject.path} key={subject.path} className="acc-solved">
    //
    // </Link>
    <Popup
      trigger={
        <button className="acc-solved">
          <div className="bracket-acc">[</div>
          <div className="subject-text-acc">
            {subject.name} - {subject.year} <br /> {subject.subject}
          </div>
          <div className="bracket-acc">]</div>
        </button>
      }
      modal
      nested
      key={subject.path}
    >
      {(close) => (
        <div className="modal">
          <div className="content">
            <Editor
              height="600px"
              id="code-input"
              name="sendcode"
              language="cpp"
              theme="vs-light"
              value={subject.code.replace(/\\n/g, "\n").replace(/\\t/g, "    ")}
              className="editor"
              options={{
                inlineSuggest: true,
                fontSize: "16px",
                formatOnType: true,
                autoClosingBrackets: true,
                autoIndent: true,
                formatOnPaste: true,
                minimap: { scale: 15 },
              }}
            />
          </div>
          <div className="popup-bottom">
            <button onClick={() => close()} className="popup-close">
              Close
            </button>
            <Link to={subject.path} className="popup-link">
              Go to problem
            </Link>
          </div>
        </div>
      )}
    </Popup>
  ));

  return userCookie ? (
    <React.Fragment>
      <CssBaseline />
      <NavbarSign value="Sign Out" link="/" />
      <Container maxWidth="lg" className="container-home">
        <div id="acc-page">
          <div className="acc-container">
            <div className="image-container">
              <img src="..\src\assets\avatar.png" alt="" height="200px" />
            </div>
            <div className="acc-username">My Profile</div>
            <input
              type="text"
              className="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ color: changedFlag ? "green" : "red" }}>{message}</div>
            <br />
            <input type="text" className="username" value={email} />
            <div style={{ color: "red" }}>*Cannot change email</div>
            <br />
            <button className="acc-save" onClick={saveProfile}>
              Save Changes
            </button>
          </div>
          <div className="solved-container">
            <div className="sol-header">Solved Problems</div>
            {subjectItems}
          </div>
        </div>
      </Container>
      <Footer />
    </React.Fragment>
  ) : null;
}

export default Profile;
