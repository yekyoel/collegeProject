# Data Dictionary
## College Manpower & HR Management System (JCT)
**Submitter ID:** 329821532  
**Stage:** Stage A  
**Date:** 2026-11-02  

---

### Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Entity-Relationship (ER) Summary](#2-entity-relationship-er-summary)
3. [Detailed Table Specifications](#3-detailed-table-specifications)
   - [Table 1: Department](#table-1-department)
   - [Table 2: TrainingCourse](#table-2-trainingcourse)
   - [Table 3: Employee (Supertype)](#table-3-employee-supertype)
   - [Table 4: AdministrativeStaff (Subtype)](#table-4-administrativestaff-subtype)
   - [Table 5: AcademicStaff (Subtype)](#table-5-academicstaff-subtype)
   - [Table 6: AttendanceRecord (Weak Entity)](#table-6-attendancerecord-weak-entity)
   - [Table 7: Employee_Training (M:N Junction Table)](#table-7-employee_training-mn-junction-table)
4. [Third Normal Form (3NF) Justification](#4-third-normal-form-3nf-justification)
5. [Business Rules & Integrity Constraints](#5-business-rules--integrity-constraints)

---

### 1. System Overview & Architecture
The **College Manpower & Human Resources (HR) Management System** is a normalized relational database designed to track, manage, and optimize all aspects of college personnel at the **Jerusalem College of Technology (JCT)**.

The system encompasses:
- **Staff Hierarchy:** A distinct partition between academic faculty (professors, lecturers, researchers) and administrative staff (department coordinators, operations, finance, IT, HR).
- **Academic and Administrative Departments:** Tracking department budgets, headcount, and organizational hierarchy.
- **Daily Attendance Tracking:** Fine-grained monitoring of clock-in and clock-out timestamps for all college personnel (modeled as a weak entity dependent on Employee).
- **Professional Development & Seminars:** Full tracking of seminars, safety workshops, and pedagogical training completed by staff members (modeled via a many-to-many junction entity).

All entities are strictly normalized to **Third Normal Form (3NF)** to eliminate data redundancy, prevent update/insertion/deletion anomalies, and guarantee high data integrity.

---

### 2. Entity-Relationship (ER) Summary

| Table Name | Entity Category | Primary Key (PK) | Relationship & Cardinality | Expected Population |
| :--- | :--- | :--- | :--- | :--- |
| **Department** | Strong / Lookup | DepartmentID | 1:N with Employee | 12 (Manual import) |
| **TrainingCourse** | Strong / Lookup | CourseID | 1:N with Employee_Training | 18 (Manual import) |
| **Employee** | Supertype Entity | EmployeeID | N:1 with Department; 1:1 with Subtypes | 500 (Mockaroo) |
| **AdministrativeStaff** | Subtype Entity | EmployeeID | 1:1 with Employee (Inheritance) | 250 (Mockaroo) |
| **AcademicStaff** | Subtype Entity | EmployeeID | 1:1 with Employee (Inheritance) | 250 (Mockaroo) |
| **AttendanceRecord** | Weak Entity | (EmployeeID, RecordID) | N:1 with Employee (Existence-dependent) | 20,000 (Python Faker) |
| **Employee_Training** | Junction Entity (M:N) | (EmployeeID, CourseID, CompletionDate) | N:1 with Employee, N:1 with TrainingCourse | 20,000 (Python Faker) |

---

### 3. Detailed Table Specifications

#### Table 1: Department
- **Description:** Stores college academic and operational departments (e.g., Software Engineering, Computer Science, Human Resources, Finance).
- **Primary Key:** DepartmentID
- **Foreign Keys:** None

| Column Name | Data Type | Constraints | Description | Sample Value |
| :--- | :--- | :--- | :--- | :--- |
| DepartmentID | INT | PRIMARY KEY, NOT NULL | Unique identifier for each department | 101 |
| DepartmentName | VARCHAR(100) | NOT NULL, UNIQUE | Official department title | 'Software Engineering' |
| Budget | NUMERIC(12, 2) | NOT NULL, CHECK (Budget >= 0) | Annual allocated operating budget | 4500000.00 |

---

#### Table 2: TrainingCourse
- **Description:** Catalog of professional, pedagogical, safety, and technological seminars available to college personnel.
- **Primary Key:** CourseID
- **Foreign Keys:** None

| Column Name | Data Type | Constraints | Description | Sample Value |
| :--- | :--- | :--- | :--- | :--- |
| CourseID | INT | PRIMARY KEY, NOT NULL | Unique course catalog identifier | 201 |
| CourseName | VARCHAR(150) | NOT NULL, UNIQUE | Full title of the course/workshop | 'Pedagogical Innovation & Active Teaching' |
| ProviderName | VARCHAR(100) | NOT NULL | Internal unit or external training vendor | 'Center for Teaching Excellence' |

---

#### Table 3: Employee (Supertype)
- **Description:** Supertype table containing core personal, financial, and organizational data shared by all college personnel.
- **Primary Key:** EmployeeID
- **Foreign Keys:** DepartmentID -> Department(DepartmentID) ON DELETE RESTRICT ON UPDATE CASCADE

| Column Name | Data Type | Constraints | Description | Sample Value |
| :--- | :--- | :--- | :--- | :--- |
| EmployeeID | INT | PRIMARY KEY, NOT NULL | Unique college employee serial identifier | 1 |
| FirstName | VARCHAR(50) | NOT NULL | Employee given name | 'Mary' |
| LastName | VARCHAR(50) | NOT NULL | Employee family name | 'Hughes' |
| ID_Number | VARCHAR(9) | NOT NULL, UNIQUE, CHECK (LENGTH = 9) | National identity number (9 digits) | '329000001' |
| HireDate | DATE | NOT NULL, CHECK (HireDate <= CURRENT_DATE) | Date of employment commencement | '2021-05-24' |
| BaseSalary | NUMERIC(10, 2) | NOT NULL, CHECK (BaseSalary >= 0) | Monthly base gross salary | 39267.15 |
| DepartmentID | INT | NOT NULL, FK -> Department | Foreign key linking to Department | 107 |
| EmployeeType | VARCHAR(20) | NOT NULL, CHECK IN ('Administrative', 'Academic') | Subtype discriminator flag | 'Administrative' |

---

#### Table 4: AdministrativeStaff (Subtype)
- **Description:** Specialized subtype table storing operational attributes exclusive to administrative and logistical personnel.
- **Primary Key:** EmployeeID (also Foreign Key referencing Employee.EmployeeID)
- **Foreign Keys:** EmployeeID -> Employee(EmployeeID) ON DELETE CASCADE ON UPDATE CASCADE

| Column Name | Data Type | Constraints | Description | Sample Value |
| :--- | :--- | :--- | :--- | :--- |
| EmployeeID | INT | PRIMARY KEY, FK -> Employee | Links 1:1 to Employee supertype | 1 |
| OfficeNumber | VARCHAR(50) | NOT NULL | Campus building and room designation | 'Shalom-Rm388' |
| ManagementLevel | VARCHAR(30) | NOT NULL, CHECK (ManagementLevel IN ('Entry', 'Junior', 'Mid', 'Senior', 'Director', 'Head of Administration')) | Seniority tier within administrative hierarchy | 'Junior' |

---

#### Table 5: AcademicStaff (Subtype)
- **Description:** Specialized subtype table storing academic, teaching, and research attributes exclusive to faculty members.
- **Primary Key:** EmployeeID (also Foreign Key referencing Employee.EmployeeID)
- **Foreign Keys:** EmployeeID -> Employee(EmployeeID) ON DELETE CASCADE ON UPDATE CASCADE

| Column Name | Data Type | Constraints | Description | Sample Value |
| :--- | :--- | :--- | :--- | :--- |
| EmployeeID | INT | PRIMARY KEY, FK -> Employee | Links 1:1 to Employee supertype | 251 |
| ResearchField | VARCHAR(100) | NOT NULL | Primary academic discipline / lab focus | 'Algorithms and Artificial Intelligence' |
| TenureStatus | VARCHAR(20) | NOT NULL, CHECK (TenureStatus IN ('Tenured', 'Tenure-Track', 'Adjunct', 'Visiting Professor', 'Emeritus')) | Official academic employment status | 'Tenured' |

---

#### Table 6: AttendanceRecord (Weak Entity)
- **Description:** Daily clock-in and clock-out logs. Existence-dependent on Employee (weak entity).
- **Composite Primary Key:** (EmployeeID, RecordID)
- **Foreign Keys:** EmployeeID -> Employee(EmployeeID) ON DELETE CASCADE ON UPDATE CASCADE

| Column Name | Data Type | Constraints | Description | Sample Value |
| :--- | :--- | :--- | :--- | :--- |
| EmployeeID | INT | NOT NULL, PK, FK -> Employee | Identifier of the employee punching clock | 1 |
| RecordID | INT | NOT NULL, PK (Discriminator) | Sequential shift counter per employee | 1 |
| WorkDate | DATE | NOT NULL, CHECK (WorkDate <= CURRENT_DATE) | Date shift was performed | '2025-01-05' |
| ClockInTime | TIME | NOT NULL | Time of arrival | '08:15:30' |
| ClockOutTime | TIME | CHECK (ClockOutTime IS NULL OR ClockOutTime >= ClockInTime) | Time of departure (NULL if ongoing) | '17:05:45' |

---

#### Table 7: Employee_Training (M:N Junction Table)
- **Description:** Associative junction table resolving the many-to-many relationship between employees and completed training courses.
- **Composite Primary Key:** (EmployeeID, CourseID, CompletionDate)
- **Foreign Keys:**
  - EmployeeID -> Employee(EmployeeID) ON DELETE CASCADE ON UPDATE CASCADE
  - CourseID -> TrainingCourse(CourseID) ON DELETE CASCADE ON UPDATE CASCADE

| Column Name | Data Type | Constraints | Description | Sample Value |
| :--- | :--- | :--- | :--- | :--- |
| EmployeeID | INT | NOT NULL, PK, FK -> Employee | Employee who completed the training | 1 |
| CourseID | INT | NOT NULL, PK, FK -> TrainingCourse | Training course completed | 201 |
| CompletionDate | DATE | NOT NULL, PK, CHECK (CompletionDate <= CURRENT_DATE) | Official date of completion / certification | '2024-06-12' |

---

### 4. Third Normal Form (3NF) Justification

The schema strictly satisfies all criteria for 1NF, 2NF, and 3NF:

1. **First Normal Form (1NF):**
   - **Atomic Attributes:** Every column stores indivisible, single-valued entries (e.g., first and last names are stored separately; dates and times are kept in dedicated standard SQL types).
   - **Defined Keys:** Every table has a clearly defined unique primary key (simple or composite).
   - **No Repeating Groups:** Multi-valued facts (such as multiple shifts or multiple course completions) are decoupled into distinct tables (AttendanceRecord, Employee_Training) rather than comma-separated lists or array columns.

2. **Second Normal Form (2NF):**
   - The schema is in 1NF.
   - For all composite-key tables (AttendanceRecord and Employee_Training), every non-key column is fully functionally dependent on the **entire** composite key:
     - In AttendanceRecord, WorkDate, ClockInTime, and ClockOutTime depend on the specific shift (EmployeeID, RecordID).
     - In Employee_Training, all attributes form the primary key (EmployeeID, CourseID, CompletionDate), precluding any partial key dependencies.

3. **Third Normal Form (3NF):**
   - The schema is in 2NF.
   - There are **no transitive dependencies** ( \rightarrow Y \rightarrow Z$) between non-prime attributes:
     - Department budget depends solely on DepartmentID and is isolated in the Department table (not duplicated on Employee).
     - Course provider depends solely on CourseID and is isolated in TrainingCourse.
     - Subtype-specific fields (OfficeNumber, ManagementLevel, ResearchField, TenureStatus) are decoupled into Table-per-Type subtype tables, eliminating sparse NULL columns and transitive dependencies on Employee.

---

### 5. Business Rules & Integrity Constraints

1. **Entity Integrity:**
   - Every primary key is explicitly enforced as PRIMARY KEY, guaranteeing NOT NULL and UNIQUE properties across all tables.
2. **Referential Integrity:**
   - Deleting an Employee safely cascades (ON DELETE CASCADE) to their attendance records, training certificates, and subtype profiles (AdministrativeStaff, AcademicStaff), preventing orphaned records.
   - Deleting a Department is restricted (ON DELETE RESTRICT) whenever active employees are assigned to it, preventing accidental organizational disconnects.
3. **Domain Constraints:**
   - National ID numbers must be exactly 9 characters long: CHECK (LENGTH(ID_Number) = 9).
   - Salaries and budgets cannot be negative: CHECK (BaseSalary >= 0), CHECK (Budget >= 0).
   - Departure time cannot precede arrival time: CHECK (ClockOutTime >= ClockInTime).
   - Historical dates (hire date, work date, course completion) cannot occur in the future: CHECK (column <= CURRENT_DATE).