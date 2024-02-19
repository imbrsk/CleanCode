import React, { useState } from "react";
import "../css/problems.css";


function Accordion(props) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <div className="ispitjan-2024">
        <button
          className={`accordion ${activeIndex === props.index ? "active" : ""}`}
          onClick={() => props.toggle(props.index)}
        >
          Испит Јануари
        </button>
        <div
          className="panel"
          style={{
            maxHeight: activeIndex === props.index ? "1000px" : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
      ;
    </>
  );
}

export default Accordion;
