
-- Extra data for Stage A

-- 470 additional departments: 12 + 470 = 500
INSERT INTO Department (DepartmentID, DepartmentName, Budget)
SELECT n, 'Simulated Department ' || n,
       (1000000 + n * 100)::numeric(12,2)
FROM generate_series(113, 582) AS t(n);

-- 482 additional training courses: 18 + 482 = 500
INSERT INTO TrainingCourse (CourseID, CourseName, ProviderName)
SELECT n, 'Simulated Workshop ' || n, 'College Training Center'
FROM generate_series(219, 700) AS t(n);

-- 500 additional employees: 500 + 500 = 1000
INSERT INTO Employee
(EmployeeID, FirstName, LastName, ID_Number,
 HireDate, BaseSalary, DepartmentID, EmployeeType)
SELECT n,
       'Employee',
       'Test' || n,
       '329' || lpad(n::text, 6, '0'),
       DATE '2020-01-01' + (n % 1500),
       (12000 + (n % 100) * 90)::numeric(10,2),
       101 + ((n - 501) % 482),
       CASE WHEN n <= 750 THEN 'Administrative'
            ELSE 'Academic' END
FROM generate_series(501, 1000) AS t(n);

-- 250 additional administrative staff
INSERT INTO AdministrativeStaff
(EmployeeID, OfficeNumber, ManagementLevel)
SELECT n, 'Office-' || n,
       CASE (n % 4)
         WHEN 0 THEN 'Junior'
         WHEN 1 THEN 'Mid'
         WHEN 2 THEN 'Senior'
         ELSE 'Director'
       END
FROM generate_series(501, 750) AS t(n);

-- 250 additional academic staff
INSERT INTO AcademicStaff
(EmployeeID, ResearchField, TenureStatus)
SELECT n,
       CASE (n % 3)
         WHEN 0 THEN 'Software Engineering'
         WHEN 1 THEN 'Electrical Engineering'
         ELSE 'Computer Science'
       END,
       CASE WHEN n % 2 = 0 THEN 'Tenured'
            ELSE 'Adjunct' END
FROM generate_series(751, 1000) AS t(n);
