import NavbarSign from "../components/NavbarSign";
import Account from "../components/Account";
import Subject from "../components/subject";
import { CssBaseline } from "@mui/material";
import { Container } from "@mui/material";
import { createSession } from "../components/MakeSession";
import "../css/code.css";
import Cookies from "js-cookie";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ResultsTable from "../components/ResultsTable";




function parseText(text) {
  const elements = [];

  // Create a temporary div element to parse the HTML text
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = text;

  // Iterate over the child nodes of the temporary div
  tempDiv.childNodes.forEach((node, index) => {
    if (node.nodeName === "P") {
      // If the node is a paragraph, create a paragraph element with its text content
      elements.push(<p key={index}>{node.textContent}</p>);
    } else if (node.nodeName === "H3") {
      // If the node is an h3 element, create an h3 element
      elements.push(<h3 key={index}>{node.textContent}</h3>);
    }
  });

  return elements;
}
function CodeTesting() {
  let path = "";
  if (typeof window !== "undefined" && window.location) {
    path = window.location.pathname;
  }
  const [tableData, setTableData] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [exinput, setExinput] = useState("");
  const [exoutput, setExoutput] = useState("");
  const [language, setLanguage] = useState("54");
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const codeData = {
    session: Cookies.get("session"),
    code: code,
    problem_id: id,
    language: language,
  };
  const textData = {
    session: Cookies.get("session"),
    path: id,
  };
  const userCookie = Cookies.get("session");
  const token = Cookies.get("token");
  if (!userCookie) {
    if (!token) {
      window.location.href = "/";
    } else {
      createSession();
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/load_problem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(textData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setName(data["name"]);
        setText(parseText(data["text"]));
        setExinput(data["ex_input"]);
        setExoutput(data["ex_expected"]);
        setCode(data["code"]);
      } catch (error) {
        console.error("Error during the fetch operation:", error);
      }
    };
    fetchData();
  }, []);
  const testCode = async (request) => {
    document.getElementById("ldr").style.display = "block";
    const button = document.getElementById('submit-button');
    button.disabled = true;
    try {
      const response = await fetch("http://localhost:8000/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        document.getElementById("ldr").style.display = "none";
        button.disabled = false;
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      document.getElementById("ldr").style.display = "none";
      button.disabled = false;
      if (data) {
        setTableData(data);;
      } else {
        console.error('Data is undefined or null');
      }
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };
  return (
    <>
      <CssBaseline></CssBaseline>
      <NavbarSign value="Sign Out" link="/"></NavbarSign>
      <Container maxWidth="lg">
        <Account></Account>
        <div className="subject">
          <div className="bracket">[</div>
          <div className="subject-value">{name}</div>
          <div className="bracket">]</div>
        </div>
        {text}
        <h3>Примери</h3>
        <div className="example">
          <div>
            <p>Влез</p>
            <p>{exinput}</p>
          </div>
          <div>
            <p>Излез</p>
            <p>{exoutput}</p>
          </div>
        </div>
        <form action="" className="input-form">
          <p>
            <label htmlFor="sendcode" className="input-label">
              Input Code
            </label>
          </p>
          <textarea
            id="code-input"
            name="sendcode"
            rows="30"
            cols="100"
            value={code}
            onChange={handleCodeChange}
          ></textarea>
          <br />
          <div className="submit-form">
            <select
              name="lang"
              id="lang"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="54">C++</option>
              <option value="50">C</option>
            </select>
            <button
              type="button"
              id="submit-button"
              onClick={() => testCode(codeData)}
            >
              Submit
            </button>
          </div>
          <div className="loader" id="ldr"></div>
          <ResultsTable data={tableData}></ResultsTable>
        </form>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default CodeTesting;
