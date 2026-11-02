export type StaffType = 'academic' | 'administrative';

export interface TrainingCourse {
  id: string;
  title: string;
  institution: string;
  completionDate: string;
  hours: number;
  status: 'Completed' | 'In Progress' | 'Renewal Needed';
  accreditation: string;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. "EMP-10492"
  nationalId: string; // e.g. "ID-904-22-118"
  name: string;
  role: string;
  academicRank?: string;
  departmentId: string;
  departmentName: string;
  faculty: string;
  type: StaffType;
  campus: 'Main Campus' | 'North Campus' | 'Downtown Innovation Hub';
  email: string;
  phone: string;
  office: string;
  managerName: string;
  managerRole: string;
  joinDate: string;
  tenureStatus: 'Tenured' | 'Tenure-Track' | 'Special Contract' | 'Visiting / Adjunct';
  avatarBg: string;
  initials: string;
  weeklyHours: number;
  courses: TrainingCourse[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  headRole: string;
  faculty: 'Engineering & Technology' | 'Health & Medical Sciences' | 'Business & Economics' | 'Administration & Operations';
  employeeCount: number;
  academicCount: number;
  adminCount: number;
  allocatedBudget: number; // in USD $
  spentBudget: number; // in USD $
  campus: string;
  location: string;
  description: string;
}

export type AttendanceStatus = 'present' | 'late' | 'approved_absence' | 'overtime' | 'in_progress';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:MM
  clockOut: string; // HH:MM or empty if in_progress
  totalHours: string; // HH:MM
  status: AttendanceStatus;
  statusLabel: string;
  notes?: string;
  isOverridden?: boolean;
}

export interface RecentHire {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  type: StaffType;
  startDate: string;
  status: 'Onboarded' | 'In Credentialing' | 'Contract Signing';
}
