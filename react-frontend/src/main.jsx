import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import Sign from "./pages/Sign";
import About from "./pages/About";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import CodeTesting from "./pages/CodeTesting";
import AdminLogin from "./pages/AdminLogin";
import AdminT from "./pages/AdminT";
import AdminX from "./pages/AdminX";

export default function App() {
  const [subjects, setSubjects] = useState([]);
  const [problems, setProblems] = useState([]);
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/subjects");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data = await response.json();
        // Sort subjects by their number
        data.sort((a, b) => a.number - b.number);
        setSubjects(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchSubjects();

    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:8000/get_routs");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchProblems();
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Landingpage />} path="/" />
        <Route path="sign-in" element={<Sign />} />
        <Route path="about" element={<About />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="home" element={<Home />} />
        <Route path="problems" element={<Problems />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="modpage" element={<AdminT />} />
        <Route path="adminadmin" element={<AdminX />} />
        {/* Dynamically generate routes for subjects */}
        {subjects.map(subject => (
          <Route
            key={subject.subject}
            path={subject.path}
            element={<Problems />}
          />
        ))}
        {problems.map((problem, index) => (
          <Route
            key={index}
            path={problem.path}
            element={<CodeTesting/>}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
