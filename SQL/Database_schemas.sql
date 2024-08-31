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

-- Insert sample entries into the Job table
INSERT INTO Job (title, prof_name, author, conference, status, link, date, student_id) VALUES
('Research on AI and Machine Learning', 'Prof. Smith', 'John Doe', 'AI Conference 2023', 'Published', 'http://example.com/paper1', '2023-05-10', 1),
('Advanced Data Science', 'Prof. Johnson', 'Jane Smith', 'Data Science Symposium', 'In Review', 'http://example.com/paper2', '2023-06-15', 2),
('Blockchain Technology Trends', 'Prof. Wilson', 'Mike Johnson', 'Blockchain Expo', 'Accepted', 'http://example.com/paper3', '2023-07-20', 3),
('Quantum Computing Advances', 'Prof. Lee', 'Emily Davis', 'Quantum Tech Summit', 'Rejected', 'http://example.com/paper4', '2023-08-25', 4),
('Cybersecurity in IoT', 'Prof. Brown', 'Chris Brown', 'Cybersecurity Conference', 'Published', 'http://example.com/paper5', '2023-09-30', 5),
('Cloud Computing and Big Data', 'Prof. Taylor', 'Sarah Wilson', 'Cloud Computing Congress', 'Accepted', 'http://example.com/paper6', '2023-10-05', 6),
('Virtual Reality in Education', 'Prof. Miller', 'David Lee', 'VR Education Expo', 'In Review', 'http://example.com/paper7', '2023-11-10', 7),
('Artificial Neural Networks', 'Prof. Harris', 'Laura Martin', 'Neural Networks Workshop', 'Published', 'http://example.com/paper8', '2023-12-15', 8),
('Genomics and Data Analysis', 'Prof. Clark', 'James Anderson', 'Genomics Summit', 'Rejected', 'http://example.com/paper9', '2024-01-20', 9),
('Software Engineering Best Practices', 'Prof. Lewis', 'Linda Thompson', 'Software Eng. Conf.', 'Accepted', 'http://example.com/paper10', '2024-02-25', 10),
('Robotics and Automation', 'Prof. Walker', 'Robert Jackson', 'Robotics World', 'In Review', 'http://example.com/paper11', '2024-03-30', 11),
('Augmented Reality Applications', 'Prof. Hall', 'Patricia Harris', 'AR/VR Conference', 'Published', 'http://example.com/paper12', '2024-04-05', 12),
('Natural Language Processing', 'Prof. Young', 'Michael Lewis', 'NLP Workshop', 'Accepted', 'http://example.com/paper13', '2024-05-10', 13),
('Biotechnology and AI', 'Prof. Martinez', 'Barbara Clark', 'Biotech Innovation Fair', 'Rejected', 'http://example.com/paper14', '2024-06-15', 14),
('Autonomous Vehicles', 'Prof. Perez', 'William Robinson', 'Autonomous Vehicle Conf.', 'Published', 'http://example.com/paper15', '2024-07-20', 15),
('Ethics in AI', 'Prof. Thompson', 'Elizabeth Walker', 'AI Ethics Symposium', 'In Review', 'http://example.com/paper16', '2024-08-25', 16),
('5G and Networking', 'Prof. King', 'Joseph Young', 'Networking Expo', 'Accepted', 'http://example.com/paper17', '2024-09-30', 17),
('Bioinformatics Research', 'Prof. Allen', 'Susan King', 'Bioinformatics Conf.', 'Published', 'http://example.com/paper18', '2024-10-05', 18),
('Machine Learning in Finance', 'Prof. Wright', 'Charles Hall', 'Finance Tech Summit', 'Rejected', 'http://example.com/paper19', '2024-11-10', 19),
('Environmental Data Analysis', 'Prof. Scott', 'Mary Allen', 'EnviroTech Expo', 'Accepted', 'http://example.com/paper20', '2024-12-15', 20);

UPDATE Job
SET author = (
    SELECT name
    FROM student
    WHERE student.id = Job.student_id
)
WHERE EXISTS (
    SELECT 1
    FROM student
    WHERE student.id = Job.student_id
);
SELECT *
FROM Job;
SELECT *
from Student;



-- Making connections with the profs
INSERT INTO Mapping(prof_id, student_id) VALUES (1, 1), (1, 2), (1, 5), (2, 1), (2, 4), (2, 5), (3, 7), (3, 2);


