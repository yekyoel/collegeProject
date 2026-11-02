-- ============================================================================
-- Project: College Manpower & HR Management System
-- Institution: Jerusalem College of Technology (JCT)
-- Submitter ID: 329821532
-- File: insertTables_Manual.sql
-- Description: Manual baseline data import for Department and TrainingCourse
-- Method: Method 3 (Manual / Direct SQL INSERTs)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Insert College Departments (12 realistic JCT departments)
-- ----------------------------------------------------------------------------
INSERT INTO Department (DepartmentID, DepartmentName, Budget) VALUES
(101, 'Software Engineering',                        4500000.00),
(102, 'Computer Science',                            5200000.00),
(103, 'Electrical Engineering & Electronics',        6800000.00),
(104, 'Industrial Engineering & Management',         3400000.00),
(105, 'Transportation & Logistics Management',        3900000.00),
(106, 'Human Resources',                             2800000.00),
(107, 'Finance & Accounting',                        1500000.00),
(108, 'Student Affairs & Admissions',                2200000.00),
(109, 'Quality Assurance & Assessment',              1800000.00),
(110, 'Research & Development Authority',            3100000.00),
(111, 'Legal & Regulatory Compliance',               1600000.00),
(112, 'Operations, Security & Maintenance',          2000000.00);

-- ----------------------------------------------------------------------------
-- 2. Insert Training Courses (18 realistic faculty and administrative courses)
-- ----------------------------------------------------------------------------
INSERT INTO TrainingCourse (CourseID, CourseName, ProviderName) VALUES
(201, 'Pedagogical Innovation & Active Teaching Methods',         'Center for Teaching Excellence'),
(202, 'Laboratory Safety & Hazardous Materials Protocol',         'Occupational Safety & Health Directorate'),
(203, 'Academic Advising & Student Retention Best Practices',     'Student Counseling & Support Center'),
(204, 'Research Ethics & Academic Integrity Compliance',          'JCT Ethics & Academic Review Board'),
(205, 'Generative AI Tools for Academic Research & Teaching',     'Google for Education & Academia'),
(206, 'Writing Competitive Research Grant Proposals (ISF, Horizon)', 'National Science Research Foundation'),
(207, 'Advanced Instructional Technologies for Hybrid Learning',  'Educational Technology Institute'),
(208, 'Project Management: Agile and Scrum Frameworks',           'Project Management Institute (PMI)'),
(209, 'Leadership & Team Management in Academic Environments',    'Executive Leadership Academy'),
(210, 'Cybersecurity Awareness & Institutional Data Protection',  'National Cyber Security Authority'),
(211, 'Advanced Data Analysis with Python and Pandas',            'Data Science & Analytics Institute'),
(212, 'Learning Management Systems Mastery (Moodle & Canvas)',    'Academic Computing Center'),
(213, 'Cloud Infrastructure & DevOps for Research (AWS / Azure)', 'Cloud Computing Center of Excellence'),
(214, 'Intellectual Property & Academic Patent Filing',           'Technology Transfer Office (TTO)'),
(215, 'Public Speaking & Research Presentation Masterclass',      'Academic Communication Center'),
(216, 'First Aid, CPR and Emergency Campus Preparedness',         'National Emergency Medical Services'),
(217, 'Full Stack Web Development & Microservices Architecture',  'Industry Software Engineering Alliance'),
(218, 'Cross-Cultural Communication in International Academia',   'International Academic Relations Office');