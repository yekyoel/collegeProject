import React, { useState } from 'react';
import { UserPlus, X, Save } from 'lucide-react';
import { Department, Employee, StaffType } from '../types';

interface NewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  onAddEmployee: (employee: Employee) => void;
}

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({
  isOpen,
  onClose,
  departments,
  onAddEmployee
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [role, setRole] = useState('');
  const [type, setType] = useState<StaffType>('academic');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [campus, setCampus] = useState<'Main Campus' | 'North Campus' | 'Downtown Innovation Hub'>('Main Campus');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 234-');
  const [office, setOffice] = useState('');
  const [managerName, setManagerName] = useState('Dr. Julian Vance (Chair)');
  const [tenureStatus, setTenureStatus] = useState<'Tenured' | 'Tenure-Track' | 'Special Contract' | 'Visiting / Adjunct'>('Tenure-Track');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === departmentId) || departments[0];
    const generatedId = `EMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const initials = name
      .split(' ')
      .map(part => part.replace(/['"״״.,]/g, '')[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeId: generatedId,
      nationalId: nationalId || 'ID-992-01-344',
      name,
      role,
      academicRank: type === 'academic' ? role : undefined,
      departmentId: dept.id,
      departmentName: dept.name,
      faculty: dept.faculty,
      type,
      campus,
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@apexcollege.edu`,
      phone,
      office: office || 'Turing Science Hall, Room 101',
      managerName,
      managerRole: 'Department Chair / Division Head',
      joinDate: new Date().toISOString().split('T')[0],
      tenureStatus,
      avatarBg: 'bg-[#0a1128]',
      initials: initials || 'FC',
      weeklyHours: 40,
      courses: [
        {
          id: `c-${Date.now()}`,
          title: 'New Faculty Onboarding & Institutional Compliance',
          institution: 'Office of the Provost & HR Operations',
          completionDate: new Date().toISOString().split('T')[0],
          hours: 8,
          status: 'Completed',
          accreditation: 'Statutory Onboarding Requirement'
        }
      ]
    };

    onAddEmployee(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 bg-[#0a1128] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Onboard New Faculty / Staff Member</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name & Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Eleanor Rigby"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SSN / National ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ID-402-99-182"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Staff Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as StaffType)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
              >
                <option value="academic">Academic Faculty & Research</option>
                <option value="administrative">Administrative & Technical Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Rank / Role
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Assistant Professor of Robotics"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department Assignment
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Campus
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value as any)}
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
                placeholder="name@apexcollege.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone / Extension
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Office Location
              </label>
              <input
                type="text"
                placeholder="e.g. Turing Science Hall, Room 312"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tenure Status
              </label>
              <select
                value={tenureStatus}
                onChange={(e) => setTenureStatus(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-700 bg-white"
              >
                <option value="Tenure-Track">Tenure-Track</option>
                <option value="Tenured">Tenured</option>
                <option value="Special Contract">Special Contract</option>
                <option value="Visiting / Adjunct">Visiting / Adjunct</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-700 text-white text-xs font-semibold rounded-lg hover:bg-indigo-800 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Create Personnel Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
