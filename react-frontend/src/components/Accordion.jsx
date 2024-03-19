import React, { useState, useEffect } from "react";
import "../css/problems.css";
import { Link } from "react-router-dom";

function Accordion(props) {
  const activeIndex = props.active;
  const index = props.index;
  const title = props.title;
  const yearX = props.year;
  const type = props.type;
  const [ispiti2024, setIspiti2024] = useState([]);
  const requestData = {
    name: window.location.pathname,
    session: Cookies.get("session"),
  };

  useEffect(() => {
    const fetchData = async () => {
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

        const data = await response.json();
        setIspiti2024(data.find(({ year }) => year === yearX)?.[type] || []);
      } catch (error) {
        console.error("Error during the fetch operation:", error);
      }
    };

    fetchData();

    // Cleanup function if needed
    return () => {
      // Any cleanup code if needed
    };
  }, [yearX, type]); // Dependency array to rerun effect when yearX or type changes

  const ispiti2024Items = ispiti2024.map((ispit, index) => (
    <div key={index}>
      <div className={`expanded-problems ${ispit.solved === 1 ? "lightgreen" : ""}`}>
        <Link to={ispit.link} id="problems-text">{ispit.ime}</Link>
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
