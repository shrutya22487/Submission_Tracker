-- CREATE DATABASE rema_db;

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
    email_id VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Mapping
(
    prof_id    INT,
    student_id INT
);

CREATE TABLE IF NOT EXISTS Job
(
    id         SERIAL PRIMARY KEY,
    title      VARCHAR(1000) NOT NULL,
    prof_name  VARCHAR(1000) NOT NULL,
    author     VARCHAR(1000) NOT NULL,
    conference VARCHAR(1000),
    status     VARCHAR(1000) NOT NULL,
    link       VARCHAR(1000),
    date       DATE,
    student_id    INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Student(id)
);

INSERT INTO Job (title, prof_name, author, conference, status, link, date, student_id)
VALUES ('Fighting an infodemic: Covid-19 fake news dataset', 'Md. Shad Akhtar',
        'Parth Patwa, Shivam Sharma, Srinivas Pykl, Vineeth Guptha, Gitanjali Kumari, Md Shad Akhtar, Asif Ekbal, Amitava Das, Tanmoy Chakraborty',
        '', 'Under Review', 'link not here','2024-08-27',1);
INSERT INTO Job (title, prof_name, author, conference, status, link, date, student_id)
VALUES ('Title of the Job', 'Professor Name', 'Author Name', 'Conference Name', 'Status', 'http://example.com', '2024-08-27', 1);



SELECT Student.name FROM Student WHERE Student.id NOT IN (SELECT Mapping.student_id FROM Mapping WHERE given_prof_id = student_id);
