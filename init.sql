CREATE TABLE admin(
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(127) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE admin_cookies(
    id INT AUTO_INCREMENT PRIMARY KEY,
    session VARCHAR(127) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE admin_token(
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(127) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(31) NOT NULL UNIQUE,
    email VARCHAR(127) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    solved INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE remember_me (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE reset_password (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(127) NOT NULL UNIQUE,
    reset_token VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(127),
    problem_path VARCHAR(127),
    subject VARCHAR(127),
    path VARCHAR(127),
    year INT,
    period VARCHAR(31),
    text TEXT,
    ex_input TEXT,
    ex_output TEXT,
    input TEXT,
    expected TEXT,
    starting_code TEXT,
    test_case_number INT
);
CREATE TABLE solved(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    code TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (problem_id) REFERENCES subjects(id)
);
CREATE TABLE subjects_dev (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(127),
    problem_path VARCHAR(127),
    subject VARCHAR(127),
    path VARCHAR(127),
    year INT,
    period VARCHAR(31),
    text TEXT,
    ex_input TEXT,
    ex_output TEXT,
    input TEXT,
    expected TEXT,
    starting_code TEXT,
    test_case_number INT
);
CREATE TABLE token_admin_cookies(
    id INT AUTO_INCREMENT PRIMARY KEY,
    session VARCHAR(127) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE verify (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(127) NOT NULL UNIQUE,
    code VARCHAR(15) NOT NULL
);