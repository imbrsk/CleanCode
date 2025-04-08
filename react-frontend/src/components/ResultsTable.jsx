import React from "react";
import "../css/table.css";

const ResultsTable = (props) => {
  let msg;
  let check;
  if (!props.data || !props.data.input) {
    if (props.data['status'] !== undefined) {
      msg = props.data['status'];
      var lines = msg.split("\n");
      var formattedParagraph = lines.map((line, index) => (
        <span key={index}>
          {line}
          {index !== lines.length - 1 && <br />}{" "}
          {/* Add <br> tag after each line except the last one */}
        </span>
      ));
      return <div className="error-msg">{formattedParagraph}</div>;
    }
  } else {
    const data = Object.keys(props.data.input).map((key) => ({
      test: key,
      input: props.data.input[key],
      expected: props.data.expected[key],
      got: props.data.got[key],
      is_cor: props.data.is_cor[key],
    }));

    if (props.data["track_cor"] == true) {
      msg = "All tests passed!";
      check = true;
    } else {
      msg = "Some tests failed!";
      check = false;
    }

    return (
      <>
        <div className="table-container" style={{
          backgroundColor:
            props.data["track_cor"] == true ? "rgba(0,255,0,0.3)" : "rgba(255,0,0,0.3)",
        }}>
          <table className="table">
            <thead>
              <tr id="test">
                <th></th> {/* Added column for result */}
                <th>Input</th>
                <th>Expected</th>
                <th>Got</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    // border: "2px solid",
                    // borderColor:
                    //   row.is_cor == 1 ? "rgba(0,255,0,1)" : "rgba(255,0,0,1)",
                  }}
                >
                  <td>
                    {row.is_cor == 0 ? (
                      <span style={{ color: "red", fontWeight: "bolder" }}>&#10007;</span> // Check icon
                    ) : (
                        <span style={{ color: "green", fontWeight: "bolder" }}>&#10003;</span> // X icon
                    )}
                  </td>
                  <td>{row.input.split('\n').map((line, index) => <div key={index}>{line}<br /></div>)}</td>
                  <td>{row.expected.split('\n').map((line, index) => <div key={index}>{line}<br /></div>)}</td>
                  <td>{row.got.split('\n').map((line, index) => <div key={index}>{line}<br /></div>)}</td>
                  <td>
                    {row.is_cor == 0 ? (
                      <span style={{ color: "red", fontWeight: "bolder" }}>&#10007;</span> // Check icon
                    ) : (
                        <span style={{ color: "green", fontWeight: "bolder" }}>&#10003;</span> // X icon
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>{msg}</div>
        </div>
      </>
    );
  }
};

export default ResultsTable;
