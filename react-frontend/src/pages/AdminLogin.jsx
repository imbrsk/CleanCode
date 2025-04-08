import React, { useState } from "react";
import styles from "../css/admin.module.css";
import Cookies from "js-cookie";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setLogininfo({
      password: password,
      token: username,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setLogininfo({
      password: password,
      token: username,
    });
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };
  const [logininfo, setLogininfo] = useState([]);

  const handleLoginWithCredentials = () => {
    setLogininfo({'token': username, 'password': password});
    fetch("http://localhost:8000/login_admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logininfo),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["status"] === "success") {
          Cookies.set("admincookie", data["cookie"]);
          window.location.href = "/adminadmin";
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  const handleLoginWithToken = () => {
    let data = {
      "token" : token
    }
    fetch("http://localhost:8000/token_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["status"] === "success") {
          Cookies.set("token", data["cookie"]);
          window.location.href = "/modpage  ";
        }
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  return (
    <div className={styles.adminform}>
      <h1>Admin Page</h1>
      <div>
        <label>Username:</label>
        <input
          className={styles.adminInput}
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          className={styles.adminInput}
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button
        onClick={handleLoginWithCredentials}
        className={styles.adminButton}
      >
        Login with Username/Password
      </button>
      <div>
        <label>Token:</label>
        <input
          className={styles.adminInput}
          type="text"
          value={token}
          onChange={handleTokenChange}
        />
      </div>
      <button onClick={handleLoginWithToken} className={styles.adminButton}>
        Login with Token
      </button>
    </div>
  );
};

export default AdminLogin;
