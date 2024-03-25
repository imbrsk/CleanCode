import React, { useState } from 'react';
import styles from '../css/admin.module.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleTokenChange = (e) => {
        setToken(e.target.value);
    };

    const handleLoginWithCredentials = () => {
        // Perform login with username and password
        // You can make an API call here to validate the credentials
        console.log('Logging in with username and password:', username, password);
    };

    const handleLoginWithToken = () => {
        // Perform login with token
        // You can make an API call here to validate the token
        console.log('Logging in with token:', token);
    };

    return (
        <div className={styles.adminform}>
            <h1>Admin Page</h1>
            <div>
                <label>Username:</label>
                <input className={styles.adminInput} type="text" value={username} onChange={handleUsernameChange} />
            </div>
            <div>
                <label>Password:</label>
                <input className={styles.adminInput} type="password" value={password} onChange={handlePasswordChange} />
            </div>
            <button onClick={handleLoginWithCredentials} className={styles.adminButton}>Login with Username/Password</button>
            <div>
                <label>Token:</label>
                <input className={styles.adminInput} type="text" value={token} onChange={handleTokenChange} />
            </div>
            <button onClick={handleLoginWithToken} className={styles.adminButton}>Login with Token</button>
        </div>
    );
};

export default AdminLogin;