import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Wallet, 
  Plus, 
  Search, 
  MapPin, 
  Edit2, 
  X, 
  Save, 
  ChevronRight
} from 'lucide-react';
import { Department } from '../types';

interface DepartmentsViewProps {
  departments: Department[];
  onSelectDepartmentForDirectory: (departmentName: string) => void;
  onUpdateDepartment: (department: Department) => void;
  onAddDepartment: (department: Omit<Department, 'id'>) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  departments,
  onSelectDepartmentForDirectory,
  onUpdateDepartment,
  onAddDepartment
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit modal
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New department form
  const [newDeptForm, setNewDeptForm] = useState({
    name: '',
    code: '',
    headName: '',
    headRole: 'Department Chair & Professor',
    faculty: 'Engineering & Technology' as const,
    employeeCount: 20,
    academicCount: 16,
    adminCount: 4,
    allocatedBudget: 2500000,
    spentBudget: 2100000,
    campus: 'Main Campus',
    location: 'Science & Innovation Quad',
    description: ''
  });

  // Aggregated totals
  const totalAllocated = departments.reduce((acc, d) => acc + d.allocatedBudget, 0);
  const totalSpent = departments.reduce((acc, d) => acc + d.spentBudget, 0);
  const totalStaff = departments.reduce((acc, d) => acc + d.employeeCount, 0);
  const totalAcademic = departments.reduce((acc, d) => acc + d.academicCount, 0);

