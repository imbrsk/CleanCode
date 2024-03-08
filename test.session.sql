-- @block
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(31) NOT NULL UNIQUE,
    email VARCHAR(127) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    solved INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--@block
SELECT user_id
FROM sessions
WHERE session_id = 0
-- @block
CREATE TABLE remember_me (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
    
-- @block
"UPDATE users SET password = ? WHERE email = ?"
-- @block
SELECT TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS minutes_ago
FROM reset_password
WHERE email = 'bobo';
-- @block
INSERT INTO subjects 
(problem_name,problem_subject,problem_year, problem_text,ex_input,ex_output,input,expected,starting_code) 
VALUES ('','',1,'','','','','','')

-- @block
CREATE TABLE reset_password (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(127) NOT NULL UNIQUE,
    reset_token VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
--@block
CREATE TABLE ? (id INT AUTO_INCREMENT PRIMARY KEY,parent_id INT,problem VARCHAR(255),subjects VARCHAR(255),code TEXT);
-- @block
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem_name VARCHAR(127),
    problem_subject VARCHAR(127),
    problem_year INT,
    problem_text TEXT,
    ex_input VARCHAR(255),
    ex_output VARCHAR(255),
    input TEXT,
    expected TEXT,
    starting_code TEXT
);

-- @block
CREATE TABLE user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    code TEXT,
    problem_name VARCHAR(127),
    problem_subject VARCHAR(127),
    


);
--@block
INSERT INTO sessions (user_id, session_id) VALUES (1, 2) ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), session_id = VALUES(session_id);
--@block
DROP TABLE sessions
--@block
UPDATE subjects SET input = '{
    "test0": "1 2 4 5 5 6 7 9",
    "test1": "1 3 4 5 7 8 12 42 53 56",
    "test2": "1 2 2 5 6 7 8 9",
    "test3": "2 2 3 4 4 5 5 6 7 7 8 9",
    "test4": "2 2 3 4 4 5 5 6 7 7 8 9",
    "test5": "20 30 40 50 60 70",
    "test6": "12 16 18 24 24 32 36 40",
    "test7": "10 20 30 40",
    "test8": "-1",
    "test9": "-1"
}';
--@block
UPDATE subjects SET problem_name = 'Zad1';
--@block
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
--@block
DELETE FROM sessions;