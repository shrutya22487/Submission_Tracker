-- CREATE DATABASE rema_db;


CREATE TABLE IF NOT EXISTS Professor
(
    id       SERIAL PRIMARY KEY,
    Name     VARCHAR(50) NOT NULL,
    email_id VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Student
(
    id       SERIAL PRIMARY KEY,
    Name     VARCHAR(50) NOT NULL,
    email_id VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users
(
    id       SERIAL PRIMARY KEY,
    email     VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS Mapping
(
    prof_id    INT,
    student_id INT
);



SELECT *
FROM users;
