# מדריך יצירת נתונים באמצעות Mockaroo
## פרויקט מסדי נתונים - שלב א' (מערכת כוח אדם למכללה)
**מגיש:** 329821532

---

### סקירה כללית
בחלק זה של המטלה נעשה שימוש בפלטפורמת [Mockaroo](https://www.mockaroo.com) לצורך יצירה אוטומטית של **500 רשומות מציאותיות** עבור טבלאות העובדים והסגלים:
1. `Employee` - ישות העל (Supertype) - 500 רשומות (מזהים 1 עד 500).
2. `AdministrativeStaff` - תת-סוג סגל מנהלי (Subtype) - 250 רשומות (מזהים 1 עד 250).
3. `AcademicStaff` - תת-סוג סגל אקדמי (Subtype) - 250 רשומות (מזהים 251 עד 500).

חלוקה זו מבטיחה שלמות התייחסותית (Referential Integrity) מלאה: כל עובד ב-Subtype קיים בטבלת העל `Employee`, ואין חפיפה בין סגל מנהלי לסגל אקדמי (Disjoint Inheritance).

---

### שלב 1: הגדרת סכמת Employee (500 רשומות)
1. פתח דפדפן וגלוש לאתר [https://www.mockaroo.com](https://www.mockaroo.com).
2. הגדר את השדות הבאים:
   - **EmployeeID:** Type = `Row Number`
   - **FirstName:** Type = `First Name`
   - **LastName:** Type = `Last Name`
   - **ID_Number:** Type = `Regular Expression`, Value = `0[2-9][0-9]{7}` (מייצר תעודת זהות ישראלית תקנית בת 9 ספרות ייחודיות).
   - **HireDate:** Type = `Date`, Min = `01/01/2012`, Max = `10/01/2026`, Format = `%Y-%m-%d`.
   - **BaseSalary:** Type = `Number`, Min = `8500`, Max = `42000`, Decimals = `2`.
   - **DepartmentID:** Type = `Custom List`, Values = `101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112`.
   - **EmployeeType:** Type = `Formula`, Formula = `if field('EmployeeID') <= 250 then 'Administrative' else 'Academic' end`.
3. הגדר **Rows = 500**.
4. הגדר **Format = SQL**, והגדר Table Name = `Employee`.
5. לחץ על **Download Data** ושמור את הקובץ.

---

### שלב 2: הגדרת סכמת AdministrativeStaff (250 רשומות)
1. צור סכמה חדשה ב-Mockaroo עבור טבלת `AdministrativeStaff`.
2. הגדר את השדות:
   - **EmployeeID:** Type = `Row Number` (מייצר ערכים מ-1 עד 250, התואמים בדיוק לחצי הראשון של טבלת Employee).
   - **OfficeNumber:** Type = `Template`, Template = `Bldg-{{weighted_list(['Lev', 'Shalom', 'Academic', 'Tech'], [40, 30, 20, 10])}}-Rm-{{random(101, 450)}}`.
   - **ManagementLevel:** Type = `Custom List`, Values = `Entry, Junior, Mid, Senior, Director, Head of Administration`.
3. הגדר **Rows = 250**.
4. הגדר **Format = SQL**, והגדר Table Name = `AdministrativeStaff`.
5. לחץ על **Download Data**.

---

### שלב 3: הגדרת סכמת AcademicStaff (250 רשומות)
1. צור סכמה חדשה ב-Mockaroo עבור טבלת `AcademicStaff`.
2. הגדר את השדות:
   - **EmployeeID:** Type = `Row Number`, לחץ על כפתור ה-fx (נוסחה) והזן: `this + 250` (מייצר מזהים 251 עד 500, התואמים בדיוק למחצית השנייה של טבלת Employee).
   - **ResearchField:** Type = `Custom List`, Values:
     - `Algorithms & Artificial Intelligence`
     - `Quantum Computing & Information`
     - `Electro-Optics, Lasers & Photonics`
     - `Biomedical Signal & Image Processing`
     - `Supply Chain & Operations Research`
     - `Genomics, Proteomics & Bioinformatics`
     - `Cloud Systems, Microservices & DevOps`
     - `Cybersecurity, Cryptography & Privacy`
     - `Computer Vision & Deep Learning`
     - `Applied Mathematics & Modeling`
   - **TenureStatus:** Type = `Custom List`, Values = `Tenured, Tenure-Track, Adjunct, Visiting Professor, Emeritus`.
3. הגדר **Rows = 250**.
4. הגדר **Format = SQL**, והגדר Table Name = `AcademicStaff`.
5. לחץ על **Download Data**.

---

### קובץ מוכן מראש
בתיקייה זו מצורף גם קובץ ה-SQL המוכן:
- `insertTables_Mockaroo.sql` - קובץ המכיל את כל 500 הרשומות עבור `Employee`, 250 עבור `AdministrativeStaff` ו-250 עבור `AcademicStaff`, מוכן להרצה ישירה במסד הנתונים!

