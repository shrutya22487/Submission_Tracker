-- Inserting data into Professor table (20 rows)
INSERT INTO Professor (Name, email_id) 
VALUES('Shrutya', 'shrutyachawla@gmail.com'),
('Prabal', 'prabalminotra@gmail.com'),
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
-- inserting projects
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


INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored)
VALUES
('Quantum Computing', 1, 1, 'ICML 2024', 'Submitted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-09-01', '2024-01-15', false, false ),
('Deep Learning Advances', 2, 2, 'NeurIPS 2024', 'Reviewing', 'http://linktoconference.com', 'http://linktopaper.com', '2023-10-01', '2024-02-20', false,false),
('AI in Healthcare', 3, 3, 'JMLR 2024', 'Accepted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-08-15', '2024-03-30', false, false),
('Robotics and AI', 4, 4, 'CVPR 2024', 'Drafting', 'http://linktoconference.com', 'http://linktopaper.com', '2023-07-01', '2024-04-25', false, true),
('NLP Fundamentals', 5, 5, 'ACL 2024', 'Rejected', 'http://linktoconference.com', 'http://linktopaper.com', '2023-06-20', '2024-05-18', false, true),
('Blockchain Technology', 6, 6, 'Crypto 2024', 'Submitted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-09-10', '2024-06-30', false, false),
('Sustainable Computing', 7, 7, 'SIGCOMM 2024', 'Reviewing', 'http://linktoconference.com', 'http://linktopaper.com', '2023-05-25', '2024-07-22', false, false),
('Data Privacy', 8, 8, 'SP 2024', 'Accepted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-11-05', '2024-08-15', false, false),
('Internet of Things', 9, 9, 'IoT Conference 2024', 'Drafting', 'http://linktoconference.com', 'http://linktopaper.com', '2023-12-01', '2024-09-10', false, false),
('Machine Learning Basics', 10, 10, 'ICLR 2024', 'Rejected', 'http://linktoconference.com', 'http://linktopaper.com', '2024-01-10', '2024-10-05', false, false);

INSERT INTO Project (title, prof_table_id, student_table_id, conference, status, link_1, link_2, submitted_date, deadline_date, archived, sponsored, paper)
VALUES
('Quantum Computing', 1, 1, 'ICML 2024', 'Submitted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-09-01', '2024-01-15', false, false , true),
('Deep Learning Advances', 2, 2, 'NeurIPS 2024', 'Reviewing', 'http://linktoconference.com', 'http://linktopaper.com', '2023-10-01', '2024-02-20', false,false , true),
('AI in Healthcare', 3, 3, 'JMLR 2024', 'Accepted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-08-15', '2024-03-30', false, false , true),
('Robotics and AI', 4, 4, 'CVPR 2024', 'Drafting', 'http://linktoconference.com', 'http://linktopaper.com', '2023-07-01', '2024-04-25', false, true , true),
('NLP Fundamentals', 5, 5, 'ACL 2024', 'Rejected', 'http://linktoconference.com', 'http://linktopaper.com', '2023-06-20', '2024-05-18', false, true , true),
('Blockchain Technology', 6, 6, 'Crypto 2024', 'Submitted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-09-10', '2024-06-30', false, false , true),
('Sustainable Computing', 7, 7, 'SIGCOMM 2024', 'Reviewing', 'http://linktoconference.com', 'http://linktopaper.com', '2023-05-25', '2024-07-22', false, false , true),
('Data Privacy', 8, 8, 'SP 2024', 'Accepted', 'http://linktoconference.com', 'http://linktopaper.com', '2023-11-05', '2024-08-15', false, false , true),
('Internet of Things', 9, 9, 'IoT Conference 2024', 'Drafting', 'http://linktoconference.com', 'http://linktopaper.com', '2023-12-01', '2024-09-10', false, false , true),
('Machine Learning Basics', 10, 10, 'ICLR 2024', 'Rejected', 'http://linktoconference.com', 'http://linktopaper.com', '2024-01-10', '2024-10-05', false, false , true);

