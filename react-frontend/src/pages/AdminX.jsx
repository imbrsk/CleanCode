import React, { useState } from "react";
import styles from "../css/admin.module.css";

function AdminX() {
  const [subject, setSubject] = useState("");
  const [problemPath, setProblemPath] = useState("");
  const [problemText, setProblemText] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [exampleOutput, setExampleOutput] = useState("");
  const [inputTestCases, setInputTestCases] = useState(
    JSON.stringify(
      {
        test0: "1",
        test1: "1",
        test2: "1",
        test3: "1",
        test4: "1",
        test5: "1",
        test6: "1",
        test7: "1",
        test8: "1",
        test9: "1",
      },
      null,
      2
    )
  );
  const [expectedTestCases, setExpectedTestCases] = useState(
    JSON.stringify(
      {
        test0: "1",
        test1: "1",
        test2: "1",
        test3: "1",
        test4: "1",
        test5: "1",
        test6: "1",
        test7: "1",
        test8: "1",
        test9: "1",
      },
      null,
      2
    )
  );
  const [startingCode, setStartingCode] = useState("");

  const handleAddProblem = () => {
    // Add problem logic here
  };

  const handleEditProblem = () => {
    // Edit problem logic here
  };

  const [tableData, setTableData] = React.useState([]);
  React.useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch("http://localhost:8000/load_tokens");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const createToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/create_token");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchTokens();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const deleteToken = async (request) => {
    try {
      const response = await fetch("http://localhost:8000/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      fetchTokens();
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };
  return (
    <>
      <div className={styles.adminProblem}>
        <div className={styles.problemLeft}>
          <h2>Add Problem</h2>
          <div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={styles.adminButton}
            >
              <option value="">Pick a subject</option>
              {/* Add subject options here */}
            </select>
          </div>
          <div>
            <input
              type="text"
              className={styles.adminInput}
              placeholder="Problem name"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              className={styles.adminInput}
              type="text"
              placeholder="Problem path"
              value={problemPath}
              onChange={(e) => setProblemPath(e.target.value)}
            />
          </div>
          <div>
            <textarea
              placeholder="Problem text"
              rows={10}
              cols={60}
              value={problemText}
              onChange={(e) => setProblemText(e.target.value)}
            ></textarea>
          </div>
          <div>
            <input
              className={styles.adminInput}
              type="text"
              placeholder="Example input"
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
            />
            <input
              className={styles.adminInput}
              type="text"
              placeholder="Example output"
              value={exampleOutput}
              onChange={(e) => setExampleOutput(e.target.value)}
            />
          </div>

          <div>
            <textarea
              placeholder="Starting code"
              rows={10}
              cols={60}
              value={startingCode}
              onChange={(e) => setStartingCode(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button onClick={handleAddProblem} className={styles.adminButton}>
              Add problem
            </button>
            <button onClick={handleEditProblem} className={styles.adminButton}>
              Edit problem
            </button>
          </div>
        </div>
        <div className={styles.problemRight}>
          <h2>Test cases</h2>
          <textarea
            className={styles.adminInput}
            type="text"
            rows="15"
            placeholder="Input test cases"
            value={inputTestCases}
            onChange={(e) => setInputTestCases(e.target.value)}
          />
          <textarea
            className={styles.adminInput}
            type="text"
            rows="15"
            placeholder="Expected test cases"
            value={expectedTestCases}
            onChange={(e) => setExpectedTestCases(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.adminProblem}>
        <table>
          <caption>
            <button className={styles.adminButton} onClick={createToken}>
              Create token
            </button>
          </caption>
          <thead>
            <tr>
              <th colSpan="3">Active Tokens</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.token}</td>
                <td>{item.date}</td>
                <td>
                  <button onClick={deleteToken(item.token)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminX;
