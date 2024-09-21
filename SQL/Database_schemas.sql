-- DROP DATABASE rema_db;
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
    email_id VARCHAR(50) UNIQUE NOT NULL,
    type     VARCHAR(50) NOT NULL DEFAULT 'B.Tech'
);

CREATE TABLE IF NOT EXISTS Team
(
    prof_id    INT,
    student_id INT,
    archived BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Project
(
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(1000) NOT NULL,
    prof_table_id    INT,
    student_table_id INT,
    conference       VARCHAR(1000),
    status           VARCHAR(1000) CHECK (status IN ('Upcoming', 'Under Review', 'In Progress')),
    link_1           VARCHAR(1000),
    link_2           VARCHAR(1000),
    submitted_date   DATE,
    deadline_date    DATE,
    archived         BOOLEAN DEFAULT FALSE,
    sponsored        BOOLEAN DEFAULT FALSE
);
SELECT
        P.id AS project_id,
        P.title AS project_title,
        P.conference AS project_conference,
        P.status AS project_status,
        P.link_1 AS project_link_1,
        P.link_2 AS project_link_2,
        P.submitted_date AS project_submitted_date,
        P.deadline_date AS project_deadline_date,
        J.id AS job_id,
        J.title AS job_title,
        J.status AS job_status,
        J.link_1 AS job_link_1,
        J.link_2 AS job_link_2,
        J.submitted_date AS job_submitted_date,
        J.deadline_date AS job_deadline_date,
        PS.student_id AS student_id,
        S.Name AS student_name
    FROM Project_profs
    JOIN Project P ON P.id = Project_profs.project_id
    LEFT JOIN Project_Students PS ON P.id = PS.project_id
    LEFT JOIN Student S ON S.id = PS.student_id
    LEFT JOIN Job J ON P.id = J.project_id AND J.student_id = S.id
    WHERE Project_profs.prof_id = 1 AND P.archived = FALSE
    GROUP BY P.id, PS.student_id, S.Name, J.id, P.conference, P.status, P.link_1, P.link_2, P.submitted_date, P.deadline_date,
             J.title, J.status, J.link_1, J.link_2, J.submitted_date, J.deadline_date
                 ORDER BY PS.student_id;

CREATE TABLE IF NOT EXISTS Project_profs
(
    project_id INT NOT NULL,
    prof_id    INT NOT NULL,
    PRIMARY KEY (project_id, prof_id),
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE,
    FOREIGN KEY (prof_id) REFERENCES Professor(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Project_Students
(
    project_id INT NOT NULL,
    student_id    INT NOT NULL,
    PRIMARY KEY (project_id, student_id),
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Job
(
    id             SERIAL PRIMARY KEY,
    project_id      INT NOT NULL,
    prof_id        INT           NOT NULL,
    student_id     INT,
    title          VARCHAR(1000) NOT NULL,
    status         VARCHAR(1000) NOT NULL,
    link_1         VARCHAR(1000),
    link_2         VARCHAR(1000),
    submitted_date DATE,
    deadline_date  DATE,
    archived       BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (prof_id) REFERENCES Professor (id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Papers
(
    paper_id        SERIAL PRIMARY KEY,
    prof_id         INT  NOT NULL,
    student_id      INT  NOT NULL,
    conference_name VARCHAR(1000),
    submitted_date  DATE,
    deadline        DATE NOT NULL,
    link_1          VARCHAR(1000),
    link_2          VARCHAR(1000),
    archived        BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (prof_id) REFERENCES Professor (id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Student (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS prof_upcoming_deadlines
(
    prof_id     INT PRIMARY KEY NOT NULL,
    date        DATE,
    venue       VARCHAR(1000),
    type        VARCHAR(1000),
    description VARCHAR(1000),
    FOREIGN KEY (prof_id) REFERENCES Professor (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS prof_to_do
(
    prof_id     INT PRIMARY KEY NOT NULL,
    date        DATE,
    description VARCHAR(1000),
    FOREIGN KEY (prof_id) REFERENCES Professor (id) ON DELETE CASCADE
);


