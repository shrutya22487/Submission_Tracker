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
(1, 1, FALSE), (1, 2, FALSE), (2, 3, FALSE),
(2, 4, FALSE), (3, 5, FALSE), (3, 6, FALSE),
(4, 7, FALSE), (4, 8, FALSE), (5, 9, FALSE),
(5, 10, FALSE), (6, 11, FALSE), (6, 12, FALSE),
(7, 13, FALSE), (7, 14, FALSE), (8, 15, FALSE),
(8, 16, FALSE), (9, 17, FALSE), (9, 18, FALSE),
(10, 19, FALSE), (10, 20, FALSE);

-- Inserting data into Project table (20 rows)
INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored) 
VALUES 
('AI Research', 1, 1, 'AI Conference', 'Upcoming', 'link1', 'link2', '2023-08-01', '2023-12-01', FALSE, FALSE),
('Blockchain Project', 2, 2, 'Blockchain Conf', 'Under Review', 'link3', 'link4', '2023-08-05', '2023-12-10', FALSE, FALSE),
('Cybersecurity Study', 3, 3, 'Cybersec Summit', 'In Progress', 'link5', 'link6', '2023-08-09', '2023-12-15', FALSE, FALSE),
-- Continue with 17 more rows...
('Quantum Computing', 1, 3, 'Quantum Conf', 'In Progress', 'link21', 'link22', '2023-08-10', '2023-12-10', FALSE, FALSE),
('Quantum Computing', 5, 4, 'Quantum Conf', 'In Progress', 'link21', 'link22', '2023-08-10', '2023-12-10', FALSE, FALSE),
('Quantum Computing', 1, 3, 'Quantum Conf', 'In Progress', 'link21', 'link22', '2023-08-10', '2023-12-10', FALSE, FALSE);
-- More rows like the above until 20 rows are inserted.

-- Inserting data into Project_profs table (20 rows)
INSERT INTO Project_profs (project_id, prof_id)
VALUES 
(1, 1), (2, 2), (3, 3), 
(4, 1), (5, 2);

-- Inserting data into Project_Students table (20 rows)
INSERT INTO Project_Students (project_id, student_id)
VALUES (1, 3), (1, 2), (1, 1);


-- Inserting data into Job table (20 rows)
INSERT INTO Job (project_id,prof_id, student_id, title, status, link_1, link_2, submitted_date, deadline_date, archived)
VALUES 
(1,1, 2, 'Job Title 2', 'Open1', 'link1', 'link2', '2023-10-01', '2023-10-09', FALSE),
(1,2, 2, 'Job Title 2', 'Open', 'link3', 'link4', '2023-09-05', '2023-12-10', FALSE);

