-- Inserting data into Professor table (20 rows)
INSERT INTO Professor (Name, email_id) 
VALUES
('Prabal', 'prabalmintora@gmail.com'),
('Shrutya', 'shrutyachawla@gmail.com'),
('Dr. Jane Smith', 'jane.smith@university.edu'),
('Dr. Emily Clark', 'emily.clark@university.edu'),
('Dr. Mark Taylor', 'mark.taylor@university.edu'),
('Dr. Olivia Brown', 'olivia.brown@university.edu'),
('Dr. William Harris', 'william.harris@university.edu'),
('Dr. Sophia Thompson', 'sophia.thompson@university.edu'),
('Dr. James White', 'james.white@university.edu'),
('Dr. Mia Martin', 'mia.martin@university.edu'),
('Dr. Daniel Lewis', 'daniel.lewis@university.edu'),
('Dr. Lucas Scott', 'lucas.scott@university.edu'),
('Dr. Isabella Walker', 'isabella.walker@university.edu'),
('Dr. Henry King', 'henry.king@university.edu'),
('Dr. Lily Lee', 'lily.lee@university.edu'),
('Dr. Elijah Allen', 'elijah.allen@university.edu'),
('Dr. Charlotte Hill', 'charlotte.hill@university.edu'),
('Dr. Michael Green', 'michael.green@university.edu'),
('Dr. Grace Adams', 'grace.adams@university.edu'),
('Dr. Benjamin Turner', 'benjamin.turner@university.edu'),
('Dr. Victoria Hall', 'victoria.hall@university.edu');

-- Inserting data into Student table (20 rows)
INSERT INTO Student (Name, email_id, type) 
VALUES 
('Shrutya Student', 'shrutya22487@iiitd.ac.in', 'B.Tech'),
('Bob Williams', 'bob.williams@university.edu', 'M.Tech'),
('Charlie Brown', 'charlie.brown@university.edu', 'PhD'),
('David Wilson', 'david.wilson@university.edu', 'M.Tech'),
('Eve Davis', 'eve.davis@university.edu', 'B.Tech'),
('Frank Miller', 'frank.miller@university.edu', 'M.Tech'),
('Grace Moore', 'grace.moore@university.edu', 'PhD'),
('Hannah Young', 'hannah.young@university.edu', 'B.Tech'),
('Ivy Robinson', 'ivy.robinson@university.edu', 'M.Tech'),
('Jack Clark', 'jack.clark@university.edu', 'PhD'),
('Kate Lewis', 'kate.lewis@university.edu', 'B.Tech'),
('Liam Martinez', 'liam.martinez@university.edu', 'M.Tech'),
('Mason Anderson', 'mason.anderson@university.edu', 'PhD'),
('Nina Thomas', 'nina.thomas@university.edu', 'B.Tech'),
('Oscar Hernandez', 'oscar.hernandez@university.edu', 'M.Tech'),
('Penny Martin', 'penny.martin@university.edu', 'PhD'),
('Quinn Hall', 'quinn.hall@university.edu', 'B.Tech'),
('Rachel Scott', 'rachel.scott@university.edu', 'M.Tech'),
('Sam King', 'sam.king@university.edu', 'PhD'),
('Tina Wright', 'tina.wright@university.edu', 'B.Tech');

-- Inserting data into Team table (20 rows)
INSERT INTO Team (prof_id, student_id, archived) 
VALUES 
(1, 1, FALSE), (1, 2, FALSE), (1, 3, FALSE),
(1, 4, FALSE), (1, 5, FALSE), (1, 6, FALSE),
(1, 7, FALSE), (1, 8, FALSE), (1, 9, FALSE),
(2, 1, FALSE), (2, 2, FALSE), (2, 3, FALSE),
(2, 4, FALSE), (2, 5, FALSE), (2, 6, FALSE),
(2, 7, FALSE), (2, 8, FALSE), (2, 9, FALSE);

INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored)
VALUES
('Quantum Computing', 1, 1, 'ICML 2024', 'Submitted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-09-01', '2024-01-15', false, true),
('Deep Learning Advances', 2, 2, 'NeurIPS 2024', 'Reviewing', 'http://linktoconference.com', 'http://linktopaper.com', '2023-10-01', '2024-02-20', false, true),
('AI in Healthcare', 3, 3, 'JMLR 2024', 'Accepted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-08-15', '2024-03-30', false, true),
('Robotics and AI', 4, 4, 'CVPR 2024', 'Drafting', 'http://linktoconference.com', 'http://linktopaper.com', '2023-07-01', '2024-04-25', false, true),
('NLP Fundamentals', 5, 5, 'ACL 2024', 'Rejected', 'http://linktoconference.com', 'http://linktopaper.com', '2023-06-20', '2024-05-18', false, true),
('Blockchain Technology', 6, 6, 'Crypto 2024', 'Submitted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-09-10', '2024-06-30', false, false),
('Sustainable Computing', 7, 7, 'SIGCOMM 2024', 'Reviewing', 'http://linktoconference.com', 'http://linktopaper.com', '2023-05-25', '2024-07-22', false, false),
('Data Privacy', 8, 8, 'SP 2024', 'Accepted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-11-05', '2024-08-15', false, false),
('Internet of Things', 9, 9, 'IoT Conference 2024', 'Drafting', 'http://linktoconference.com', 'http://linktopaper.com', '2023-12-01', '2024-09-10', false, false),
('Machine Learning Basics', 10, 10, 'ICLR 2024', 'Rejected', 'http://linktoconference.com', 'http://linktopaper.com', '2024-01-10', '2024-10-05', false, false);



