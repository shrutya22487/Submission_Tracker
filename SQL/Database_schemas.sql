CREATE TABLE IF NOT EXISTS Professor
(
    id       SERIAL PRIMARY KEY,
    Name     VARCHAR(50) NOT NULL,
    email_id VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Student
(
    id       SERIAL PRIMARY KEY,
    Name     VARCHAR(50) NOT NULL,
    email_id VARCHAR(50) UNIQUE NOT NULL,
    type     VARCHAR(50) NOT NULL DEFAULT 'B.Tech'
);

CREATE TABLE IF NOT EXISTS Mapping
(
    prof_id    INT,
    student_id INT,
    archived BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Job
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(1000) NOT NULL,
    prof_name   VARCHAR(1000) NOT NULL,
    author      VARCHAR(1000) NOT NULL,
    conference  VARCHAR(1000),
    status      VARCHAR(1000) NOT NULL,
    link        VARCHAR(1000),
    date        DATE,
    student_id  INT NOT NULL,
    prof_id     INT,
    archived BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (prof_id) REFERENCES Professor(id),
    FOREIGN KEY (student_id) REFERENCES Student(id)
);

CREATE TABLE conferences (
    conference_id SERIAL PRIMARY KEY,
    conference_name VARCHAR(255) NOT NULL,
    deadline DATE NOT NULL,
    website_link VARCHAR(255)
);

