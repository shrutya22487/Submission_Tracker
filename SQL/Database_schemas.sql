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
    status           VARCHAR(1000),
    link_1           VARCHAR(1000),
    link_2           VARCHAR(1000),
    submitted_date   DATE,
    deadline_date    DATE,
    archived         BOOLEAN DEFAULT FALSE,
    sponsored        BOOLEAN DEFAULT FALSE,
    paper        BOOLEAN DEFAULT FALSE
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

CREATE TABLE IF NOT EXISTS meeting_notes
(
    id         SERIAL PRIMARY KEY,
    project_id INT  NOT NULL,
    prof_id    INT  NOT NULL,
    notes      TEXT NOT NULL,
    date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prof_id) REFERENCES Professor (id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Conferences
(
    prof_id INT NOT NULL,
    id      SERIAL PRIMARY KEY,
    date    DATE,
    title  TEXT NOT NULL,
    link  TEXT,
    FOREIGN KEY (prof_id) REFERENCES Professor (id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS deadlines
(
    prof_id   INT  NOT NULL,
    id        SERIAL PRIMARY KEY,
    deadline  TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prof_id) REFERENCES Professor(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS todos
(
    prof_id INT  NOT NULL,
    id      SERIAL PRIMARY KEY,
    task    TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prof_id) REFERENCES Professor(id) ON DELETE CASCADE
);



SELECT
    p.id AS project_id,
    p.title AS project_title,
    p.deadline_date AS deadline_data,
    p.submitted_date AS submitted_data,
    p.status AS status,
    p.link_1 AS link_1,
    p.link_2 AS link_2,
    STRING_AGG(DISTINCT s.name, ', ') AS students,
    STRING_AGG(DISTINCT CONCAT(mn.notes, ' (', TO_CHAR(mn.date, 'YYYY-MM-DD'), ')'), '; ') AS meeting_notes
FROM
    Project p
LEFT JOIN
    Project_Students ps ON p.id = ps.project_id
LEFT JOIN
    Student s ON ps.student_id = s.id
JOIN
    Project_profs pp ON p.id = pp.project_id
JOIN
    Professor pr ON pp.prof_id = pr.id
LEFT JOIN
    meeting_notes mn ON p.id = mn.project_id
WHERE pr.id = 2 AND p.archived = FALSE AND p.sponsored =FALSE AND p.paper = FALSE
GROUP BY
    p.id
ORDER BY
    p.id;