INSERT INTO Project_profs (project_id, prof_id)
VALUES
(1, 1), (2, 1), (3, 1),
(4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10 , 1),(1, 2), (2, 2), (3, 2),
(4, 2), (5, 2), (6, 2),
(7, 2), (8, 2), (9, 2),
(10, 2);

-- Inserting data into Project_Students table (20 rows)
INSERT INTO Project_Students (project_id, student_id)
VALUES (1, 1), (1, 2), (1, 3),
(1, 4), (2, 5), (2, 1), (2, 2), (2, 3), (3, 1), (3 , 2),(3, 3), (4, 2), (5, 2), (5, 1), (4, 3),
(7, 6), (8, 6), (9, 8),
(10, 7);


INSERT INTO Job (project_id, prof_id, student_id, title, status, link_1, link_2, submitted_date, deadline_date, archived)
VALUES
(1, 2, 1, 'Data Analysis Task', 'In Progress', 'https://link1.com', 'https://link2.com', '2023-06-10', '2023-09-15', false),
(2, 2, 2, 'AI Research', 'Completed', 'https://link3.com', 'https://link4.com', '2023-03-11', '2023-06-01', true),
(3, 2, 3, 'Web Development', 'Not Started', 'https://link5.com', 'https://link6.com', '2023-07-20', '2023-11-01', false),
(4, 2, 4, 'Quantum Computing Study', 'In Progress', 'https://link7.com', 'https://link8.com', '2023-02-15', '2023-10-12', false),
(5, 2, 5, 'Cloud Infrastructure Setup', 'Completed', 'https://link9.com', 'https://link10.com', '2023-01-18', '2023-04-29', true),
(6, 2, 6, 'Cybersecurity Analysis', 'Not Started', 'https://link11.com', 'https://link12.com', '2023-08-08', '2023-12-15', false),
(7, 2, 7, 'Blockchain Study', 'In Progress', 'https://link13.com', 'https://link14.com', '2023-05-21', '2023-09-01', false),
(8, 2, 8, 'Mobile App Development', 'Completed', 'https://link15.com', 'https://link16.com', '2023-02-25', '2023-05-30', true),
(9, 2, 9, 'Database Optimization', 'In Progress', 'https://link17.com', 'https://link18.com', '2023-04-10', '2023-08-20', false),
(10, 2, 1, 'Game Development Project', 'Not Started', 'https://link19.com', 'https://link20.com', '2023-09-01', '2023-12-15', false),
(1, 2, 1, 'Artificial Intelligence Project', 'Completed', 'https://link21.com', 'https://link22.com', '2023-01-11', '2023-03-22', true),
(2, 2, 2, 'Big Data Analytics', 'In Progress', 'https://link23.com', 'https://link24.com', '2023-05-30', '2023-09-01', false),
(3, 2, 3, 'Machine Learning Pipeline', 'Not Started', 'https://link25.com', 'https://link26.com', '2023-07-10', '2023-11-05', false),
(4, 2, 4, 'NLP Research', 'Completed', 'https://link27.com', 'https://link28.com', '2023-02-17', '2023-06-01', true),

(1, 1, 1, 'Data Analysis Task', 'In Progress', 'https://link1.com', 'https://link2.com', '2023-06-10', '2023-09-15', false),
(2, 1, 2, 'AI Research', 'Completed', 'https://link3.com', 'https://link4.com', '2023-03-11', '2023-06-01', true),
(3, 1, 3, 'Web Development', 'Not Started', 'https://link5.com', 'https://link6.com', '2023-07-20', '2023-11-01', false),
(4, 1, 4, 'Quantum Computing Study', 'In Progress', 'https://link7.com', 'https://link8.com', '2023-02-15', '2023-10-12', false),
(5, 1, 5, 'Cloud Infrastructure Setup', 'Completed', 'https://link9.com', 'https://link10.com', '2023-01-18', '2023-04-29', true),
(6, 1, 6, 'Cybersecurity Analysis', 'Not Started', 'https://link11.com', 'https://link12.com', '2023-08-08', '2023-12-15', false),
(7, 1, 7, 'Blockchain Study', 'In Progress', 'https://link13.com', 'https://link14.com', '2023-05-21', '2023-09-01', false),
(8, 1, 8, 'Mobile App Development', 'Completed', 'https://link15.com', 'https://link16.com', '2023-02-25', '2023-05-30', true),
(9, 1, 9, 'Database Optimization', 'In Progress', 'https://link17.com', 'https://link18.com', '2023-04-10', '2023-08-20', false),
(10, 1, 1, 'Game Development Project', 'Not Started', 'https://link19.com', 'https://link20.com', '2023-09-01', '2023-12-15', false),
(1, 1, 1, 'Artificial Intelligence Project', 'Completed', 'https://link21.com', 'https://link22.com', '2023-01-11', '2023-03-22', true),
(2, 1, 2, 'Big Data Analytics', 'In Progress', 'https://link23.com', 'https://link24.com', '2023-05-30', '2023-09-01', false),
(3, 1, 3, 'Machine Learning Pipeline', 'Not Started', 'https://link25.com', 'https://link26.com', '2023-07-10', '2023-11-05', false),
(4, 1, 4, 'NLP Research', 'Completed', 'https://link27.com', 'https://link28.com', '2023-02-17', '2023-06-01', true);


INSERT INTO deadlines (deadline) VALUES
('Project Report: September 20, 2024'),
('Assignment 3 Submission: September 25, 2024');

INSERT INTO todos (task) VALUES
('Complete UDP Pinger assignment'),
('Prepare for Midterm Exam');
