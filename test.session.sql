
-- @block
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL
);

-- @block
INSERT INTO users (username, email, pass)
VALUES
    ('bobo211', 'borisgjorgjievskii@gmail.com', MD5('bobo2004'))
    
-- @block
SELECT * FROM users;