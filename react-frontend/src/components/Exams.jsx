import React, { useState, useEffect } from "react";
import "../css/problems.css";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Exams(props){
    const [problems, setProblems] = useState(props.problems);
    let items;
    useEffect(() => {
      setProblems(props.problems);
    }, [props.problems]);
    items = problems.map((item) => (
      item.ispiti.map((ispit) => (
        <Link to={ispit.link} key={ispit.ime} className="problem-style">
          {ispit.ime} - {item.year}
        </Link>
      ))
    ));
    console.log("items", items);
  
    return (
      <>
        <div className="problems-container">
          <div className="problem-title">Испити</div>
          <div className="table-problems">
            {items}
          </div>
        </div>
      </>
    );
}

export default Exams;