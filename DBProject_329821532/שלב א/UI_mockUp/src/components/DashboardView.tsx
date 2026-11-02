import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Clock, 
  UserPlus, 
  TrendingUp, 
  Building2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Department, Employee, RecentHire } from '../types';
import { ActiveScreen } from './Sidebar';

interface DashboardViewProps {
  employees: Employee[];
  departments: Department[];
  recentHires: RecentHire[];
  onSelectEmployee: (employeeId: string) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenNewEmployeeModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  departments,
  recentHires,
  onSelectEmployee,
  onNavigate,
  onOpenNewEmployeeModal
}) => {
  const [chartView, setChartView] = useState<'ratio' | 'faculty'>('ratio');
  const [activeHoverSlice, setActiveHoverSlice] = useState<string | null>(null);

  // Workforce Metrics
  const totalEmployees = 482;
  const academicStaff = 314;
  const adminStaff = 168;
  const academicPercent = Math.round((academicStaff / totalEmployees) * 100);
  const adminPercent = 100 - academicPercent;

  // School breakdown data
  const schoolBreakdown = [
    { name: 'Engineering & Technology', count: 188, percent: 39, color: '#312e81' },
    { name: 'Health & Medical Sciences', count: 110, percent: 23, color: '#4338ca' },
    { name: 'Business & Economics', count: 88, percent: 18, color: '#0284c7' },
    { name: 'Administration & Operations', count: 96, percent: 20, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      {/* Modern Collegiate Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a1128] via-[#101f42] to-[#1e1b4b] text-white p-6 sm:p-7 shadow-sm border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Collegiate Human Capital System · Apex College</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Welcome back, Sarah Jenkins (VP of HR)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Fall Term 2026 is currently underway. Total active institutional workforce stands at 482 positions across 3 regional campuses: Main Campus, North Health Sciences Campus, and Downtown Innovation Hub.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewEmployeeModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-950/20"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Onboard New Faculty</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm rounded-xl transition-all border border-white/10"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Live Attendance</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-12 -bottom-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* Summary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Employees */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Active Staff</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-sans tabular-nums tracking-tight">
              {totalEmployees}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+4.2% YoY Growth</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>3 Regional Campuses</span>
            <span className="font-semibold text-slate-700">100% Budgeted</span>
          </div>
        </div>

        {/* Card 2: Academic Faculty */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Faculty</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-sans tabular-nums tracking-tight">
              {academicStaff}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-700 font-semibold">
              <span>{academicPercent}% of total college workforce</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Professors & Researchers</span>
            <span className="font-semibold text-slate-700">4 Schools</span>
          </div>
        </div>

        {/* Card 3: Administrative Staff */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administrative Staff</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-sans tabular-nums tracking-tight">
              {adminStaff}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-700 font-semibold">
              <span>{adminPercent}% operational support</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Student Affairs, Labs & Finance</span>
            <span className="font-semibold text-slate-700">8 Divisions</span>
          </div>
        </div>

        {/* Card 4: Attendance & Recruitment */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Attendance Rate</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 font-sans tabular-nums tracking-tight">
              94.8%
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600 font-medium">
              <span>12 Open Faculty Requisitions</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Biometric & Mobile Clock</span>
            <span className="font-semibold text-emerald-600">Accredited</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Staff Ratio Chart + Recent Hires */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Academic vs. Administrative Staff Ratio (Donut / Pie Chart) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Staffing Ratio: Academic vs. Administrative
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional workforce allocation across faculties
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setChartView('ratio')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                    chartView === 'ratio'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Faculty Ratio
                </button>
                <button
                  onClick={() => setChartView('faculty')}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                    chartView === 'faculty'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  By School
                </button>
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-52 h-52">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {chartView === 'ratio' ? (
                    <>
                      {/* Academic slice: 65% (circumference ~ 251.2, 65% = 163.3) */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#1e1b4b"
                        strokeWidth="15"
                        strokeDasharray="163.3 251.2"
                        strokeDashoffset="0"
                        className="transition-all duration-500 cursor-pointer hover:stroke-[#312e81]"
                        onMouseEnter={() => setActiveHoverSlice('academic')}
                        onMouseLeave={() => setActiveHoverSlice(null)}
                      />
                      {/* Admin slice: 35% = 87.9 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="15"
                        strokeDasharray="87.9 251.2"
                        strokeDashoffset="-163.3"
                        className="transition-all duration-500 cursor-pointer hover:stroke-[#fbbf24]"
                        onMouseEnter={() => setActiveHoverSlice('admin')}
                        onMouseLeave={() => setActiveHoverSlice(null)}
                      />
                    </>
                  ) : (
                    <>
                      {/* School breakdown slices */}
                      {/* 39% = 97.9 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#312e81"
                        strokeWidth="15"
                        strokeDasharray="97.9 251.2"
                        strokeDashoffset="0"
                      />
                      {/* 23% = 57.7 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#4338ca"
                        strokeWidth="15"
                        strokeDasharray="57.7 251.2"
                        strokeDashoffset="-97.9"
                      />
                      {/* 18% = 45.2 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#0284c7"
                        strokeWidth="15"
                        strokeDasharray="45.2 251.2"
                        strokeDashoffset="-155.6"
                      />
                      {/* 20% = 50.2 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="15"
                        strokeDasharray="50.2 251.2"
                        strokeDashoffset="-200.8"
                      />
                    </>
                  )}
                </svg>

                {/* Center text of the donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-900 font-sans tabular-nums">
                    {totalEmployees}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Total Staff
                  </span>
                </div>
              </div>

              {/* Breakdown Legend */}
              <div className="w-full mt-6 space-y-2.5">
                {chartView === 'ratio' ? (
                  <>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs bg-[#1e1b4b]" />
                        <span className="font-semibold text-indigo-950">Academic & Research Faculty</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 tabular-nums">{academicStaff} members</span>
                        <span className="font-bold text-indigo-900 tabular-nums">{academicPercent}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs bg-[#f59e0b]" />
                        <span className="font-semibold text-amber-950">Administrative & Technical Staff</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 tabular-nums">{adminStaff} members</span>
                        <span className="font-bold text-amber-800 tabular-nums">{adminPercent}%</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {schoolBreakdown.map((item) => (
                      <div key={item.name} className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: item.color }} />
                          <span className="font-medium text-slate-800 text-[11px] truncate">{item.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 font-mono text-[11px]">
                          <span>{item.count} staff</span>
                          <span className="font-bold text-slate-900">{item.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Target ratio benchmark: 65:35</span>
            <span className="text-emerald-700 font-medium">Fully Compliant</span>
          </div>
        </div>

        {/* Recent Hires List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <span>Recent Hires & Faculty Appointments</span>
                  <span className="text-xs bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full font-semibold border border-indigo-200">
                    Fall 2026
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Newly credentialed academic lecturers and administrative professionals
                </p>
              </div>

              <button
                onClick={onOpenNewEmployeeModal}
                className="text-xs text-indigo-700 font-semibold hover:text-indigo-900 flex items-center gap-1"
              >
                <span>Add Employee</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 font-semibold">Employee</th>
                    <th className="py-2.5 font-semibold">Role & Department</th>
                    <th className="py-2.5 font-semibold">Type</th>
                    <th className="py-2.5 font-semibold">Start Date</th>
                    <th className="py-2.5 font-semibold">Status</th>
                    <th className="py-2.5 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentHires.map((hire) => (
                    <tr key={hire.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">
                        {hire.name}
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {hire.employeeId}
                        </span>
                      </td>
                      <td className="py-3 text-slate-700">
                        <div className="font-medium text-slate-800">{hire.role}</div>
                        <div className="text-[11px] text-slate-500">{hire.department}</div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            hire.type === 'academic'
                              ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {hire.type === 'academic' ? 'Academic' : 'Administrative'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 font-mono tabular-nums">
                        {hire.startDate}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            hire.status === 'Onboarded'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : hire.status === 'In Credentialing'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {hire.status === 'Onboarded' && <CheckCircle2 className="w-3 h-3" />}
                          {hire.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => {
                            const matched = employees.find(e => e.name.toLowerCase().includes(hire.name.toLowerCase().split(' ')[1] || ''));
                            if (matched) {
                              onSelectEmployee(matched.id);
                            } else {
                              onSelectEmployee(employees[0].id);
                            }
                            onNavigate('profile');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:text-white hover:bg-indigo-700 rounded-md transition-all border border-indigo-300"
                          title="View full personnel dossier"
                        >
                          View Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Calendar Reminder Banner */}
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>HR Notice:</strong> Annual Tenure & Promotion Committee review submissions close Dec 15, 2026.
              </span>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="font-semibold text-indigo-700 hover:underline shrink-0"
            >
              Review Candidates
            </button>
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigate('profile')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              Faculty & Staff Directory
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Search dossiers, credentials, course accreditations, and reporting structures.
            </p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('attendance')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              Shift Tracker & Hours
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter clock logs by date, execute manual overrides, and export payroll CSVs.
            </p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('departments')}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 group-hover:bg-blue-900 group-hover:text-white transition-colors">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
              Department Management
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor faculty headcounts, department chairs, and allocated salary budgets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