  // Filter departments
  const filteredDepartments = departments.filter((dept) => {
    const matchesFaculty = selectedFaculty === 'all' || dept.faculty === selectedFaculty;
    const matchesSearch = 
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.headName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFaculty && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      onUpdateDepartment(editingDept);
      setEditingDept(null);
    }
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeptForm.name.trim()) {
      onAddDepartment({
        ...newDeptForm,
        employeeCount: Number(newDeptForm.academicCount) + Number(newDeptForm.adminCount)
      });
      setIsAddModalOpen(false);
      setNewDeptForm({
        name: '',
        code: '',
        headName: '',
        headRole: 'Department Chair & Professor',
        faculty: 'Engineering & Technology',
        employeeCount: 20,
        academicCount: 16,
        adminCount: 4,
        allocatedBudget: 2500000,
        spentBudget: 2100000,
        campus: 'Main Campus',
        location: 'Science & Innovation Quad',
        description: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-[#0a1128] via-[#101f42] to-[#1e1b4b] text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              Academic Divisions & Fiscal Operations
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Collegiate Department Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track divisional headcount, academic department chairs, and annual faculty salary budget utilization.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-950/20 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Department</span>
          </button>
        </div>

        {/* Aggregated Totals Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-left">
          <div>
            <span className="text-[11px] text-slate-300 font-medium">Active Departments</span>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {departments.length} Divisions
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-300 font-medium">Allocated Salary Budget</span>
            <div className="text-xl font-bold font-mono text-amber-300 tabular-nums mt-0.5">
              {formatCurrency(totalAllocated)}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-300 font-medium">Budget Realized to Date</span>
            <div className="text-xl font-bold font-mono text-emerald-300 tabular-nums mt-0.5">
              {Math.round((totalSpent / totalAllocated) * 100)}% ({formatCurrency(totalSpent)})
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-300 font-medium">Total Staff Workforce</span>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {totalStaff} ({totalAcademic} Academic)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* School Category Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          {[
            { id: 'all', label: 'All Schools' },
            { id: 'Engineering & Technology', label: 'Engineering & Tech' },
            { id: 'Health & Medical Sciences', label: 'Health & Medical' },
            { id: 'Business & Economics', label: 'Business & Econ' },
            { id: 'Administration & Operations', label: 'Administration' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFaculty(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                selectedFaculty === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search department or chair..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 text-left"
          />
        </div>

      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDepartments.map((dept) => {
          const percentUsed = Math.min(100, Math.round((dept.spentBudget / dept.allocatedBudget) * 100));
          const remainingBudget = dept.allocatedBudget - dept.spentBudget;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group text-left"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {dept.faculty}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {dept.name}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {dept.code}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              {/* Department Head & Staff Meta */}
              <div className="p-5 space-y-4">
                
                {/* Department Head */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#0a1128] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {dept.headName.split(' ')[1]?.[0] || 'D'}{dept.headName.split(' ')[0]?.[0] || 'C'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block font-medium">Department Head</span>
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {dept.headName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {dept.headRole}
                    </div>
                  </div>
                </div>

                {/* Head-Count Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-indigo-50/50 border border-indigo-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Total Staff</span>
                    <span className="text-base font-black text-indigo-950 font-mono tabular-nums">
                      {dept.employeeCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-100">
                    <span className="text-[10px] text-slate-500 block font-medium">Faculty</span>
                    <span className="text-base font-black text-amber-900 font-mono tabular-nums">
                      {dept.academicCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100/70 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-medium">Admin/Tech</span>
                    <span className="text-base font-black text-slate-800 font-mono tabular-nums">
                      {dept.adminCount}
                    </span>
                  </div>
                </div>

                {/* Allocated Salary Budget vs Spent */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-indigo-700" />
                      Annual Salary Budget:
                    </span>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatCurrency(dept.allocatedBudget)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentUsed > 90
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-indigo-600 to-indigo-800'
                      }`}
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Spent: {formatCurrency(dept.spentBudget)} ({percentUsed}%)</span>
                    <span className="font-medium text-slate-700">Available: {formatCurrency(remainingBudget)}</span>
                  </div>
                </div>

                {/* Campus & Location */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{dept.campus} · {dept.location}</span>
                </div>

              </div>

              {/* Card Actions Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectDepartmentForDirectory(dept.name)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg transition-colors border border-slate-200 hover:border-indigo-300 shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>View Faculty ({dept.employeeCount})</span>
                </button>

                <button
                  onClick={() => setEditingDept(dept)}
                  className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                  title="Edit budget or department chair"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
          No collegiate departments found matching the filter criteria.
        </div>
      )}

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#0a1128] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Edit Department: {editingDept.name}</h3>
              </div>
              <button
                onClick={() => setEditingDept(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Head / Chair Name
                </label>
                <input
                  type="text"
                  required
                  value={editingDept.headName}
                  onChange={(e) => setEditingDept({ ...editingDept, headName: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Allocated Annual Salary Budget ($ USD)
                </label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={editingDept.allocatedBudget}
                  onChange={(e) => setEditingDept({ ...editingDept, allocatedBudget: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spent Budget to Date ($ USD)
                </label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={editingDept.spentBudget}
                  onChange={(e) => setEditingDept({ ...editingDept, spentBudget: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Office Location
                </label>
                <input
                  type="text"
                  value={editingDept.location}
                  onChange={(e) => setEditingDept({ ...editingDept, location: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-lg hover:bg-indigo-800 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Department</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-[#0a1128] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Establish New Academic Division</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Department of Cognitive Science"
                    value={newDeptForm.name}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="COG-SCI"
                    value={newDeptForm.code}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, code: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  School / Faculty
                </label>
                <select
                  value={newDeptForm.faculty}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, faculty: e.target.value as any })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
                >
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Health & Medical Sciences">Health & Medical Sciences</option>
                  <option value="Business & Economics">Business & Economics</option>
                  <option value="Administration & Operations">Administration & Operations</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department Chair
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. / Prof..."
                    value={newDeptForm.headName}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, headName: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Campus
                  </label>
                  <select
                    value={newDeptForm.campus}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, campus: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
                  >
                    <option value="Main Campus">Main Campus</option>
                    <option value="North Campus">North Campus</option>
                    <option value="Downtown Innovation Hub">Downtown Innovation Hub</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Salary Budget ($)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    required
                    value={newDeptForm.allocatedBudget}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, allocatedBudget: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Faculty Positions
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newDeptForm.academicCount}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, academicCount: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scope & Research Description
                </label>
                <textarea
                  rows={2}
                  value={newDeptForm.description}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, description: e.target.value })}
                  placeholder="Key research fields, academic aims and curriculum overview..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-lg hover:bg-indigo-800 shadow-xs"
                >
                  Establish Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