INSERT INTO Project_profs (project_id, prof_id)
VALUES
(1, 1), (2, 1), (3, 1),
(4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10 , 1),(1, 2), (2, 2), (3, 2),
(4, 2), (5, 2), (6, 2),
(7, 2), (8, 2), (9, 2),
(10, 2);

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
(1, '2024-09-01 10:00:00', 'AI Conference 2024', 'https://aiconf2024.com'),
(1, '2024-09-15 14:00:00', 'Deep Learning Summit', 'https://deeplearningsummit.com'),
(1, '2024-10-05 09:30:00', 'NLP Workshop', 'https://nlpworkshop.com'),
(2, '2024-09-20 11:00:00', 'Data Science Symposium', 'https://datasciencesymposium.com'),
(2, '2024-10-10 15:00:00', 'Big Data Expo', 'https://bigdataexpo.com'),
(2, '2024-11-01 13:00:00', 'Quantum Computing Forum', 'https://quantumforum.com'),
(1, '2024-08-28 08:45:00', 'Cloud Computing Conference', 'https://cloudcomputingconf.com'),
(1, '2024-09-12 10:15:00', 'Blockchain Seminar', 'https://blockchainseminar.com'),
(1, '2024-09-30 16:00:00', 'Edge AI Conference', 'https://edgeaiconference.com'),
(2, '2024-08-30 09:00:00', 'Robotics Conference', 'https://roboticsconf.com'),
(2, '2024-09-25 14:30:00', 'Autonomous Systems Expo', 'https://autonomousexpo.com'),
(2, '2024-10-12 11:45:00', 'Smart Cities Conference', 'https://smartcitiesconference.com');

INSERT INTO conferences_student (student_id, date, title, link)
VALUES
(1, '2024-09-01 10:00:00', 'AI Conference 2024', 'https://aiconf2024.com'),
(1, '2024-09-15 14:00:00', 'Deep Learning Summit', 'https://deeplearningsummit.com'),
(1, '2024-10-05 09:30:00', 'NLP Workshop', 'https://nlpworkshop.com'),
(2, '2024-09-20 11:00:00', 'Data Science Symposium', 'https://datasciencesymposium.com'),
(2, '2024-10-10 15:00:00', 'Big Data Expo', 'https://bigdataexpo.com'),
(2, '2024-11-01 13:00:00', 'Quantum Computing Forum', 'https://quantumforum.com'),
(1, '2024-08-28 08:45:00', 'Cloud Computing Conference', 'https://cloudcomputingconf.com'),
(1, '2024-09-12 10:15:00', 'Blockchain Seminar', 'https://blockchainseminar.com'),
(1, '2024-09-30 16:00:00', 'Edge AI Conference', 'https://edgeaiconference.com'),
(2, '2024-08-30 09:00:00', 'Robotics Conference', 'https://roboticsconf.com'),
(2, '2024-09-25 14:30:00', 'Autonomous Systems Expo', 'https://autonomousexpo.com'),
(2, '2024-10-12 11:45:00', 'Smart Cities Conference', 'https://smartcitiesconference.com');


INSERT INTO deadlines (prof_id, task, date) VALUES
(1, 'Review student research papers', '2024-10-31'),
(1, 'Submit grant proposal', '2024-11-15'),
(1, 'Prepare conference presentation', '2024-11-05'),
(2, 'Grade final exams', '2024-12-10'),
(2, 'Update course materials', '2024-11-22'),
(2, 'Hold faculty meeting', '2024-10-25'),
(1, 'Organize workshop on AI', '2024-11-30'),
(1, 'Submit journal article', '2024-11-10'),
(2, 'Meet PhD students for progress review', '2024-12-05'),
(2, 'Prepare budget report for research project', '2024-10-28');

INSERT INTO todos (prof_id, task, date) VALUES
(1, 'Prepare lecture slides for next week', '2024-10-28'),
(1, 'Finalize project report for students', '2024-11-01'),
(1, 'Schedule meeting with research team', '2024-10-25'),
(2, 'Update course syllabus for next semester', '2024-11-10'),
(2, 'Conduct final exams for undergraduate students', '2024-12-05'),
(2, 'Review applications for teaching assistant positions', '2024-11-15'),
(3, 'Organize guest lecture on machine learning', '2024-11-20'),
(3, 'Draft proposal for summer research internship', '2024-12-01'),
(4, 'Evaluate student projects and provide feedback', '2024-10-30'),
(4, 'Plan curriculum for the new academic year', '2024-11-25');

