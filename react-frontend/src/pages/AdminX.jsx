import React, { useState } from "react";
import styles from "../css/admin.module.css";
import Cookies from "js-cookie";
import { Link, json } from "react-router-dom";
import xml_js from 'xml-js';

function AdminX() {
  const [problemName, setProblemName] = useState("");
  const [subjectPath, setSubjectPath] = useState([]);
  const [problemPath, setProblemPath] = useState("");
  const [problemText, setProblemText] = useState("");
  const [problemOptions, setProblemOptions] = useState([]);
  const [problemYear, setProblemYear] = useState("");
  const [testcaseNumber, setTestcaseNumber] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [exampleOutput, setExampleOutput] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [fileInput, setFileInput] = useState([]);
  const [fileContent, setFileContent] = useState({});


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
  const handleMoveMain = () => {
    const req = {
      id: document.querySelector("#problemselector").value,
    };
    fetch("http://localhost:8000/move_to_main", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
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
  };
  const handleSendXML = async () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const req = {
        fileContent: (fileContent),
        params: {
          subject: document.getElementById("subject_name").value,
          path: document.getElementById("subject_path").value,
          year: problemYear,
          period: document.getElementById("selectperiod").value
        }
      };

      // Send the request
      fetch("http://localhost:8000/moodle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
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
          alert("File uploaded!");
        })
        .catch((error) => {
          console.error("Error during the fetch operation:", error);
        });
    };

    reader.readAsText(fileInput); // Read file content as text
  };

  const handleAddProblem = () => {
    const problemData = {
      name: problemName,
      problem_path: problemPath,
      subject: document.getElementById("subject_name").value,
      path: document.getElementById("subject_path").value,
      period: document.getElementById("selectperiod").value,
      text: problemText,
      year: problemYear,
      ex_input: exampleInput,
      ex_output: exampleOutput,
      input: inputTestCases,
      expected: expectedTestCases,
      starting_code: startingCode,
      test_case_number: testcaseNumber,
    };
    console.log(problemData);
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
      alert("Fill out all fields!");
    } else {
      alert("Problem added to TEST DB!");
      fetch("http://localhost:8000/add_to_dev", {
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
          //console.error("Error during the fetch operation:", error);
        });
    }
  };

  const handleEditProblem = () => {
    window.location.href = "/editproblem";
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
  React.useEffect(() => {
    checkToken();
    fetchSubjects();
    getProblems();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/subjects");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let data = await response.json();
      let subjectMap = data.map((subject) => (
        <option key={subject.path} value={subject.path}>
          {subject.path}
        </option>
      ));
      setSubjectPath(subjectMap);
      subjectMap = data.map((subject) => (
        <option key={subject.subject} value={subject.subject}>
          {subject.subject}
        </option>
      ));
      setSubjectOptions(subjectMap);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
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
        <div className={styles.leftButtons}>
          <button
            onClick={handleAddProblem}
            className={styles.adminSpecialButton}
          >
            Add to Test DB
          </button>
          <button onClick={handleEditProblem} className={styles.adminButton}>
            Edit a problem
          </button>
          <Link to={"preview"}>
            <button className={styles.adminButton}>Preview Problems</button>
          </Link>
          <Link to={"tokens"}>
            <button className={styles.adminButton}>Tokens</button>
          </Link>
        </div>
        <div className={styles.problemLeft}>
          <h2 className="center">Add Problem</h2>
          <div>
            <input
              className={styles.adminInput}
              list="subjects"
              id="subject_name"
            />
            <datalist className={styles.adminInput} id="subjects">
              <option value="">Pick a subject</option>
              {subjectOptions}
            </datalist>
            <input
              className={styles.adminInput}
              list="subjectPaths"
              id="subject_path"
            />
            <datalist className={styles.adminInput} id="subjectPaths">
              <option value="">Pick a subject path</option>
              {subjectPath}
            </datalist>
            <select className={styles.adminInput} id="selectperiod">
              <option value="">Pick a period</option>
              <option value="Колоквиум 1">Прв Кол</option>
              <option value="Колоквиум 2">Втор Кол</option>
              <option value="Испит">Испит</option>
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
              className={styles.adminInput}
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
              className={styles.adminInput}
              rows={10}
              cols={60}
              value={startingCode}
              onChange={(e) => setStartingCode(e.target.value)}
            ></textarea>
          </div>
          <div>
            <h2>Import from moodle</h2>
            <input type="file"
              id={styles.upfile}
              accept="text/xml"
              
              onChange={(e) => setFileInput(e.target.files[0])}

            />
          </div>
          <button className={styles.adminButton} onClick={handleSendXML}>Submit File</button>
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
      <div className={styles.adminProblem}>
        <select className={styles.adminButton} id="problemselector">
          <option value="">Select a problem to move</option>
          {problemOptions}
        </select>
        <button className={styles.adminButton} onClick={handleMoveMain}>
          Move to Main DB
        </button>
      </div>
    </>
  );
}

export default AdminX;
