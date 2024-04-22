import React, { useState, useEffect } from "react";
import "../css/problems.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function SecondTerm(props){
    const [problems, setProblems] = useState(props.problems);
    let items;
    useEffect(() => {
      setProblems(props.problems);
    }, [props.problems]);
    items = problems.map((item) => (
      item.vtorkol.map((ispit) => (
        <Link to={ispit.link} key={ispit.ime} className="problem-style">
          {ispit.ime} - {item.year}
        </Link>
      ))
    ));  
    return (
      <>
        <div className="problems-container">
          <div className="problem-title">Втор Колоквиум</div>
          <div className="table-problems">
            {items}
          </div>
        </div>
      </>
    );
}

export default SecondTerm;