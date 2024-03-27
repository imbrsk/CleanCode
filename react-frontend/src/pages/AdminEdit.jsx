import React, { useState } from "react";
import styles from "../css/admin.module.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function AdminEdit() {
  const [problemName, setProblemName] = useState("");
  const [subjectPath, setSubjectPath] = useState([]);
  const [problemPath, setProblemPath] = useState("");
  const [problemText, setProblemText] = useState("");
  const [problem, setProblem] = useState("");
  const [problemOptions, setProblemOptions] = useState([]);
  const [problemYear, setProblemYear] = useState("");
  const [testcaseNumber, setTestcaseNumber] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [exampleOutput, setExampleOutput] = useState("");
  const [subjectOptions, setSubjectOptions] = useState("");
  const [problemId, setProblemId] = useState("");
  const [period, setPeriod] = useState("");

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
  function setInputCases(num) {
    let inputCases = {};
    for (let i = 0; i < num; i++) {
      inputCases["test" + i] = "1";
    }
    setInputTestCases(JSON.stringify(inputCases, null, 2));
  }
  function setExpectedCase(num) {
    let expectedCases = {};
    for (let i = 0; i < num; i++) {
      expectedCases["test" + i] = "1";
    }
    setExpectedTestCases(JSON.stringify(expectedCases, null, 2));
  }
  function handleTestCases(num) {
    setTestcaseNumber(num);
    setInputCases(num);
    setExpectedCase(num);
  }
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
    const problemData = {
      name: problemName,
      problem_path: problemPath,
      subject: subjectOptions,
      path: subjectPath,
      period: period,
      text: problemText,
      year: problemYear,
      ex_input: exampleInput,
      ex_output: exampleOutput,
      input: inputTestCases,
      expected: expectedTestCases,
      starting_code: startingCode,
      test_case_number: testcaseNumber,
      id: problemId,
    };

    // Check if any of the fields is empty
    if (
      problemData.name === "" ||
      problemData.problem_path === "" ||
      problemData.subject === "" ||
      problemData.path === "" ||
      problemData.period === "" ||
      problemData.text === "" ||
      problemData.year === "" ||
      problemData.ex_input === "" ||
      problemData.ex_output === "" ||
      problemData.input === "" ||
      problemData.output === "" ||
      problemData.test_case_number === ""
    ) {
      alert("Please fill in all fields");
      return;
    } else {
      fetch("http://localhost:8000/edit_problem_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(problemData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          // Handle the response data here
        })
        .catch((error) => {
          console.error("Error during the fetch operation:", error);
        });
    }
  };

  let token = Cookies.get("admincookie");
  const checkToken = async () => {
    if (!token) {
      //window.location.href = "/admin";
      return;
    }
    const req = {
      session: token,
    };
    try {
      const response = await fetch("http://localhost:8000/verify_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (response["status"] !== "success") {
        //window.location.href = "/admin";
      }
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };
  const fetchData = async () => {
    const reqdata = { name: document.getElementById("problemselector").value };
    try {
      const response = await fetch("http://localhost:8000/load_problem_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqdata),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      handleTestCases(data['problem']['test_case_number'])
      setProblemName(data["problem"]['name']);
      setProblemPath(data['problem']['problem_path'])
      setExampleInput(data['problem']['ex_input'])
      setExampleOutput(data['problem']['ex_output'])
      setProblemYear(data['problem']['year']);
      setProblemText(data['problem']['text']);
      setSubjectOptions(data['problem']['subject'])
      setInputTestCases(data['problem']['input']);
      setExpectedTestCases(data['problem']['expected']);
      setStartingCode(data['problem']['starting_code']);
      setSubjectPath(data['problem']['path'])
      setPeriod(data['problem']['period']);
      setProblemId(data['id'])

      
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };
  React.useEffect(() => {
    checkToken();
    getProblems();
    fetchData();
  }, [problem]);
  const getProblems = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/load_problem_names_dev",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      let problemOptionsMap = data.map((item) => (
        <option key={item.id} value={item.id}>
          {item.problem}
        </option>
      ));
      setProblemOptions(problemOptionsMap);
    } catch (error) {
      console.error("Error during the fetch operation:", error);
    }
  };
  return (
    <>
      <div className={styles.adminProblem}>
        <select
          className={styles.adminButton}
          id="problemselector"
          onChange={(event) => setProblem(event.target.value)}
        >
          <option value="">Select a problem to edit</option>
          {problemOptions}
        </select>
      </div>
      <div className={styles.adminProblem}>
        <div className={styles.leftButtons}>
          <button onClick={handleAddProblem} className={styles.adminButton}>
            Save Problem
          </button>
          <Link to={"preview"}>
            <button className={styles.adminButton}>Preview Problems</button>
          </Link>
        </div>
        <div className={styles.problemLeft}>
          <h2>Edit Problem</h2>
          <div>
            <input className={styles.adminButton} list="subjects"  value={subjectOptions} onChange={(e) => setSubjectOptions(e.target.value)}/>
            <datalist className={styles.adminButton} id="subjects">
              <option value={subjectOptions}>{subjectOptions}</option>
            </datalist>
            <input className={styles.adminButton} list="subjectPaths" value={subjectPath} onChange={(e) => setSubjectPath(e.target.value)}/>
            <datalist className={styles.adminButton} id="subjectPaths">
              <option value={subjectPath}>{subjectPath}</option>
            </datalist>
            <select className={styles.adminButton} onChange={(e) => setPeriod(e.target.value)}>
              <option value={period}>{period}</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              className={styles.adminInput}
              placeholder="Problem name"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
            />
            <input
              className={styles.adminInput}
              type="text"
              placeholder="Problem path"
              value={problemPath}
              onChange={(e) => setProblemPath(e.target.value)}
            />
            <input
              className={styles.adminInput}
              type="text"
              placeholder="Problem Year"
              value={problemYear}
              onChange={(e) => setProblemYear(e.target.value)}
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
        </div>
        <div className={styles.problemLeft}>
          <h2>Test cases</h2>
          <div className={styles.problemLeft}>
            <div>
              <input
                className={styles.adminInput}
                type="text"
                placeholder="Number of test cases"
                value={testcaseNumber}
                onChange={(e) => handleTestCases(e.target.value)}
              />
              <h2>Input</h2>
              <textarea
                className={styles.adminInput}
                type="text"
                rows="15"
                placeholder="Input test cases"
                value={inputTestCases}
                onChange={(e) => setInputTestCases(e.target.value)}
              />
            </div>
            <div>
              <h2>Output</h2>
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
        </div>
      </div>
    </>
  );
}

export default AdminEdit;
