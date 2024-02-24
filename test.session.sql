-- @block
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(31) NOT NULL UNIQUE,
    email VARCHAR(127) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    solved INT
);

-- @block
INSERT INTO subjects (sub, link)
VALUES
    ('strukturno', '/strukturno')
    
-- @block
SELECT * FROM users
-- @block
INSERT INTO strukturno 
(parent_id, problem_name, problem_text,ex_input,ex_output,input,expected,starting_code,problem_location) 
VALUES (1,'Zad1','','','','','','','')

-- @block
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sub VARCHAR(63) NOT NULL UNIQUE,
    link VARCHAR(63) NOT NULL UNIQUE
);
--@block
CREATE TABLE ? (id INT AUTO_INCREMENT PRIMARY KEY,parent_id INT,problem VARCHAR(255),subjects VARCHAR(255),code TEXT);
-- @block
CREATE TABLE strukturno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    problem_name VARCHAR(127),
    problem_text TEXT,
    ex_input VARCHAR(255),
    ex_output VARCHAR(255),
    input TEXT,
    expected TEXT,
    starting_code TEXT,
    problem_location VARCHAR(255),
    FOREIGN KEY (parent_id) REFERENCES subjects(id)
);

-- @block
CREATE TABLE zimski2023 (
    child_id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    problem_name VARCHAR(63),
    problem_text TEXT,
    problem_expected VARCHAR(255),
    problem_input VARCHAR(255),
    input TEXT,
    outputt TEXT,
    starting_code TEXT,
    FOREIGN KEY (parent_id) REFERENCES strukturno(id)
);
--@block
DROP TABLE strukturno;

--@block
SELECT input FROM strukturno WHERE problem_name = 'Zad1';



--@block
UPDATE strukturno SET expected = '{
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
UPDATE strukturno SET expected = '{
    "test0": "5 3\n1 2 3 4 5\n9 5 3 6 7"}';
--@block
CREATE TABLE bobo1(
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem VARCHAR(255),
    subjects VARCHAR(255),
    code TEXT
)