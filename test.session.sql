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
SELECT * FROM sessions
-- @block
INSERT INTO subjects (
        name,
        problem_path,
        subject,
        path,
        year,
        period, 
        text,
        ex_input,
        ex_output,
        input,
        expected,
        starting_code
    )
VALUES (
        'бобо',
        '/bobo',
        'Структурно',
        '/strukturno',
        1,
        'Колоквиум1',
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
-- @block
DROP TABLE subjects_dev
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
INSERT INTO subjects (
        name,
        problem_path,
        subject,
        path,
        year,
        period,
        text,
        ex_input,
        ex_output,
        input,
        expected,
        starting_code
    )
VALUES (
        'STEFANN',
        '/STEFANN',
        'Структурно Програмирање',
        '/strukturno',
        2023,
        'Испит',
        '<p>Testing styling of the bitch bboyy</p>',
        'ex inputot',
        'ex outputot',
        '{ "test0": "1",
"test1": "1",
"test2": "1",
"test3": "1",
"test4": "1",
"test5": "1",
"test6": "1",
"test7": "1",
"test8": "1",
"test9": "1"
}',
        '{ "test0": "1",
"test1": "1",
"test2": "1",
"test3": "1",
"test4": "1",
"test5": "1",
"test6": "1",
"test7": "1",
"test8": "1",
"test9": "1"
}',
        ''
    );
--@block
SELECT DISTINCT name, problem_path FROM subjects WHERE period = 'Колкокфиум 1' AND path = '/strukturno' AND year = 2023
--@block
DELETE FROM subjects WHERE id = 9
--@block
SELECT code FROM solved WHERE user_id = 5 AND problem_id = 8
--@block
UPDATE subjects SET input = '{
    "test0": "1",
    "test1": "1",
    "test2": "1",
    "test3": "1",
    "test4": "1",
    "test5": "1",
    "test6": "1",
    "test7": "1",
    "test8": "1",
    "test9": "1"
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
INSERT INTO verify (email, code) VALUES ("23","34") ON DUPLICATE KEY UPDATE code = VALUES(code)
--@block
CREATE TABLE verify (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(127) NOT NULL UNIQUE,
    code VARCHAR(15) NOT NULL
)
--@block
CREATE TABLE solved(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    code TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (problem_id) REFERENCES subjects(id)
)
--@block
SELECT * FROM subjects_dev
--@block
UPDATE subjects SET test_case_number = 10\
--@block
CREATE TABLE admin_cookies(
    id INT AUTO_INCREMENT PRIMARY KEY,
    session VARCHAR(127) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
--@block
CREATE TABLE token_admin_cookies(
    id INT AUTO_INCREMENT PRIMARY KEY,
    session VARCHAR(127) NOT NULL UNIQUE,-
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
--@block
SELECT * FROM subjects
--@block
SELECT * FROM solved
--@block
DELETE FROM subjects_dev;