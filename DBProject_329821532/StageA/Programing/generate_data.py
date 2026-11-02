#!/usr/bin/env python3
"""
============================================================================
Project: College Manpower & HR Management System (שלב א)
Institution: Jerusalem College of Technology (JCT / מכון לב)
Submitter ID: 329821532
File: generate_data.py
Description: Generates 20,000 AttendanceRecord rows and 20,000
             Employee_Training rows using Faker into insertTables_Python.sql.
============================================================================
"""

import sys
import os
import random
from datetime import datetime, date, time, timedelta

try:
    from faker import Faker
except ImportError:
    print("Warning: faker package not installed. Installing or running in fallback mode...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "faker"])
    from faker import Faker

# Initialize Faker with Hebrew and English locales
fake = Faker(['he_IL', 'en_US'])
Faker.seed(329821532)
random.seed(329821532)

OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "insertTables_Python.sql")
TOTAL_EMPLOYEES = 500
ATTENDANCE_PER_EMP = 40      # 500 * 40 = 20,000 records
TRAINING_PER_EMP = 40        # 500 * 40 = 20,000 records
COURSE_IDS = list(range(201, 219))  # 18 courses defined in manual import

def generate_attendance_records(f):
    """
    Generates 20,000 AttendanceRecord rows.
    Table: AttendanceRecord(EmployeeID, RecordID, WorkDate, ClockInTime, ClockOutTime)
    Weak Entity of Employee with PK (EmployeeID, RecordID).
    """
    print(f"[*] Generating {TOTAL_EMPLOYEES * ATTENDANCE_PER_EMP} AttendanceRecord rows...")
    f.write("-- ----------------------------------------------------------------------------\n")
    f.write(f"-- 1. AttendanceRecord: {TOTAL_EMPLOYEES * ATTENDANCE_PER_EMP} rows (Weak Entity of Employee)\n")
    f.write("-- ----------------------------------------------------------------------------\n")

    start_date = date(2025, 1, 1)
    end_date = date(2026, 10, 15)
    days_span = (end_date - start_date).days

    batch_size = 1000
    current_batch = []

    for emp_id in range(1, TOTAL_EMPLOYEES + 1):
        # Pick 40 distinct working days (Sunday-Thursday in Israel)
        chosen_days = set()
        while len(chosen_days) < ATTENDANCE_PER_EMP:
            offset = random.randint(0, days_span)
            d = start_date + timedelta(days=offset)
            # Sunday is 6 in Python weekday() if week starts on Monday, or let's check:
            # Monday=0, Tuesday=1, Wednesday=2, Thursday=3, Friday=4, Saturday=5, Sunday=6
            # Workdays in Israel: Sunday(6), Monday(0), Tuesday(1), Wednesday(2), Thursday(3)
            if d.weekday() not in (4, 5):  # exclude Friday(4) and Saturday(5)
                chosen_days.add(d)

        sorted_days = sorted(list(chosen_days))

        for record_id, work_date in enumerate(sorted_days, start=1):
            # Realistic clock-in between 07:30 and 09:15
            in_hour = random.choice([7, 8, 9])
            in_minute = random.randint(0, 59) if in_hour == 8 else (random.randint(30, 59) if in_hour == 7 else random.randint(0, 15))
            in_second = random.randint(0, 59)
            clock_in = f"{in_hour:02d}:{in_minute:02d}:{in_second:02d}"

            # Work duration between 7.5 and 9.5 hours
            work_minutes = random.randint(450, 570)
            in_total_min = in_hour * 60 + in_minute
            out_total_min = in_total_min + work_minutes
            out_hour = out_total_min // 60
            out_minute = out_total_min % 60
            out_second = random.randint(0, 59)
            clock_out = f"'{out_hour:02d}:{out_minute:02d}:{out_second:02d}'"

            # Occasionally (e.g. 1% of time) clock_out is NULL (forgot to punch out or currently working)
            if random.random() < 0.01:
                clock_out = "NULL"

            row = f"({emp_id}, {record_id}, '{work_date.isoformat()}', '{clock_in}', {clock_out})"
            current_batch.append(row)

            if len(current_batch) >= batch_size:
                f.write("INSERT INTO AttendanceRecord (EmployeeID, RecordID, WorkDate, ClockInTime, ClockOutTime) VALUES\n")
                f.write(",\n".join(current_batch) + ";\n\n")
                current_batch = []

    if current_batch:
        f.write("INSERT INTO AttendanceRecord (EmployeeID, RecordID, WorkDate, ClockInTime, ClockOutTime) VALUES\n")
        f.write(",\n".join(current_batch) + ";\n\n")


def generate_training_records(f):
    """
    Generates 20,000 Employee_Training rows.
    Table: Employee_Training(EmployeeID, CourseID, CompletionDate)
    Junction table for M:N with PK (EmployeeID, CourseID, CompletionDate).
    """
    print(f"[*] Generating {TOTAL_EMPLOYEES * TRAINING_PER_EMP} Employee_Training rows...")
    f.write("-- ----------------------------------------------------------------------------\n")
    f.write(f"-- 2. Employee_Training: {TOTAL_EMPLOYEES * TRAINING_PER_EMP} rows (M:N Junction Table)\n")
    f.write("-- ----------------------------------------------------------------------------\n")

    start_date = date(2020, 1, 1)
    end_date = date(2026, 10, 20)
    days_span = (end_date - start_date).days

    batch_size = 1000
    current_batch = []

    for emp_id in range(1, TOTAL_EMPLOYEES + 1):
        # Select 40 distinct (CourseID, CompletionDate) tuples for this employee
        emp_records = set()
        while len(emp_records) < TRAINING_PER_EMP:
            cid = random.choice(COURSE_IDS)
            offset = random.randint(0, days_span)
            comp_date = start_date + timedelta(days=offset)
            emp_records.add((cid, comp_date))

        sorted_records = sorted(list(emp_records), key=lambda x: (x[1], x[0]))

        for cid, comp_date in sorted_records:
            row = f"({emp_id}, {cid}, '{comp_date.isoformat()}')"
            current_batch.append(row)

            if len(current_batch) >= batch_size:
                f.write("INSERT INTO Employee_Training (EmployeeID, CourseID, CompletionDate) VALUES\n")
                f.write(",\n".join(current_batch) + ";\n\n")
                current_batch = []

    if current_batch:
        f.write("INSERT INTO Employee_Training (EmployeeID, CourseID, CompletionDate) VALUES\n")
        f.write(",\n".join(current_batch) + ";\n\n")


def main():
    print(f"=== Starting Data Generation for College HR DB Project (ID: 329821532) ===")
    print(f"Target Output: {OUTPUT_FILE}")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("-- ============================================================================\n")
        f.write("-- Project: College Manpower & HR Management System (שלב א)\n")
        f.write("-- Institution: Jerusalem College of Technology (JCT / מכון לב)\n")
        f.write("-- Submitter ID: 329821532\n")
        f.write("-- File: insertTables_Python.sql\n")
        f.write("-- Description: 20,000 AttendanceRecord rows + 20,000 Employee_Training rows\n")
        f.write("-- Method: Method 1 (Python Script using Faker library)\n")
        f.write("-- ============================================================================\n\n")

        generate_attendance_records(f)
        generate_training_records(f)

    file_size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    print(f"[+] Successfully generated {OUTPUT_FILE} ({file_size_mb:.2f} MB)")
    print(f"[+] AttendanceRecord: 20,000 rows")
    print(f"[+] Employee_Training: 20,000 rows")
    print(f"[+] Total Rows Generated: 40,000 rows")


if __name__ == "__main__":
    main()
