
from pathlib import Path

stage = Path(__file__).resolve().parent.parent

sources = [
    stage / "DataImportFiles/insertTables_Manual.sql",
    stage / "mockarooFiles/insertTables_Mockaroo.sql",
    stage / "insertTables_Extra.sql",
    stage / "Programing/insertTables_Python.sql",
]

# Fix the malformed first INSERT in the existing file
python_sql = sources[-1]
s = python_sql.read_text(encoding="utf-8-sig")
needle = "-- ----------------------------------------------------------------------------INSERT INTO AttendanceRecord"

if needle in s:
    s = s.replace(
        needle,
        "-- ----------------------------------------------------------------------------\nINSERT INTO AttendanceRecord",
        1
    )
    python_sql.write_text(s, encoding="utf-8")

parts = []

for file in sources:
    if not file.is_file():
        raise FileNotFoundError(file)

    content = file.read_text(encoding="utf-8-sig").strip()

    if file == python_sql:
        if not any(
            line.startswith("INSERT INTO AttendanceRecord ")
            for line in content.splitlines()
        ):
            raise RuntimeError("Invalid AttendanceRecord SQL")

    parts.append(
        f"\n-- Source: {file.relative_to(stage)}\n"
        + content + "\n"
    )

output = stage / "insertTables.sql"
output.write_text(
    "BEGIN;\n" + "\n".join(parts) + "\nCOMMIT;\n",
    encoding="utf-8"
)

print("Created:", output)
