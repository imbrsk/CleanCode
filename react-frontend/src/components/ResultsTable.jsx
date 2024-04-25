import React from "react";
import "../css/table.css";

const ResultsTable = (props) => {
  let msg;
  let check;
  if (!props.data || !props.data.input) {
    if (props.data['status'] != undefined) {
      msg = props.data['status'];
      return <div className="error-msg">{msg}</div>;
    }
  } else {
    const data = Object.keys(props.data.input).map((key) => ({
      test: key,
      input: props.data.input[key],
      expected: props.data.expected[key],
      got: props.data.got[key],
      is_cor: props.data.is_cor[key],
    }));

    if (props.data["track_cor"] == 'True') {
      msg = "All tests passed!";
      check = true;
    } else {
      msg = "Some tests failed!";
      check = false;
    }

    return (
      <>
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
                <td>{row.input.split('\n').map((line, index) => <div key={index}>{line}</div>)}</td>
                <td>{row.expected.split('\n').map((line, index) => <div key={index}>{line}</div>)}</td>
                <td>{row.got.split('\n').map((line, index) => <div key={index}>{line}</div>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={`exec-msg ${check ? 'passed-msg' : 'failed-msg'}`}>{msg}</div>
      </>
    );
  }
};

export default ResultsTable;
