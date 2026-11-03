SELECT 'Department' AS table_name, COUNT(*) FROM Department
UNION ALL SELECT 'TrainingCourse', COUNT(*) FROM TrainingCourse
UNION ALL SELECT 'Employee', COUNT(*) FROM Employee
UNION ALL SELECT 'AdministrativeStaff', COUNT(*) FROM AdministrativeStaff
UNION ALL SELECT 'AcademicStaff', COUNT(*) FROM AcademicStaff
UNION ALL SELECT 'AttendanceRecord', COUNT(*) FROM AttendanceRecord
UNION ALL SELECT 'Employee_Training', COUNT(*) FROM Employee_Training;