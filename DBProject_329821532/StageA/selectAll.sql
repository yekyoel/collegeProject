-- ============================================================================
-- Project: College Manpower & HR Management System (שלב א)
-- Institution: Jerusalem College of Technology (JCT / מכון לב)
-- Submitter ID: 329821532
-- File: selectAll.sql
-- Description: Queries to display sample data and verify total row counts
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Part 1: Row count verification for all 7 tables
-- ----------------------------------------------------------------------------
SELECT 'Department' AS Table_Name, COUNT(*) AS Total_Rows FROM Department
UNION ALL
SELECT 'TrainingCourse', COUNT(*) FROM TrainingCourse
UNION ALL
SELECT 'Employee', COUNT(*) FROM Employee
UNION ALL
SELECT 'AdministrativeStaff', COUNT(*) FROM AdministrativeStaff
UNION ALL
SELECT 'AcademicStaff', COUNT(*) FROM AcademicStaff
UNION ALL
SELECT 'AttendanceRecord', COUNT(*) FROM AttendanceRecord
UNION ALL
SELECT 'Employee_Training', COUNT(*) FROM Employee_Training;

-- ----------------------------------------------------------------------------
-- Part 2: Select all records from baseline tables
-- ----------------------------------------------------------------------------
-- 1. Departments
SELECT * FROM Department ORDER BY DepartmentID;

-- 2. Training Courses
SELECT * FROM TrainingCourse ORDER BY CourseID;

-- 3. Employees (sample first 50 rows)
SELECT * FROM Employee ORDER BY EmployeeID LIMIT 50;

-- 4. Administrative Staff
SELECT a.EmployeeID, e.FirstName, e.LastName, a.OfficeNumber, a.ManagementLevel
FROM AdministrativeStaff a
JOIN Employee e ON a.EmployeeID = e.EmployeeID
ORDER BY a.EmployeeID
LIMIT 50;

-- 5. Academic Staff
SELECT ac.EmployeeID, e.FirstName, e.LastName, ac.ResearchField, ac.TenureStatus
FROM AcademicStaff ac
JOIN Employee e ON ac.EmployeeID = e.EmployeeID
ORDER BY ac.EmployeeID
LIMIT 50;

-- 6. Attendance Records (sample 50 records)
SELECT * FROM AttendanceRecord ORDER BY EmployeeID, RecordID LIMIT 50;

-- 7. Employee Training Junction Records (sample 50 records)
SELECT et.EmployeeID, e.FirstName, e.LastName, tc.CourseName, et.CompletionDate
FROM Employee_Training et
JOIN Employee e ON et.EmployeeID = e.EmployeeID
JOIN TrainingCourse tc ON et.CourseID = tc.CourseID
ORDER BY et.EmployeeID, et.CompletionDate DESC
LIMIT 50;
