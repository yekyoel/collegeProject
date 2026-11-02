import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase, 
  Award, 
  Edit3, 
  Plus, 
  Search, 
  Calendar, 
  UserCheck, 
  X, 
  Save
} from 'lucide-react';
import { Employee, Department, TrainingCourse } from '../types';

interface EmployeeProfileViewProps {
  employees: Employee[];
  selectedEmployeeId: string;
  departments: Department[];
  onSelectEmployee: (id: string) => void;
  onUpdateEmployee: (updated: Employee) => void;
  onAddCourseToEmployee: (employeeId: string, course: Omit<TrainingCourse, 'id'>) => void;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employees,
  selectedEmployeeId,
  departments,
  onSelectEmployee,
  onUpdateEmployee,
  onAddCourseToEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'academic' | 'administrative'>('all');
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  // Selected employee
  const currentEmployee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Employee>>({});

  // New course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    institution: '',
    completionDate: new Date().toISOString().split('T')[0],
    hours: 30,
    status: 'Completed' as const,
    accreditation: 'Faculty Professional Development'
  });

  // Filtered employees for directory list
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || emp.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenEdit = () => {
    setEditForm({ ...currentEmployee });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm && currentEmployee) {
      onUpdateEmployee({
        ...currentEmployee,
        ...editForm
      } as Employee);
      setIsEditModalOpen(false);
    }
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseForm.title.trim()) {
      onAddCourseToEmployee(currentEmployee.id, {
        title: courseForm.title,
        institution: courseForm.institution || 'Apex College Center for Teaching & Learning',
        completionDate: courseForm.completionDate,
        hours: Number(courseForm.hours),
        status: courseForm.status,
        accreditation: courseForm.accreditation
      });
      setIsAddCourseModalOpen(false);
      setCourseForm({
        title: '',
        institution: '',
        completionDate: new Date().toISOString().split('T')[0],
        hours: 30,
        status: 'Completed',
        accreditation: 'Faculty Professional Development'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Faculty Dossier & Staff Directory
            </h2>
            <p className="text-xs text-slate-500">
              Personnel records, institutional appointments, academic certifications, and CEU credits
            </p>
          </div>
        </div>

        {/* Directory Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, or department..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all text-left"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({employees.length})
            </button>
            <button
              onClick={() => setFilterType('academic')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterType === 'academic' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setFilterType('administrative')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filterType === 'administrative' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Directory Roster Selector */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col h-[740px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">
              Staff Directory ({filteredEmployees.length})
            </span>
            <span className="text-[11px] text-slate-500">Select to inspect dossier</span>
          </div>

          <div className="overflow-y-auto divide-y divide-slate-100 flex-1 pr-1 pl-1 mt-2">
            {filteredEmployees.map((emp) => {
              const isSelected = emp.id === currentEmployee.id;
              return (
                <div
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-950 font-medium'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#0a1128] text-amber-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {emp.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {emp.role}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {emp.employeeId} · {emp.departmentName}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                      emp.type === 'academic'
                        ? 'bg-indigo-100/70 text-indigo-800'
                        : 'bg-blue-100/70 text-blue-800'
                    }`}
                  >
                    {emp.type === 'academic' ? 'Faculty' : 'Admin'}
                  </span>
                </div>
              );
            })}

            {filteredEmployees.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No personnel found matching the query.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Dossier */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Profile Card Header */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
              
              {/* Profile Avatar + Identity Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                
                {/* Modern Avatar with Initials and Active Indicator */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0a1128] via-[#152352] to-[#2e1065] text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-950/20 border-2 border-white ring-2 ring-indigo-500/20">
                    <User className="w-9 h-9 text-amber-300 stroke-[1.8]" />
                    <span className="text-[10px] font-mono tracking-widest text-slate-300 mt-1 uppercase">
                      {currentEmployee.initials}
                    </span>
                  </div>
                  <span className="absolute -bottom-2 -right-1 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shadow-2xs border border-white">
                    Active
                  </span>
                </div>

                {/* Name & Academic Rank */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {currentEmployee.name}
                    </h2>
                    <span className="text-xs bg-indigo-100 text-indigo-900 font-semibold px-2.5 py-0.5 rounded-md border border-indigo-200">
                      {currentEmployee.type === 'academic' ? 'Senior Academic Faculty' : 'Staff / Administrative'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-700">
                    {currentEmployee.role}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 pt-1">
                    <span className="font-mono text-slate-600 font-semibold">
                      ID: {currentEmployee.employeeId}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-600">
                      SSN/National: {currentEmployee.nationalId}
                    </span>
                    <span>·</span>
                    <span className="text-indigo-700 font-semibold">
                      {currentEmployee.tenureStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary "Edit" Button */}
              <div className="flex justify-center sm:justify-end shrink-0">
                <button
                  onClick={handleOpenEdit}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0a1128] hover:bg-[#152352] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-950/10 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Contact Details & Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
              
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Department & School</span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentEmployee.departmentName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {currentEmployee.faculty}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                  <span>Reporting Officer / Dean</span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentEmployee.managerName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {currentEmployee.managerRole}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-700" />
                  <span>Campus & Office Room</span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentEmployee.campus}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {currentEmployee.office}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-blue-700" />
                  <span>Institutional Email</span>
                </div>
                <div className="text-xs font-bold text-indigo-900 font-mono truncate">
                  {currentEmployee.email}
                </div>
                <div className="text-[11px] text-slate-500">
                  Verified Campus SSO
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Phone & Extension</span>
                </div>
                <div className="text-xs font-bold text-slate-900 font-mono">
                  {currentEmployee.phone}
                </div>
                <div className="text-[11px] text-slate-500">
                  Direct Campus Extension
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>Appointment Date</span>
                </div>
                <div className="text-xs font-bold text-slate-900 font-mono">
                  {currentEmployee.joinDate}
                </div>
                <div className="text-[11px] text-slate-500">
                  Seniority: {new Date().getFullYear() - parseInt(currentEmployee.joinDate.split('-')[0])} years
                </div>
              </div>

            </div>
          </div>

          {/* Completed Training Courses & Certifications Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Completed Training Courses & Certifications</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Summary of faculty development credits, safety certifications, and continuing education hours
                </p>
              </div>

              <button
                onClick={() => setIsAddCourseModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 font-semibold text-xs rounded-lg transition-colors border border-indigo-200 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Certification</span>
              </button>
            </div>

            {/* Courses Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                    <th className="py-2.5 px-3 font-semibold">Course / Certification Title</th>
                    <th className="py-2.5 px-3 font-semibold">Accrediting Institution</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Hours</th>
                    <th className="py-2.5 px-3 font-semibold">Completed</th>
                    <th className="py-2.5 px-3 font-semibold">Status & Credential</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentEmployee.courses && currentEmployee.courses.length > 0 ? (
                    currentEmployee.courses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{course.title}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {course.institution}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800 tabular-nums">
                          {course.hours} hrs
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono tabular-nums">
                          {course.completionDate}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-medium text-emerald-800 text-xs">
                              {course.accreditation}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No training courses currently logged for this profile.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <span>
                Total Professional Development Hours:{' '}
                <strong className="text-slate-900 font-mono tabular-nums">
                  {currentEmployee.courses?.reduce((acc, c) => acc + (c.hours || 0), 0) || 0} Hours
                </strong>
              </span>
              <span className="text-indigo-700 font-semibold">
                Faculty Standing: In Good Standing & Verified
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#0a1128] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Edit Employee Profile: {currentEmployee.name}</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.role || ''}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={editForm.departmentName || currentEmployee.departmentName}
                    onChange={(e) => {
                      const dept = departments.find(d => d.name === e.target.value);
                      setEditForm({
                        ...editForm,
                        departmentName: e.target.value,
                        departmentId: dept ? dept.id : currentEmployee.departmentId,
                        faculty: dept ? dept.faculty : currentEmployee.faculty
                      });
                    }}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff Classification
                  </label>
                  <select
                    value={editForm.type || currentEmployee.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
                  >
                    <option value="academic">Academic Faculty</option>
                    <option value="administrative">Administrative Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reporting Officer / Dean
                  </label>
                  <input
                    type="text"
                    value={editForm.managerName || ''}
                    onChange={(e) => setEditForm({ ...editForm, managerName: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Campus
                  </label>
                  <select
                    value={editForm.campus || currentEmployee.campus}
                    onChange={(e) => setEditForm({ ...editForm, campus: e.target.value as any })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
                  >
                    <option value="Main Campus">Main Campus</option>
                    <option value="North Campus">North Campus</option>
                    <option value="Downtown Innovation Hub">Downtown Innovation Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone & Extension
                  </label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Office Location
                  </label>
                  <input
                    type="text"
                    value={editForm.office || ''}
                    onChange={(e) => setEditForm({ ...editForm, office: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tenure Status
                  </label>
                  <select
                    value={editForm.tenureStatus || currentEmployee.tenureStatus}
                    onChange={(e) => setEditForm({ ...editForm, tenureStatus: e.target.value as any })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
                  >
                    <option value="Tenured">Tenured</option>
                    <option value="Tenure-Track">Tenure-Track</option>
                    <option value="Special Contract">Special Contract</option>
                    <option value="Visiting / Adjunct">Visiting / Adjunct</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-lg hover:bg-indigo-800 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#0a1128] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Add Certification / Training Course</h3>
              </div>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course or Certification Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Higher Ed Research Methodologies"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accrediting Body / Institution
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harvard Bok Center for Teaching & Learning"
                  value={courseForm.institution}
                  onChange={(e) => setCourseForm({ ...courseForm, institution: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    required
                    value={courseForm.hours}
                    onChange={(e) => setCourseForm({ ...courseForm, hours: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date Completed
                  </label>
                  <input
                    type="date"
                    required
                    value={courseForm.completionDate}
                    onChange={(e) => setCourseForm({ ...courseForm, completionDate: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Credential / CEU Classification
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Faculty Fellow Level II"
                  value={courseForm.accreditation}
                  onChange={(e) => setCourseForm({ ...courseForm, accreditation: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-lg hover:bg-indigo-800 shadow-xs"
                >
                  Add to Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
