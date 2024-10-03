-- Inserting data into Professor table (20 rows)
INSERT INTO Professor (Name, email_id) 
VALUES
('Prabal', 'prabalminotra@gmail.com'),
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


INSERT INTO meeting_notes (project_id, prof_id, notes)
VALUES
(2, 1, 'Review of previous progress and upcoming tasks.'),
(3, 4, 'Addressed issues with data collection methodology.'),
(4, 3, 'Updated timeline for project completion.'),
(5, 2, 'Reviewed literature for related research work.'),
(1, 3, 'Brainstormed new ideas for experiment designs.'),
(2, 4, 'Clarified expectations for deliverables.'),
(3, 2, 'Scheduled next meeting and assigned tasks.'),
(4, 1, 'Refined research hypothesis based on feedback.'),
(5, 4, 'Finalized structure for research paper submission.'),
(1, 2, 'Discussed new findings and analysis techniques.'),
(2, 1, 'Reviewed previous meetings and set new goals.'),
(3, 3, 'Tested preliminary results and adjustments needed.'),
(4, 4, 'Presented findings from recent fieldwork.'),
(5, 2, 'Collaborated on potential publication ideas.'),
(1, 4, 'Scheduled presentations and prepared reports.'),
(2, 3, 'Addressed challenges in experimental design.'),
(3, 1, 'Reviewed feedback from conference submission.'),
(4, 2, 'Updated dataset and data analysis techniques.'),
(5, 3, 'Refined experimental approach based on feedback.');


INSERT INTO Conferences (prof_id, date, title, link)
VALUES
(1, '2024-09-01', 'AI Conference 2024', 'https://aiconf2024.com'),
(1, '2024-09-15', 'Deep Learning Summit', 'https://deeplearningsummit.com'),
(1, '2024-10-05', 'NLP Workshop', 'https://nlpworkshop.com'),
(2, '2024-09-20', 'Data Science Symposium', 'https://datasciencesymposium.com'),
(2, '2024-10-10', 'Big Data Expo', 'https://bigdataexpo.com'),
(2, '2024-11-01', 'Quantum Computing Forum', 'https://quantumforum.com'),
(3, '2024-08-28', 'Cloud Computing Conference', 'https://cloudcomputingconf.com'),
(3, '2024-09-12', 'Blockchain Seminar', 'https://blockchainseminar.com'),
(3, '2024-09-30', 'Edge AI Conference', 'https://edgeaiconference.com'),
(4, '2024-08-30', 'Robotics Conference', 'https://roboticsconf.com'),
(4, '2024-09-25', 'Autonomous Systems Expo', 'https://autonomousexpo.com'),
(4, '2024-10-12', 'Smart Cities Conference', 'https://smartcitiesconference.com'),
(5, '2024-08-26', 'Cybersecurity Forum', 'https://cybersecurityforum.com'),
(5, '2024-09-18', 'IoT Summit', 'https://iotsummit.com'),
(5, '2024-10-02', 'AR/VR Expo', 'https://arvrexpo.com'),
(6, '2024-08-29', 'Software Engineering Conference', 'https://softengconf.com'),
(6, '2024-09-19', 'DevOps World', 'https://devopsworld.com'),
(6, '2024-10-07', 'SaaS Symposium', 'https://saassymposium.com'),
(7, '2024-09-05', 'Green Tech Conference', 'https://greentechconference.com'),
(7, '2024-09-22', 'Energy Efficiency Expo', 'https://energyefficiencyexpo.com');
-- Inserting data into the deadlines table
INSERT INTO deadlines (prof_id, deadline) VALUES
(1, 'Submit final grades by October 5th, 2024'),
(2, 'Prepare midterm exam papers by October 10th, 2024'),
(1, 'Review research proposals by November 1st, 2024'),
(3, 'Submit conference abstracts by September 30th, 2024'),
(2, 'Complete annual report by December 15th, 2024');

INSERT INTO todos (prof_id, task)
VALUES
    (1, 'Complete assignment 1'),
    (1, 'Read machine learning article'),
    (2, 'Prepare class materials'),
    (2, 'Review random forest model'),
    (3, 'Submit research paper'),
    (3, 'Attend conference call'),
    (4, 'Update SVM model'),
    (4, 'Draft email to collaborators'),
    (5, 'Revise project proposal'),
    (5, 'Schedule team meeting');
