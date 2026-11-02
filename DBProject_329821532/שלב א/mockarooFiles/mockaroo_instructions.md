# Mockaroo Data Generation Guide (Method 2)
## College Manpower & HR Management System (JCT)
**Submitter ID:** 329821532

---

## 1. Overview
This guide provides instructions for generating 500 realistic records using **Mockaroo** (https://www.mockaroo.com) for the following tables:
1. **Employee** (500 records, IDs 1 to 500)
2. **AdministrativeStaff** (250 records, IDs 1 to 250)
3. **AcademicStaff** (250 records, IDs 251 to 500)

The generated data adheres strictly to all 3NF schema constraints, foreign keys, and domain checks defined in createTables.sql.

---

## 2. Table Schemas & Mockaroo Configurations

### Schema 1: Employee (500 rows)
- **Table Name:** Employee
- **Rows:** 500
- **Fields:**
  - EmployeeID: Type = **Row Number**
  - FirstName: Type = **First Name**
  - LastName: Type = **Last Name**
  - ID_Number: Type = **Regular Expression**, value = 32900[0-9]{4}
  - HireDate: Type = **Date**, format = %Y-%m-%d, range = 2012-01-01 to 2026-10-01
  - BaseSalary: Type = **Number**, range = 8500.00 to 42000.00, decimals = 2
  - DepartmentID: Type = **Custom List**, values = 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112
  - EmployeeType: Type = **Formula**, formula:
    `uby
    if this <= 250 then 'Administrative' else 'Academic' end
    `

### Schema 2: AdministrativeStaff (250 rows)
- **Table Name:** AdministrativeStaff
- **Rows:** 250
- **Fields:**
  - EmployeeID: Type = **Row Number** (produces 1..250, matching the first 250 employees)
  - OfficeNumber: Type = **Template**, template = {{random('Lev','Shalom','Tech','Academic')}}-Rm{{random(101,450)}}
  - ManagementLevel: Type = **Custom List**, values:
    Entry, Junior, Mid, Senior, Director, Head of Administration

### Schema 3: AcademicStaff (250 rows)
- **Table Name:** AcademicStaff
- **Rows:** 250
- **Fields:**
  - EmployeeID: Type = **Formula**, formula: 	his + 250 (produces 251..500)
  - ResearchField: Type = **Custom List**, values include:
    - Algorithms and Artificial Intelligence
    - Quantum Computing and Information Theory
    - Electro-Optics, Lasers and Photonics
    - Biomedical Signal and Image Processing
    - Supply Chain and Operations Research
    - Genomics, Proteomics and Bioinformatics
    - Cloud Systems, Microservices and DevOps
    - Cybersecurity, Cryptography and Privacy
    - Computer Vision and Deep Learning
    - Applied Mathematics and Numerical Modeling
    - Embedded Systems and IoT Architecture
    - Nanotechnology and Advanced Materials
    - Renewable Energy and Smart Grid Systems
    - Natural Language Processing and Linguistics
    - Robotics and Autonomous Systems
    - VLSI Design and Microelectronics
  - TenureStatus: Type = **Custom List**, values:
    Tenured, Tenure-Track, Adjunct, Visiting Professor, Emeritus

---

## 3. Exporting SQL from Mockaroo
1. Select format **SQL**.
2. Uncheck **include CREATE TABLE**.
3. Download the SQL file.
4. The consolidated result is available in insertTables_Mockaroo.sql.