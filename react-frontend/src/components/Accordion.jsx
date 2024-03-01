import React, { useState } from "react";
import "../css/problems.css";

function Accordion(props) {
  const activeIndex = props.active;
  const index = props.index;
  const title = props.title;
  const yearX = props.year;
  const type = props.type;
  // post funkcija so imeto za predmetot koj se raboti i se vrakja payload json so site ovite podatoci vo jsonot podole
  const zadaci = [
    {
      year: "2024",
      ispiti: [
        { ime: "Испити 2024 - 1", link: "/sobiranjekvadrat" },
        { ime: "Испити 2024 - 2", link: "/boljeneglava" },
        { ime: "Испити 2024 - 3", link: "/kockanjerulet" },
      ],
      prvkol: [
        { ime: "ПрвКол 2024 - 1", link: "/sobiranjekvadrat" },
        { ime: "ПрвКол 2024 - 2", link: "/boljeneglava" },
        { ime: "ПрвКол 2024 - 3", link: "/kockanjerulet" },
      ],
      vtorkol: [
        { ime: "ВторКол 2024 - 1", link: "/sobiranjekvadrat" },
        { ime: "ВторКол 2024 - 2", link: "/boljeneglava" },
        { ime: "ВторКол 2024 - 3", link: "/kockanjerulet" },
      ]
    },
    {
      year: "2023",
      ispiti: [
        { ime: "Испити 2023 - 1", link: "/sobiranjekvadrat" },
        { ime: "Испити 2023 - 2", link: "/boljeneglava" },
        { ime: "Испити 2023 - 3", link: "/kockanjerulet" },
      ],
      prvkol: [
        { ime: "ПрвКол 2023 - 1", link: "/sobiranjekvadrat" },
        { ime: "ПрвКол 2023 - 2", link: "/boljeneglava" },
        { ime: "ПрвКол 2023 - 3", link: "/kockanjerulet" },
      ],
      vtorkol: [
        { ime: "ВторКол 2023 - 1", link: "/sobiranjekvadrat" },
        { ime: "ВторКол 2023 - 2", link: "/boljeneglava" },
        { ime: "ВторКол 2023 - 3", link: "/kockanjerulet" },
      ]
    },
    {
      year: "2022",
      ispiti: [
        { ime: "Испити 2022 - 1", link: "/sobiranjekvadrat" },
        { ime: "Испити 2022 - 2", link: "/boljeneglava" },
        { ime: "Испити 2022 - 3", link: "/kockanjerulet" },
      ],
      prvkol: [
        { ime: "ПрвКол 2022 - 1", link: "/sobiranjekvadrat" },
        { ime: "ПрвКол 2022 - 2", link: "/boljeneglava" },
        { ime: "ПрвКол 2022 - 3", link: "/kockanjerulet" },
      ],
      vtorkol: [
        { ime: "ВторКол 2022 - 1", link: "/sobiranjekvadrat" },
        { ime: "ВторКол 2022 - 2", link: "/boljeneglava" },
        { ime: "ВторКол 2022 - 3", link: "/kockanjerulet" },
      ]
    },
    {
      year: "2021",
      ispiti: [
        { ime: "Испити 2021 - 1", link: "/sobiranjekvadrat" },
        { ime: "Испити 2021 - 2", link: "/boljeneglava" },
        { ime: "Испити 2021 - 3", link: "/kockanjerulet" },
      ],
      prvkol: [
        { ime: "ПрвКол 2021 - 1", link: "/sobiranjekvadrat" },
        { ime: "ПрвКол 2021 - 2", link: "/boljeneglava" },
        { ime: "ПрвКол 2021 - 3", link: "/kockanjerulet" },
      ],
      vtorkol: [
        { ime: "ВторКол 2021 - 1", link: "/sobiranjekvadrat" },
        { ime: "ВторКол 2021 - 2", link: "/boljeneglava" },
        { ime: "ВторКол 2021 - 3", link: "/kockanjerulet" },
      ]
    },

  ];
  const ispiti2024 = zadaci.find(({ year }) => year === yearX)?.[type] || [];

  const ispiti2024Items = ispiti2024.map((ispit, index) => (
    <div key={index}>
      <div className="expanded-problems" href={ispit.link}>{ispit.ime}</div>
    </div>
  ));
  return (
    <>
      <div className="ispitjan-2024">
        <button className={`accordion ${activeIndex === index ? "active" : ""}`} onClick={() => props.toggle(index)}>
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
