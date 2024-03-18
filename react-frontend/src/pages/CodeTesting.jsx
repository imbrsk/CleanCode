import React from "react";
import NavbarSign from "../components/NavbarSign";
import Account from "../components/Account";
import Subject from "../components/subject";
import { CssBaseline } from "@mui/material";
import { Container } from "@mui/material";
import { createSession } from "../components/MakeSession";
import "../css/code.css";
import Cookies from "js-cookie";
import Footer from "../components/Footer";

const text =
  "<p> Напишете програма која од стандарден влез ќе прочита еден природен број N, и на стандарден излез ќе ја испечати факторизацијата на тој број. <p> Под факторизација на природен број се подразбира неговото претставување како производ од прости фактори (прост број на степен). Прост број е природен број кој има точно два делители (1 и самиот тој број). Првите неколку прости броеви се 2, 3, 5, 7, 11, 13, 17, итн... </p> <h3>Влез</h3><p>Од стандарден влез се чита еден цел број N (2 = N = 100000).</P><h3>Излез</h3> <p>На стандарден излез отпечатете ја факторизацијата на бројот N. Простите фактори се печатат во загради како број на (^) степен, а се одделени со знакот за множење (*).</p> <p> Факторите треба да се подредени од оној фактор со најмала основа, кон оние со поголема основа. Не смее да има знак * на крајот на излезот. Видете го тест-случајот даден подолу за конкретен пример...</p>";

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
function sendcode(){
  let requestData = {
    session: Cookies.get("session"),
    language: document.getElementById("lang").value,
    code: document.getElementById("code-input").value,
    path: "/strukturno",
    problem_id: 7
  }
  console.log(requestData);
}
const exinput = "1176";
const exoutput = "(2^3)*(3^1)*(7^2)";

function CodeTesting() {
  const userCookie = Cookies.get("session");
  const token = Cookies.get("token");
  if (!userCookie) {
    if (!token) {
      window.location.href = "/";
    } else {
      createSession();
    }
  }
  return (
    <>
      <CssBaseline></CssBaseline>
      <NavbarSign value="Sign Out" link="/"></NavbarSign>
      <Container maxWidth="lg">
        <Account></Account>
        <div className="subject">
          <div className="bracket">[</div>
          <div className="subject-value">Структурно Програмирање</div>
          <div className="bracket">]</div>
        </div>
        {parseText(text)}
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
          ></textarea>
          <br />
          <div className="submit-form">
            <select name="lang" id="lang">
              <option value="C++">C++</option>
              <option value="C">C</option>
            </select>
            <button type="button" id="submit-button" onClick={sendcode}>Submit</button>
          </div>
        </form>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default CodeTesting;
