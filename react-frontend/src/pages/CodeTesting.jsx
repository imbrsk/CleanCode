import NavbarSign from "../components/NavbarSign";
import Account from "../components/Account";
import Subject from "../components/subject";
import { CssBaseline } from "@mui/material";
import { Container } from "@mui/material";
import "../css/code.css";

function CodeTesting() {
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
        <p className="code-text">
          Напишете програма која од стандарден влез ќе прочита еден природен
          број N, и на стандарден излез ќе ја испечати факторизацијата на тој
          број.
          <br />
          <br />
          Под факторизација на природен број се подразбира неговото
          претставување како производ од
          <br />
          прости фактори (прост број на степен). Прост број е природен број кој
          има точно два делители (1 и<br />
          самиот тој број). Првите неколку прости броеви се 2, 3, 5, 7, 11, 13,
          17, итн...
        </p>
        <h3>Влез</h3>
        <p>Од стандарден влез се чита еден цел број N (2 = N = 100000).</p>
        <h3>Излез</h3>
        <p>
          На стандарден излез отпечатете ја факторизацијата на бројот N.
          Простите фактори се печатат во загради како број на (^) степен, а се
          одделени со знакот за множење (*).
        </p>
        <p>
          Факторите треба да се подредени од оној фактор со најмала основа, кон
          оние со поголема основа. Не смее да има знак * на крајот на излезот.
          Видете го тест-случајот даден подолу за конкретен пример...
        </p>
        <h3>Примери</h3>
        <div className="example">
          <div>
            <p>Влез</p>
            <p>1176</p>
          </div>
          <div>
            <p>Излез</p>
            <p>(2^3)*(3^1)*(7^2)</p>
          </div>
        </div>
        <form action="/" className="input-form">
          <p>
            <label for="sendcode">Input Code</label>
          </p>
          <textarea
            id="code-input"
            name="sendcode"
            rows="4"
            cols="100"
          ></textarea>
          <br />
          <input type="submit" value="Submit"></input>
        </form>
      </Container>
    </>
  );
}

export default CodeTesting;
