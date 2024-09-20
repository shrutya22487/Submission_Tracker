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

SELECT
    p.id AS project_id,
    p.title AS project_title,
    p.conference AS project_conference,
    p.status AS project_status,
    p.link_1 AS project_link_1,
    p.link_2 AS project_link_2,
    p.submitted_date AS project_submitted_date,
    p.deadline_date AS project_deadline_date,
    p.sponsored AS project_sponsored,
    s.id AS student_id,
    s.Name AS student_name,
    s.type AS student_degree,
    j.id AS job_id,
    j.title AS job_title,
    j.status AS job_status,
    j.link_1 AS job_link_1,
    j.link_2 AS job_link_2,
    j.submitted_date AS job_submitted_date,
    j.deadline_date AS job_deadline_date
FROM
    Project p
JOIN
    Project_profs pp ON p.id = pp.project_id
JOIN
    Project_Students ps ON p.id = ps.project_id
JOIN
    Student s ON ps.student_id = s.id
LEFT JOIN
    Job j ON p.prof_table_id = j.prof_id AND ps.student_id = j.student_id
WHERE
    p.archived = FALSE
    AND pp.prof_id = 1
GROUP BY
    p.id,
    s.id,
    j.id
ORDER BY
    p.id, s.id;
SELECT * from Team where student_id = 5;
SELECT
    s.id AS student_id,
    s.Name AS student_name,
    s.type AS degree,
    COALESCE(p.title, 'No Project Assigned') AS project_title

FROM
    Student s
LEFT JOIN
    Project_Students ps ON s.id = ps.student_id
LEFT JOIN
    Project p ON ps.project_id = p.id
JOIN
    Team t ON s.id = t.student_id
WHERE
    t.prof_id = 1
GROUP BY
    s.id, s.Name, s.type, p.title, p.id
ORDER BY
    s.type, s.Name;
