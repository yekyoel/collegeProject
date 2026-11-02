-- ============================================================================
-- Project: College Manpower & HR Management System
-- Institution: Jerusalem College of Technology (JCT)
-- Submitter ID: 329821532
-- File: dropTables.sql
-- Description: Drop tables script strictly ordered by reverse dependency
-- ============================================================================

-- Step 1: Drop junction / leaf tables that reference other tables
DROP TABLE IF EXISTS Employee_Training CASCADE;
DROP TABLE IF EXISTS AttendanceRecord CASCADE;

-- Step 2: Drop subtypes that reference the Employee supertype
DROP TABLE IF EXISTS AcademicStaff CASCADE;
DROP TABLE IF EXISTS AdministrativeStaff CASCADE;

-- Step 3: Drop supertype Employee table (references Department)
DROP TABLE IF EXISTS Employee CASCADE;

-- Step 4: Drop independent / parent lookup tables
DROP TABLE IF EXISTS TrainingCourse CASCADE;
DROP TABLE IF EXISTS Department CASCADE;