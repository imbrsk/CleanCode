import React, { useState } from "react";
import styles from "../css/admin.module.css";
import Cookies from "js-cookie";
function AdminTokens() {
  let token = Cookies.get("admincookie");
  const checkToken = async () => {
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
    fetchTokens();
  }, []);
  const [tableData, setTableData] = React.useState([]);

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
  const deleteToken = async (token) => {
    const req = {
      token: token,
    };
    try {
      const response = await fetch("http://localhost:8000/delete_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      fetchTokens();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  return (
    <div className={styles.adminProblem}>
      <div>
        <button className={styles.adminButton} onClick={createToken}>
          Create token
        </button>
        <table>
          <thead>
            <tr>
              <th colSpan="3">Active Tokens</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.token}</td>
                <td>{item.created_at}</td>
                <td>
                  <button onClick={() => deleteToken(item.token)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTokens;
