import React, { useState } from 'react';
import { Sidebar, ActiveScreen } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { EmployeeProfileView } from './components/EmployeeProfileView';
import { AttendanceView } from './components/AttendanceView';
import { DepartmentsView } from './components/DepartmentsView';
import { NewEmployeeModal } from './components/NewEmployeeModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_DEPARTMENTS, 
  INITIAL_ATTENDANCE, 
  RECENT_HIRES 
} from './data/mockData';
import { Employee, Department, AttendanceRecord, TrainingCourse, RecentHire } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // App Data States
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [recentHires, setRecentHires] = useState<RecentHire[]>(RECENT_HIRES);
  
  // Selected Employee for Profile Screen
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(INITIAL_EMPLOYEES[0].id);
  
  // Personal Clock Status for Header
  const [isClockedIn, setIsClockedIn] = useState(true);

  // Modals
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers
  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    showToast('Profile Updated', `Successfully updated dossier for ${updated.name}`, 'success');
  };

  const handleAddCourseToEmployee = (employeeId: string, newCourseData: Omit<TrainingCourse, 'id'>) => {
    const newCourse: TrainingCourse = {
      ...newCourseData,
      id: `course-${Date.now()}`
    };

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            courses: [newCourse, ...(emp.courses || [])]
          };
        }
        return emp;
      })
    );

    showToast('Certification Added', `"${newCourse.title}" has been appended to employee record`, 'success');
  };

  const handleUpdateAttendanceRecord = (updated: AttendanceRecord) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const handleAddManualAttendance = (newRecordData: Omit<AttendanceRecord, 'id'>) => {
    const newRec: AttendanceRecord = {
      ...newRecordData,
      id: `att-${Date.now()}`
    };
    setAttendanceRecords((prev) => [newRec, ...prev]);
  };

  const handleAddDepartment = (newDeptData: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...newDeptData,
      id: `dept-${Date.now()}`
    };
    setDepartments((prev) => [...prev, newDept]);
    showToast('Department Established', `Division "${newDept.name}" added to collegiate catalog`, 'success');
  };

  const handleUpdateDepartment = (updatedDept: Department) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === updatedDept.id ? updatedDept : d))
    );
    showToast('Department Updated', `Budget and leadership revised for ${updatedDept.name}`, 'success');
  };

  const handleAddNewEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
    setSelectedEmployeeId(newEmp.id);
    
    // Add to recent hires
    const newHire: RecentHire = {
      id: `hire-${Date.now()}`,
      employeeId: newEmp.employeeId,
      name: newEmp.name,
      role: newEmp.role,
      department: newEmp.departmentName,
      type: newEmp.type,
      startDate: new Date().toLocaleDateString('en-US'),
      status: 'Onboarded'
    };
    setRecentHires((prev) => [newHire, ...prev]);

    // Also add an attendance clock-in record for today
    const newAtt: AttendanceRecord = {
      id: `att-new-${Date.now()}`,
      employeeId: newEmp.employeeId,
      employeeName: newEmp.name,
      employeeRole: newEmp.role,
      departmentName: newEmp.departmentName,
      date: '2026-11-02',
      clockIn: '08:30',
      clockOut: '',
      totalHours: 'Active Now',
      status: 'in_progress',
      statusLabel: 'Onboarded Today'
    };
    setAttendanceRecords((prev) => [newAtt, ...prev]);

    showToast('Faculty Member Onboarded', `Dossier opened for ${newEmp.name} (${newEmp.employeeId})`, 'success');
  };

  const handleQuickClockToggle = (clockedIn: boolean) => {
    setIsClockedIn(clockedIn);
    showToast(
      clockedIn ? 'Clock-In Confirmed' : 'Clock-Out Recorded',
      clockedIn ? 'Timestamp recorded at 07:55 AM' : 'Shift timestamp committed to payroll engine',
      'info'
    );
  };

  const handleSelectDepartmentForDirectory = (deptName: string) => {
    const empInDept = employees.find((e) => e.departmentName === deptName);
    if (empInDept) {
      setSelectedEmployeeId(empInDept.id);
    }
    setActiveScreen('profile');
    showToast('Directory Filtered', `Displaying faculty from ${deptName}`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex" dir="ltr">
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Sidebar Navigation */}
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        employeeCount={employees.length}
        attendanceCount={attendanceRecords.length}
        departmentCount={departments.length}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header
          activeScreen={activeScreen}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onQuickClockToggle={handleQuickClockToggle}
          isClockedIn={isClockedIn}
        />

        {/* Dynamic Screen Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeScreen === 'dashboard' && (
            <DashboardView
              employees={employees}
              departments={departments}
              recentHires={recentHires}
              onSelectEmployee={(id) => {
                setSelectedEmployeeId(id);
                setActiveScreen('profile');
              }}
              onNavigate={setActiveScreen}
              onOpenNewEmployeeModal={() => setIsNewEmployeeModalOpen(true)}
            />
          )}

          {activeScreen === 'profile' && (
            <EmployeeProfileView
              employees={employees}
              selectedEmployeeId={selectedEmployeeId}
              departments={departments}
              onSelectEmployee={setSelectedEmployeeId}
              onUpdateEmployee={handleUpdateEmployee}
              onAddCourseToEmployee={handleAddCourseToEmployee}
            />
          )}

          {activeScreen === 'attendance' && (
            <AttendanceView
              records={attendanceRecords}
              departments={departments}
              employees={employees}
              onUpdateRecord={handleUpdateAttendanceRecord}
              onAddManualRecord={handleAddManualAttendance}
              onShowToast={showToast}
            />
          )}

          {activeScreen === 'departments' && (
            <DepartmentsView
              departments={departments}
              onSelectDepartmentForDirectory={handleSelectDepartmentForDirectory}
              onUpdateDepartment={handleUpdateDepartment}
              onAddDepartment={handleAddDepartment}
            />
          )}
        </main>
      </div>

      {/* New Employee Modal */}
      <NewEmployeeModal
        isOpen={isNewEmployeeModalOpen}
        onClose={() => setIsNewEmployeeModalOpen(false)}
        departments={departments}
        onAddEmployee={handleAddNewEmployee}
      />
    </div>
  );
}