INSERT INTO reading_list (title, genre, prof_id, conference, status, link_1, link_2) VALUES
('Artificial Intelligence: A Modern Approach', 'Artificial Intelligence', 1, 'AI Conference 2024', 'Read', 'https://example.com/ai_modern_approach', 'https://example.com/ai_modern_approach_extra'),
('Deep Learning', 'Machine Learning', 1, 'NeurIPS 2024', 'In Progress', 'https://example.com/deep_learning', 'https://example.com/deep_learning_extra'),
('Computer Vision: Algorithms and Applications', 'Computer Vision', 1, 'CVPR 2023', 'To Read', 'https://example.com/computer_vision', ''),
('Data Mining: Concepts and Techniques', 'Data Science', 2, 'KDD 2022', 'Read', 'https://example.com/data_mining', ''),
('Introduction to Algorithms', 'Algorithms', 2, 'ALGO Conference 2024', 'Read', 'https://example.com/intro_to_algorithms', ''),
('Pattern Recognition and Machine Learning', 'Machine Learning', 2, 'ML Summit 2023', 'In Progress', 'https://example.com/pattern_recognition', ''),
('The Elements of Statistical Learning', 'Statistics', 1, 'STATCONF 2023', 'To Read', 'https://example.com/elements_of_stat_learning', 'https://example.com/stat_learning_extra'),
('Reinforcement Learning: An Introduction', 'Machine Learning', 2, 'RL Conference 2024', 'In Progress', 'https://example.com/reinforcement_learning', ''),
('Convex Optimization', 'Optimization', 1, 'OPTCONF 2024', 'Read', 'https://example.com/convex_optimization', ''),
('Bayesian Data Analysis', 'Statistics', 2, 'Bayesian Conference 2023', 'To Read', 'https://example.com/bayesian_data_analysis', 'https://example.com/bayesian_extra'),
('Graph Algorithms', 'Algorithms', 1, 'ALGO Conference 2024', 'Read', 'https://example.com/graph_algorithms', ''),
('Natural Language Processing with Transformers', 'Natural Language Processing', 2, 'NLP Summit 2024', 'In Progress', 'https://example.com/nlp_transformers', 'https://example.com/nlp_extra'),
('Theoretical Neuroscience', 'Neuroscience', 1, 'NEURO Conference 2023', 'To Read', 'https://example.com/theoretical_neuroscience', ''),
('Neural Networks and Deep Learning', 'Artificial Intelligence', 2, 'AI Conference 2023', 'Read', 'https://example.com/neural_networks', 'https://example.com/nn_extra'),
('Quantum Computing for Computer Scientists', 'Quantum Computing', 1, 'Quantum Summit 2024', 'In Progress', 'https://example.com/quantum_computing', ''),
('Distributed Systems', 'Distributed Computing', 2, 'DistComp Conference 2024', 'Read', 'https://example.com/distributed_systems', 'https://example.com/dist_sys_extra'),
('Advanced Programming in the UNIX Environment', 'Operating Systems', 2, 'UNIX Conference 2023', 'To Read', 'https://example.com/unix_programming', ''),
('Parallel Computing', 'High Performance Computing', 1, 'HPC Conference 2024', 'In Progress', 'https://example.com/parallel_computing', ''),
('Introduction to Cryptography', 'Cryptography', 1, 'Crypto Conference 2023', 'Read', 'https://example.com/intro_to_crypto', 'https://example.com/crypto_extra'),
('Blockchain: Blueprint for a New Economy', 'Blockchain', 1, 'Blockchain Summit 2024', 'To Read', 'https://example.com/blockchain', '');

-- INSERT INTO admin(name, email_id) VALUES ('Prabal','prabalminotra@gmail.com'), ('Shrutya','shrutyachawla@gmail.com');
