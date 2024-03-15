import React, { useState } from "react";
import "../css/problems.css";

function Accordion(props) {
  const activeIndex = props.active;
  const index = props.index;
  const title = props.title;
  const yearX = props.year;
  const type = props.type;
  // post funkcija so imeto za predmetot koj se raboti i se vrakja payload json so site ovite podatoci vo jsonot podole
  const requestData = {
    name: window.location.pathname,
  };
  const getProblems = async () => {
    try {
      const response = await fetch("http://localhost:8000/subject_problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };
  let zadaci = getProblems();
  const ispiti2024 = zadaci.find(({ year }) => year === yearX)?.[type] || [];

  const ispiti2024Items = ispiti2024.map((ispit, index) => (
    <div key={index}>
      <div className="expanded-problems" href={ispit.link}>
        {ispit.ime}
      </div>
    </div>
  ));
  return (
    <>
      <div className="ispitjan-2024">
        <button
          className={`accordion ${activeIndex === index ? "active" : ""}`}
          onClick={() => props.toggle(index)}
        >
          {title}
        </button>
        <div
          className="panel"
          style={{
            maxHeight: activeIndex === index ? "1000px" : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          {ispiti2024Items}
        </div>
      </div>
    </>
  );
}

export default Accordion;
