#!/usr/bin/env python3
"""
============================================================================
Project: College Manpower & HR Management System
Institution: Jerusalem College of Technology (JCT)
Submitter ID: 329821532
File: generate_data.py
Description: Generates 20,000 AttendanceRecord rows and 20,000
             Employee_Training rows using Faker, writing them to
             insertTables_Python.sql in the same folder.
Method: Method 1 (Python / Faker library)
============================================================================
"""

import sys
import os
import random
from datetime import datetime, date, time, timedelta

try:
    from faker import Faker
except ImportError:
    print("Faker not found - installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "faker"])
    from faker import Faker

# Seed for reproducibility
fake = Faker("en_US")
Faker.seed(329821532)
random.seed(329821532)

OUTPUT_FILE       = os.path.join(os.path.dirname(os.path.abspath(__file__)), "insertTables_Python.sql")
TOTAL_EMPLOYEES   = 500
ATTENDANCE_TARGET = 20_000          # 500 employees * 40 days
TRAINING_TARGET   = 20_000          # 500 employees * 40 courses
RECORDS_PER_EMP   = ATTENDANCE_TARGET // TOTAL_EMPLOYEES   # 40
TRAINING_PER_EMP  = TRAINING_TARGET  // TOTAL_EMPLOYEES   # 40
COURSE_IDS        = list(range(201, 219))   # 18 courses from insertTables_Manual.sql


def generate_attendance_records(f):
    """
    Generates 20,000 AttendanceRecord rows.
    Table: AttendanceRecord(EmployeeID, RecordID, WorkDate, ClockInTime, ClockOutTime)
    Weak Entity of Employee; composite PK is (EmployeeID, RecordID).
    """
    print(f"[*] Generating {TOTAL_EMPLOYEES * RECORDS_PER_EMP:,} AttendanceRecord rows...")
    f.write("-- " + "-"*76 + "\n")
    f.write(f"-- 1. AttendanceRecord: {TOTAL_EMPLOYEES * RECORDS_PER_EMP:,} rows (Weak Entity of Employee)\n")
    f.write("-- " + "-"*76 + "\n")

    start_date = date(2025, 1, 1)
    end_date   = date(2026, 10, 15)
    days_span  = (end_date - start_date).days

    batch, batch_size = [], 1000

    for emp_id in range(1, TOTAL_EMPLOYEES + 1):
        # 40 distinct working days (Israeli week: Sun-Thu, exclude Fri=4 Sat=5)
        chosen_days = set()
        while len(chosen_days) < RECORDS_PER_EMP:
            d = start_date + timedelta(days=random.randint(0, days_span))
            if d.weekday() not in (4, 5):
                chosen_days.add(d)

        for record_id, work_date in enumerate(sorted(chosen_days), start=1):
            # Clock-in between 07:30 and 09:15
            in_hour   = random.choice([7, 8, 9])
            in_minute = (random.randint(30, 59) if in_hour == 7
                         else random.randint(0, 15) if in_hour == 9
                         else random.randint(0, 59))
            in_second = random.randint(0, 59)
            clock_in  = f"{in_hour:02d}:{in_minute:02d}:{in_second:02d}"

            # Work duration 7.5-9.5 hours
            work_min   = random.randint(450, 570)
            out_total  = in_hour * 60 + in_minute + work_min
            out_hour   = out_total // 60
            out_minute = out_total  % 60
            out_second = random.randint(0, 59)
            clock_out  = f"'{out_hour:02d}:{out_minute:02d}:{out_second:02d}'"

            # ~1% chance of NULL (forgot to clock out)
            if random.random() < 0.01:
                clock_out = "NULL"

            batch.append(
                f"({emp_id}, {record_id}, '{work_date.isoformat()}', '{clock_in}', {clock_out})"
            )

            if len(batch) >= batch_size:
                f.write("INSERT INTO AttendanceRecord "
                        "(EmployeeID, RecordID, WorkDate, ClockInTime, ClockOutTime) VALUES\n")
                f.write(",\n".join(batch) + ";\n\n")
                batch.clear()

    if batch:
        f.write("INSERT INTO AttendanceRecord "
                "(EmployeeID, RecordID, WorkDate, ClockInTime, ClockOutTime) VALUES\n")
        f.write(",\n".join(batch) + ";\n\n")


def generate_training_records(f):
    """
    Generates 20,000 Employee_Training rows.
    Table: Employee_Training(EmployeeID, CourseID, CompletionDate)
    M:N junction; composite PK is (EmployeeID, CourseID, CompletionDate).
    """
    print(f"[*] Generating {TOTAL_EMPLOYEES * TRAINING_PER_EMP:,} Employee_Training rows...")
    f.write("-- " + "-"*76 + "\n")
    f.write(f"-- 2. Employee_Training: {TOTAL_EMPLOYEES * TRAINING_PER_EMP:,} rows (M:N Junction Table)\n")
    f.write("-- " + "-"*76 + "\n")

    start_date = date(2020, 1, 1)
    end_date   = date(2026, 10, 20)
    days_span  = (end_date - start_date).days

    batch, batch_size = [], 1000

    for emp_id in range(1, TOTAL_EMPLOYEES + 1):
        # 40 distinct (CourseID, CompletionDate) pairs per employee
        records = set()
        while len(records) < TRAINING_PER_EMP:
            cid       = random.choice(COURSE_IDS)
            comp_date = start_date + timedelta(days=random.randint(0, days_span))
            records.add((cid, comp_date))

        for cid, comp_date in sorted(records, key=lambda x: (x[1], x[0])):
            batch.append(f"({emp_id}, {cid}, '{comp_date.isoformat()}')")

            if len(batch) >= batch_size:
                f.write("INSERT INTO Employee_Training "
                        "(EmployeeID, CourseID, CompletionDate) VALUES\n")
                f.write(",\n".join(batch) + ";\n\n")
                batch.clear()

    if batch:
        f.write("INSERT INTO Employee_Training "
                "(EmployeeID, CourseID, CompletionDate) VALUES\n")
        f.write(",\n".join(batch) + ";\n\n")


def main():
    print("=== College HR DB - Data Generator (ID: 329821532) ===")
    print(f"Output -> {OUTPUT_FILE}")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("-- " + "="*76 + "\n")
        f.write("-- Project: College Manpower & HR Management System\n")
        f.write("-- Institution: Jerusalem College of Technology (JCT)\n")
        f.write("-- Submitter ID: 329821532\n")
        f.write("-- File: insertTables_Python.sql\n")
        f.write("-- Description: 20,000 AttendanceRecord rows + 20,000 Employee_Training rows\n")
        f.write("-- Method: Method 1 (Python / Faker library)\n")
        f.write("-- " + "="*76 + "\n\n")

        generate_attendance_records(f)
        generate_training_records(f)

    size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    print(f"[+] Done -> {OUTPUT_FILE} ({size_mb:.2f} MB)")
    print(f"[+] AttendanceRecord : {TOTAL_EMPLOYEES * RECORDS_PER_EMP:,} rows")
    print(f"[+] Employee_Training: {TOTAL_EMPLOYEES * TRAINING_PER_EMP:,} rows")
    print(f"[+] Total            : {(TOTAL_EMPLOYEES * RECORDS_PER_EMP) + (TOTAL_EMPLOYEES * TRAINING_PER_EMP):,} rows")


if __name__ == "__main__":
    main()