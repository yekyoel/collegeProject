# מילון נתונים - Data Dictionary
## מערכת ניהול כוח אדם למכללה (JCT / מכון לב)
**מגיש:** 329821532  
**שלב:** שלב א'  
**תאריך:** 2026-11-02  

---

### תוכן עניינים
1. [מבוא ומטרת המערכת](#1-מבוא-ומטרת-המערכת)
2. [סקירת הישויות והקשרים (ER Overview)](#2-סקירת-הישויות-והקשרים-er-overview)
3. [מילון הנתונים המפורט](#3-מילון-הנתונים-המפורט)
   - [טבלה 1: Department (מחלקות)](#טבלה-1-department-מחלקות)
   - [טבלה 2: TrainingCourse (קורסי הדרכה)](#טבלה-2-trainingcourse-קורסי-הדרכה)
   - [טבלה 3: Employee (עובדים - Supertype)](#טבלה-3-employee-עובדים---supertype)
   - [טבלה 4: AdministrativeStaff (סגל מנהלי - Subtype)](#טבלה-4-administrativestaff-סגל-מנהלי---subtype)
   - [טבלה 5: AcademicStaff (סגל אקדמי - Subtype)](#טבלה-5-academicstaff-סגל-אקדמי---subtype)
   - [טבלה 6: AttendanceRecord (דיווחי נוכחות - Weak Entity)](#טבלה-6-attendancerecord-דיווחי-נוכחות---weak-entity)
   - [טבלה 7: Employee_Training (רישומי השתלמות - Junction)](#טבלה-7-employee_training-רישומי-השתלמות---junction)
4. [ניתוח נרמול (3NF Justification)](#4-ניתוח-נרמול-3nf-justification)
5. [אילוצי שלמות עסקיים (Integrity & Business Rules)](#5-אילוצי-שלמות-עסקיים-integrity--business-rules)

---

### 1. מבוא ומטרת המערכת
מערכת ניהול כוח האדם למכללה (College Manpower and HR System) נועדה לנהל בצורה מרכזית, אמינה ומדויקת את כלל היבטי כוח האדם במכללה (בהתאמה לפרופיל הפעילות של המרכז האקדמי לב / JCT).  
המערכת מנהלת:
- **סגל העובדים:** חלוקה ברורה בין סגל אקדמי (חוקרים, מרצים, ראשי מעבדות) לסגל מנהלי (רכש, משאבי אנוש, תפעול, כספים).
- **מחלקות אקדמיות ומנהליות:** מעקב אחר תקציב מחלקתי והשיוך הארגוני של כל עובד.
- **שעון נוכחות יומי:** מעקב מדויק של שעות כניסה ויציאה לכל יום עבודה (ישות חלשה).
- **הדרכות והשתלמויות מקצועיות:** מעקב אחר השתתפות והשלמת קורסים (בטיחות, פדגוגיה, סייבר, מחקר וכיו"ב) על ידי עובדי המכללה (קשר רבים-לרבים).

כל הטבלאות מתוכננות בצורה מנורמלת ברמת **3NF** (צורה נורמלית שלישית) למניעת כפילויות, אנומליות הוספה, עדכון ומחיקה.

---

### 2. סקירת הישויות והקשרים (ER Overview)

| שם הטבלה | סוג הישות | מפתח ראשי (PK) | קשרי גומלין עיקריים | כמות רשומות צפויה |
| :--- | :--- | :--- | :--- | :--- |
| **Department** | Strong / Lookup | `DepartmentID` | 1:N מול Employee | 10+ (הזנה ידנית) |
| **TrainingCourse** | Strong / Lookup | `CourseID` | 1:N מול Employee_Training | 15+ (הזנה ידנית) |
| **Employee** | Supertype Entity | `EmployeeID` | N:1 מול Department; 1:1 מול Subtypes | 500 (Mockaroo) |
| **AdministrativeStaff** | Subtype Entity | `EmployeeID` | 1:1 מול Employee (ירושה) | ~250 (Mockaroo) |
| **AcademicStaff** | Subtype Entity | `EmployeeID` | 1:1 מול Employee (ירושה) | ~250 (Mockaroo) |
| **AttendanceRecord** | Weak Entity | `(EmployeeID, RecordID)` | N:1 מול Employee (ישות מזהה) | 20,000+ (Python) |
| **Employee_Training** | Junction Entity (M:N) | `(EmployeeID, CourseID, CompletionDate)` | N:1 מול Employee, N:1 מול TrainingCourse | 20,000+ (Python) |

---

### 3. מילון הנתונים המפורט

#### טבלה 1: Department (מחלקות)
- **תיאור:** מייצגת את מחלקות המכללה, הן האקדמיות (מדעי המחשב, הנדסת תוכנה, הנדסת תעשייה וניהול וכו') והן המנהליות (משאבי אנוש, לוגיסטיקה, כספים וכו').
- **מפתח ראשי:** `DepartmentID`

| שם שדה | טיפוס נתונים | מגבלות (Constraints) | תיאור בעברית | דוגמה |
| :--- | :--- | :--- | :--- | :--- |
| `DepartmentID` | INT | PRIMARY KEY | מזהה ייחודי למחלקה | 101 |
| `DepartmentName` | VARCHAR(100) | NOT NULL, UNIQUE | שם המחלקה | 'הנדסת תוכנה' |
| `Budget` | NUMERIC(12, 2) | NOT NULL, CHECK (Budget >= 0) | תקציב שנתי בש"ח | 2500000.00 |

---

#### טבלה 2: TrainingCourse (קורסי הדרכה)
- **תיאור:** קטלוג קורסי העשרה, הדרכות בטיחות, השתלמויות פדגוגיות וקורסי סייבר ומיחשוב לעובדי המוסד.
- **מפתח ראשי:** `CourseID`

| שם שדה | טיפוס נתונים | מגבלות (Constraints) | תיאור בעברית | דוגמה |
| :--- | :--- | :--- | :--- | :--- |
| `CourseID` | INT | PRIMARY KEY | מזהה קורס הדרכה | 201 |
| `CourseName` | VARCHAR(150) | NOT NULL, UNIQUE | שם הקורס/ההשתלמות | 'אבטחת מידע וסייבר בענן' |
| `ProviderName` | VARCHAR(100) | NOT NULL | גוף מעביר ההדרכה | 'המערך הלאומי לסייבר' |

---

#### טבלה 3: Employee (עובדים - Supertype)
- **תיאור:** ישות-על המרכזת את הנתונים המשותפים לכלל עובדי המכללה (אקדמיים ומנהליים כאחד).
- **מפתח ראשי:** `EmployeeID`
- **מפתחות זרים:** `DepartmentID` מפנה ל-`Department(DepartmentID)`

| שם שדה | טיפוס נתונים | מגבלות (Constraints) | תיאור בעברית | דוגמה |
| :--- | :--- | :--- | :--- | :--- |
| `EmployeeID` | INT | PRIMARY KEY | מזהה פנימי ייחודי לעובד | 1001 |
| `FirstName` | VARCHAR(50) | NOT NULL | שם פרטי | 'אביגיל' |
| `LastName` | VARCHAR(50) | NOT NULL | שם משפחה | 'כהן' |
| `ID_Number` | VARCHAR(9) | NOT NULL, UNIQUE, CHECK (LENGTH=9) | מספר תעודת זהות ישראלית (9 ספרות) | '032982153' |
| `HireDate` | DATE | NOT NULL, CHECK (HireDate <= CURRENT_DATE) | תאריך תחילת עבודה במכללה | '2019-09-01' |
| `BaseSalary` | NUMERIC(10, 2) | NOT NULL, CHECK (BaseSalary >= 0) | שכר בסיס חודשי בש"ח | 18500.00 |
| `DepartmentID` | INT | NOT NULL, FK -> Department | מזהה המחלקה בה מועסק העובד | 101 |
| `EmployeeType` | VARCHAR(20) | NOT NULL, CHECK IN ('Administrative', 'Academic') | סוג עובד (דיסקרימיננטור ירושה) | 'Academic' |

---

#### טבלה 4: AdministrativeStaff (סגל מנהלי - Subtype)
- **תיאור:** ישות-בן של `Employee` עבור עובדי מנהלה, מזכירות, רכש, אחזקה וניהול תפעולי.
- **מפתח ראשי:** `EmployeeID` (מהווה גם FK מפנה ל-`Employee.EmployeeID`)

| שם שדה | טיפוס נתונים | מגבלות (Constraints) | תיאור בעברית | דוגמה |
| :--- | :--- | :--- | :--- | :--- |
| `EmployeeID` | INT | PRIMARY KEY, FK -> Employee(EmployeeID) ON DELETE CASCADE | מזהה עובד (מקושר לישות-העל) | 1002 |
| `OfficeNumber` | VARCHAR(20) | NOT NULL | מיקום חדר/משרד במכללה | 'בניין לב, חדר 312' |
| `ManagementLevel` | VARCHAR(30) | NOT NULL, CHECK IN ('Entry', 'Junior', 'Mid', 'Senior', 'Director', 'Head of Administration') | דרג ניהולי | 'Senior' |

---

#### טבלה 5: AcademicStaff (סגל אקדמי - Subtype)
- **תיאור:** ישות-בן של `Employee` עבור חברי סגל הוראה, מרצים מן החוץ, חוקרים ופרופסורים.
- **מפתח ראשי:** `EmployeeID` (מהווה גם FK מפנה ל-`Employee.EmployeeID`)

| שם שדה | טיפוס נתונים | מגבלות (Constraints) | תיאור בעברית | דוגמה |
| :--- | :--- | :--- | :--- | :--- |
| `EmployeeID` | INT | PRIMARY KEY, FK -> Employee(EmployeeID) ON DELETE CASCADE | מזהה עובד אקדמי | 1001 |
| `ResearchField` | VARCHAR(100) | NOT NULL | תחום מחקר / התמחות אקדמית | 'אלגוריתמים ובינה מלאכותית' |
| `TenureStatus` | VARCHAR(20) | NOT NULL, CHECK IN ('Tenured', 'Tenure-Track', 'Adjunct', 'Visiting Professor', 'Emeritus') | מעמד קביעות אקדמית | 'Tenured' |

---

#### טבלה 6: AttendanceRecord (דיווחי נוכחות - Weak Entity)
- **תיאור:** ישות חלשה (Weak Entity) המייצגת רישומי נוכחות יומיים בשעון נוכחות. קיומה וזיהויה תלויים לחלוטין בישות האב `Employee`.
- **מפתח ראשי מורכב:** `(EmployeeID, RecordID)`
- **מפתחות זרים:** `EmployeeID` מפנה ל-`Employee(EmployeeID)` עם `ON DELETE CASCADE`.

| שם שדה | טיפוס נתונים | מגבלות (Constraints) | תיאור בעברית | דוגמה |
| :--- | :--- | :--- | :--- | :--- |
| `EmployeeID` | INT | NOT NULL, FK -> Employee (חלק מה-PK) | מזהה העובד | 1001 |
| `RecordID` | INT | NOT NULL (Discriminator / Partial Key) | מספר סידורי של הדיווח עבור העובד | 1 |
| `WorkDate` | DATE | NOT NULL, CHECK (WorkDate <= CURRENT_DATE) | תאריך יום העבודה | '2026-05-14' |
| `ClockInTime` | TIME | NOT NULL | שעת כניסה | '08:12:00' |
| `ClockOutTime` | TIME | CHECK (ClockOutTime IS NULL OR ClockOutTime >= ClockInTime) | שעת יציאה (יכולה להיות NULL במהלך יום העבודה) | '16:45:00' |

---

#### טבלה 7: Employee_Training (רישומי השתלמות - Junction)
- **תיאור:** טבלת קשר (Junction Table) המממשת קשר רבים-לרבים (M:N) בין עובדים לבין קורסי הדרכה. מאפשרת לעובד לעבור קורסים שונים וכן קורסים חוזרים (כגון רענון בטיחות/סייבר שנתי).
- **מפתח ראשי מורכב:** `(EmployeeID, CourseID, CompletionDate)`
- **מפתחות זרים:**  
  - `EmployeeID` -> `Employee(EmployeeID)` ON DELETE CASCADE  
  - `CourseID` -> `TrainingCourse(CourseID)` ON DELETE CASCADE  

| שם שדה | טיפוס נתונים | מגבלות (Constraints) | תיאור בעברית | דוגמה |
| :--- | :--- | :--- | :--- | :--- |
| `EmployeeID` | INT | NOT NULL, FK -> Employee | מזהה העובד שהשתתף | 1001 |
| `CourseID` | INT | NOT NULL, FK -> TrainingCourse | מזהה הקורס שבוצע | 201 |
| `CompletionDate` | DATE | NOT NULL, CHECK (CompletionDate <= CURRENT_DATE) | תאריך סיום ההדרכה | '2026-03-10' |

---

### 4. ניתוח נרמול (3NF Justification)

המערכת מתוכננת בקפידה לעמידה בסטנדרט הצורה הנורמלית השלישית (3NF):

1. **עמידה ב-1NF (צורה נורמלית ראשונה):**
   - כל שדה בטבלאות מכיל ערכים אטומיים בלבד (אין רשימות מרובות ערכים בשדה יחיד, כגון מחרוזות מופרדות בפסיקים).
   - לכל טבלה מוגדר מפתח ראשי מפורש וחד-ערכי (Primary Key) המבטיח ייחודיות שורות.
   - אין טורים החוזרים על עצמם (Repeating groups).

2. **עמידה ב-2NF (צורה נורמלית שנייה):**
   - הטבלאות נמצאות ב-1NF.
   - בכל הטבלאות בעלות מפתח ראשי מורכב (`AttendanceRecord` ו-`Employee_Training`), כל תכונה שאינה מפתח תלויה במלוא המפתח הראשי ולא בחלק ממנו (Full Functional Dependency):
     - ב-`AttendanceRecord`: שעות הכניסה והיציאה תלויות ספציפית ברשומת הנוכחות של העובד ביום המדובר.
     - ב-`Employee_Training`: תאריך הסיום תלוי בשילוב המדויק של העובד, הקורס והמועד.

3. **עמידה ב-3NF (צורה נורמלית שלישית):**
   - הטבלאות נמצאות ב-2NF.
   - אין תלויות טרנזיטיביות (Transitive Dependencies) בין תכונות שאינן מפתח. לדוגמה:
     - תקציב המחלקה (`Budget`) שמור בטבלת `Department` בלבד, ולא נגרר לטבלת `Employee`, מה שמונע כפילות ואנומליות עדכון כאשר תקציב מחלקה משתנה.
     - פרטי הקורס ומעביר הקורס (`ProviderName`) שמורים ב-`TrainingCourse` בלבד ולא בטבלת הקשר `Employee_Training`.
     - חלוקת סוגי העובדים ממומשת באמצעות דפוס ירושה (Table-per-Type) כך ששדות ייחודיים לסגל אקדמי (כגון `ResearchField`) אינם מאוחסנים עם ערכי NULL מיותרים עבור סגל מנהלי, ולהפך.

---

### 5. אילוצי שלמות עסקיים (Integrity & Business Rules)

1. **שלמות ישותית (Entity Integrity):**
   - כל מפתח ראשי מוגדר כ-`NOT NULL` באופן מובנה ומונע כפילויות.
2. **שלמות התייחסותית (Referential Integrity):**
   - מחיקת עובד גוררת מחיקה של כלל רשומות הנוכחות שלו, רישומי ההשתלמויות שלו ורשומות ה-Subtype שלו (`ON DELETE CASCADE`), על מנת למנוע רשומות יתומות (Orphan Records).
   - מחיקת מחלקה מוגבלת (`ON DELETE RESTRICT`) במידה ומשויכים אליה עובדים פעילים, כדי למנוע השארת עובדים ללא מחלקה ארגונית.
3. **אילוצי תחום וערכים (Domain Constraints):**
   - מספרי זהות חייבים להיות בדיוק בני 9 ספרות (`LENGTH(ID_Number) = 9`).
   - משכורות ותקציבים מוגבלים לערכים חיוביים בלבד (`CHECK (Budget >= 0)`, `CHECK (BaseSalary >= 0)`).
   - שעת יציאה חייבת להיות שווה או מאוחרת משעת הכניסה (`ClockOutTime >= ClockInTime`).
   - תאריכים עתידיים נפסלים באופן קשיח עבור גיוס, דיווחי נוכחות וסיום קורסים (`<= CURRENT_DATE`).

