import React from "react";
import "../css/table.css";

const ResultsTable = (props) => {
  
  if (!props.data || !props.data.input) {
  return null;
  } else {
  const data = Object.keys(props.data.input).map((key) => ({
    test: key,
    input: props.data.input[key],
    expected: props.data.expected[key],
    got: props.data.got[key],
    is_cor: props.data.is_cor[key],
  }));
  return (
    <table className="table">
    <thead>
      <tr id="test">
      <th>Input</th>
      <th>Expected</th>
      <th>Got</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
      <tr
        key={index}
        style={{
        backgroundColor:
          row.is_cor == 1 ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)",
        }}
      >
        <td>{row.input}</td>
        <td>{row.expected}</td>
        <td>{row.got}</td>
      </tr>
      ))}
    </tbody>
    </table>
  );
  }
};

export default ResultsTable;
