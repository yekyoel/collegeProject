-- ============================================================================
-- Project: College Manpower & HR Management System (שלב א)
-- Institution: Jerusalem College of Technology (JCT / מכון לב)
-- Submitter ID: 329821532
-- File: createTables.sql
-- Description: 3NF Relational Database Schema Creation Script
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table 1: Department (מחלקות המכללה)
-- Represents college academic and administrative departments (1:N with Employee).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Department (
    DepartmentID INT PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL UNIQUE,
    Budget NUMERIC(12, 2) NOT NULL,
    CONSTRAINT chk_department_budget CHECK (Budget >= 0)
);

-- ----------------------------------------------------------------------------
-- Table 2: TrainingCourse (קורסי הדרכה והשתלמות)
-- Catalog of professional training, pedagogical seminars, and safety courses.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS TrainingCourse (
    CourseID INT PRIMARY KEY,
    CourseName VARCHAR(150) NOT NULL UNIQUE,
    ProviderName VARCHAR(100) NOT NULL
);

-- ----------------------------------------------------------------------------
-- Table 3: Employee (Supertype - עובדי המכללה)
-- General employee entity containing common attributes for all college personnel.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Employee (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    ID_Number VARCHAR(9) NOT NULL UNIQUE,
    HireDate DATE NOT NULL,
    BaseSalary NUMERIC(10, 2) NOT NULL,
    DepartmentID INT NOT NULL,
    EmployeeType VARCHAR(20) NOT NULL,
    CONSTRAINT fk_employee_department FOREIGN KEY (DepartmentID)
        REFERENCES Department (DepartmentID)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_employee_id_number CHECK (LENGTH(ID_Number) = 9),
    CONSTRAINT chk_employee_hire_date CHECK (HireDate <= CURRENT_DATE),
    CONSTRAINT chk_employee_salary CHECK (BaseSalary >= 0),
    CONSTRAINT chk_employee_type CHECK (EmployeeType IN ('Administrative', 'Academic'))
);

-- ----------------------------------------------------------------------------
-- Table 4: AdministrativeStaff (Subtype of Employee - סגל מנהלי)
-- Specialized subtype entity for administrative, operational, and office staff.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS AdministrativeStaff (
    EmployeeID INT PRIMARY KEY,
    OfficeNumber VARCHAR(50) NOT NULL,
    ManagementLevel VARCHAR(30) NOT NULL,
    CONSTRAINT fk_admin_employee FOREIGN KEY (EmployeeID)
        REFERENCES Employee (EmployeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_admin_mgmt_level CHECK (
        ManagementLevel IN ('Entry', 'Junior', 'Mid', 'Senior', 'Director', 'Head of Administration')
    )
);

-- ----------------------------------------------------------------------------
-- Table 5: AcademicStaff (Subtype of Employee - סגל אקדמי)
-- Specialized subtype entity for faculty, lecturers, researchers, and lab heads.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS AcademicStaff (
    EmployeeID INT PRIMARY KEY,
    ResearchField VARCHAR(100) NOT NULL,
    TenureStatus VARCHAR(20) NOT NULL,
    CONSTRAINT fk_academic_employee FOREIGN KEY (EmployeeID)
        REFERENCES Employee (EmployeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_academic_tenure CHECK (
        TenureStatus IN ('Tenured', 'Tenure-Track', 'Adjunct', 'Visiting Professor', 'Emeritus')
    )
);

-- ----------------------------------------------------------------------------
-- Table 6: AttendanceRecord (Weak Entity of Employee - דיווחי נוכחות)
-- Weak entity dependent on Employee. Represents daily clock-in / clock-out times.
-- Composite Primary Key: (EmployeeID, RecordID)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS AttendanceRecord (
    EmployeeID INT NOT NULL,
    RecordID INT NOT NULL,
    WorkDate DATE NOT NULL,
    ClockInTime TIME NOT NULL,
    ClockOutTime TIME,
    CONSTRAINT pk_attendance PRIMARY KEY (EmployeeID, RecordID),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (EmployeeID)
        REFERENCES Employee (EmployeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_attendance_date CHECK (WorkDate <= CURRENT_DATE),
    CONSTRAINT chk_attendance_times CHECK (ClockOutTime IS NULL OR ClockOutTime >= ClockInTime)
);

-- ----------------------------------------------------------------------------
-- Table 7: Employee_Training (M:N Junction Table - השתלמויות עובדים)
-- Associative entity modeling many-to-many relationship between Employees and Courses.
-- Composite Primary Key: (EmployeeID, CourseID, CompletionDate)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Employee_Training (
    EmployeeID INT NOT NULL,
    CourseID INT NOT NULL,
    CompletionDate DATE NOT NULL,
    CONSTRAINT pk_employee_training PRIMARY KEY (EmployeeID, CourseID, CompletionDate),
    CONSTRAINT fk_et_employee FOREIGN KEY (EmployeeID)
        REFERENCES Employee (EmployeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_et_course FOREIGN KEY (CourseID)
        REFERENCES TrainingCourse (CourseID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_et_completion_date CHECK (CompletionDate <= CURRENT_DATE)
);