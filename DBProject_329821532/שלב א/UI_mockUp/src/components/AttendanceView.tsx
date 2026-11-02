import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Download, 
  SlidersHorizontal, 
  Search, 
  Check, 
  Edit, 
  X, 
  Save
} from 'lucide-react';
import { AttendanceRecord, Department, Employee } from '../types';

interface AttendanceViewProps {
  records: AttendanceRecord[];
  departments: Department[];
  employees: Employee[];
  onUpdateRecord: (record: AttendanceRecord) => void;
  onAddManualRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  records,
  departments,
  employees,
  onUpdateRecord,
  onAddManualRecord,
  onShowToast
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-11-02');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manual Override Modal
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideForm, setOverrideForm] = useState({
    employeeId: employees[0]?.employeeId || '',
    clockIn: '08:00',
    clockOut: '16:30',
    reason: 'Dean / Chair Authorized Absence',
    notes: 'Off-campus research symposium'
  });

  // Calculate total hours difference helper
  const calculateHours = (inTime: string, outTime: string): string => {
    if (!inTime || !outTime) return '00:00';
    const [inH, inM] = inTime.split(':').map(Number);
    const [outH, outM] = outTime.split(':').map(Number);
    const totalMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    if (totalMinutes < 0) return '00:00';
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const matchesDate = rec.date === selectedDate;
    const matchesDept = selectedDepartment === 'all' || rec.departmentName === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || rec.status === selectedStatus;
    const matchesSearch = 
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeRole.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDate && matchesDept && matchesStatus && matchesSearch;
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    try {
      const headers = ['Employee ID', 'Employee Name', 'Role', 'Department', 'Date', 'Clock In', 'Clock Out', 'Total Hours', 'Status', 'Audit Notes'];
      
      const rows = filteredRecords.map((r) => [
        `"${r.employeeId}"`,
        `"${r.employeeName}"`,
        `"${r.employeeRole}"`,
        `"${r.departmentName}"`,
        `"${r.date}"`,
        `"${r.clockIn}"`,
        `"${r.clockOut || 'Active'}"`,
        `"${r.totalHours}"`,
        `"${r.statusLabel}"`,
        `"${r.notes || (r.isOverridden ? 'Manually Overridden' : '')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ApexCollege_Attendance_${selectedDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShowToast(
        'Payroll CSV Exported',
        `Generated official attendance logs for ${filteredRecords.length} staff members on ${selectedDate}`,
        'success'
      );
    } catch (err) {
      onShowToast('Export Error', 'Unable to compile the CSV export file', 'warning');
    }
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.employeeId === overrideForm.employeeId) || employees[0];
    const totalHours = calculateHours(overrideForm.clockIn, overrideForm.clockOut);

    const existingIndex = records.findIndex(r => r.employeeId === emp.employeeId && r.date === selectedDate);

    if (existingIndex >= 0) {
      const updated: AttendanceRecord = {
        ...records[existingIndex],
        clockIn: overrideForm.clockIn,
        clockOut: overrideForm.clockOut,
        totalHours,
        status: 'present',
        statusLabel: `Override: ${overrideForm.reason}`,
        notes: overrideForm.notes,
        isOverridden: true
      };
      onUpdateRecord(updated);
    } else {
      onAddManualRecord({
        employeeId: emp.employeeId,
        employeeName: emp.name,
        employeeRole: emp.role,
        departmentName: emp.departmentName,
        date: selectedDate,
        clockIn: overrideForm.clockIn,
        clockOut: overrideForm.clockOut,
        totalHours,
        status: 'present',
        statusLabel: `Manual Override: ${overrideForm.reason}`,
        notes: overrideForm.notes,
        isOverridden: true
      });
    }

    setIsOverrideModalOpen(false);
    onShowToast(
      'Manual Override Recorded',
      `Updated timestamps for ${emp.name} to ${overrideForm.clockIn} – ${overrideForm.clockOut}`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        
        {/* Row 1: Date Filter + Primary Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Date Picker Input */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-700" />
              <label htmlFor="attendance-date" className="text-xs font-bold text-slate-800">
                Filter by Log Date:
              </label>
            </div>

            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono font-semibold text-slate-900"
            />

            {/* Quick date buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setSelectedDate('2026-11-02')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedDate === '2026-11-02' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today (Nov 02)
              </button>
              <button
                onClick={() => setSelectedDate('2026-11-01')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedDate === '2026-11-01' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yesterday (Nov 01)
              </button>
            </div>
          </div>

          {/* Action Buttons: Export to CSV and Manual Override */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-all border border-slate-300 shadow-2xs"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Export to CSV</span>
            </button>

            <button
              onClick={() => setIsOverrideModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0a1128] hover:bg-[#152352] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Manual Override</span>
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Filter Bar (Search + Department + Status) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff by name or role..."
                className="w-full text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white text-left"
              />
            </div>

            {/* Department dropdown */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-slate-700"
            >
              <option value="all">All Departments & Schools</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'present', label: 'Present' },
              { id: 'late', label: 'Tardy' },
              { id: 'overtime', label: 'Overtime' },
              { id: 'approved_absence', label: 'Excused' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedStatus === st.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Logged Records</span>
          <div className="text-xl font-black text-slate-900 font-mono tabular-nums mt-1">
            {filteredRecords.length}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Active on Campus</span>
          <div className="text-xl font-black text-emerald-700 font-mono tabular-nums mt-1">
            {records.filter(r => r.status === 'present' || r.status === 'in_progress' || r.status === 'overtime').length}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Tardy Arrivals</span>
          <div className="text-xl font-black text-amber-700 font-mono tabular-nums mt-1">
            {records.filter(r => r.status === 'late').length}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Approved Travel / Symposia</span>
          <div className="text-xl font-black text-indigo-900 font-mono tabular-nums mt-1">
            {records.filter(r => r.status === 'approved_absence').length}
          </div>
        </div>
      </div>

      {/* Main Attendance Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 font-bold">Employee & Title</th>
                <th className="py-3 px-4 font-bold">Department</th>
                <th className="py-3 px-4 font-bold text-center">Clock-In Time</th>
                <th className="py-3 px-4 font-bold text-center">Clock-Out Time</th>
                <th className="py-3 px-4 font-bold text-center">Total Hours</th>
                <th className="py-3 px-4 font-bold">Status & Verification</th>
                <th className="py-3 px-4 font-bold text-center">Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => {
                  const statusColors: Record<string, string> = {
                    present: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    late: 'bg-amber-50 text-amber-800 border-amber-200',
                    overtime: 'bg-indigo-50 text-indigo-800 border-indigo-200',
                    approved_absence: 'bg-blue-50 text-blue-800 border-blue-200',
                    in_progress: 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  };

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{rec.employeeName}</div>
                        <div className="text-[11px] text-slate-500">{rec.employeeRole}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{rec.employeeId}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        {rec.departmentName}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 tabular-nums">
                        {rec.clockIn}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 tabular-nums">
                        {rec.clockOut ? (
                          rec.clockOut
                        ) : (
                          <span className="text-emerald-700 font-semibold">Active Now</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-900 tabular-nums text-sm">
                        {rec.totalHours}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                              statusColors[rec.status] || 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {rec.statusLabel}
                          </span>
                          {rec.notes && (
                            <span className="text-[10px] text-slate-500 italic max-w-xs truncate">
                              {rec.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {rec.isOverridden ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                            <Check className="w-3 h-3" />
                            Overridden
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setOverrideForm({
                                employeeId: rec.employeeId,
                                clockIn: rec.clockIn || '08:00',
                                clockOut: rec.clockOut || '16:30',
                                reason: 'Time-Clock Discrepancy Correction',
                                notes: 'Validated with Department Chair'
                              });
                              setIsOverrideModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit this record manually"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No attendance logs found matching the filter for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>
            Total Displayed Shift Records: <strong className="text-slate-800 tabular-nums">{filteredRecords.length}</strong>
          </span>
          <span className="text-slate-600">
            Automated reconciliation across badge readers, mobile beacon check-ins, and HR overrides
          </span>
        </div>
      </div>

      {/* Manual Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#0a1128] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Manual Time Clock Override</h3>
              </div>
              <button
                onClick={() => setIsOverrideModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Staff Member
                </label>
                <select
                  value={overrideForm.employeeId}
                  onChange={(e) => setOverrideForm({ ...overrideForm, employeeId: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.employeeId}>
                      {emp.name} ({emp.employeeId}) — {emp.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corrected Clock-In
                  </label>
                  <input
                    type="time"
                    required
                    value={overrideForm.clockIn}
                    onChange={(e) => setOverrideForm({ ...overrideForm, clockIn: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corrected Clock-Out
                  </label>
                  <input
                    type="time"
                    required
                    value={overrideForm.clockOut}
                    onChange={(e) => setOverrideForm({ ...overrideForm, clockOut: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Override Justification Reason
                </label>
                <select
                  value={overrideForm.reason}
                  onChange={(e) => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
                >
                  <option value="Dean / Chair Authorized Absence">Dean / Chair Authorized Absence</option>
                  <option value="Remote Instruction / Online Lab">Remote Instruction / Online Lab</option>
                  <option value="Off-Campus Research Symposium">Off-Campus Research Symposium</option>
                  <option value="Physical Badge Reader Malfunction">Physical Badge Reader Malfunction</option>
                  <option value="Pre-Approved Remote Work Agreement">Pre-Approved Remote Work Agreement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Audit Notes & Reference Number
                </label>
                <textarea
                  rows={2}
                  value={overrideForm.notes}
                  onChange={(e) => setOverrideForm({ ...overrideForm, notes: e.target.value })}
                  placeholder="Reference memo or ticket number..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-lg hover:bg-indigo-800 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Commit Override</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
