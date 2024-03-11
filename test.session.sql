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
INSERT INTO subjects (
        name,
        subject,
        path,
        year,
        text,
        ex_input,
        ex_output,
        input,
        expected,
        starting_code
    )
VALUES (
        '',
        'Структурно',
        '/strukturno',
        1,
        '',
        '',
        '',
        '',
        '',
        'none'
    );
-- @block
INSERT INTO subjects 
(problem_name,problem_subject,problem_year, problem_text,ex_input,ex_output,input,expected,starting_code) 
VALUES ('','Структурно',1,'','','','','','')

-- @block
CREATE TABLE reset_password (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(127) NOT NULL UNIQUE,
    reset_token VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
--@block
INSERT INTO reset_password (email, reset_token, created_at) VALUES ("23","34",NOW()) ON DUPLICATE KEY UPDATE reset_token = VALUES(reset_token), created_at = VALUES(created_at)
-- @block
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(127),
    subject VARCHAR(127),
    path VARCHAR(127),
    year INT,
    text TEXT,
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
DROP TABLE subjects
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
SELECT * FROM subjects
--@block
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
--@block
UPDATE users
SET password = "bobo1234"
WHERE email = "boris696boris@gmail.com"