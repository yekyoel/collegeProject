import React from 'react';
import { 
  Menu, 
  Clock, 
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { ActiveScreen } from './Sidebar';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onOpenMobileSidebar: () => void;
  onQuickClockToggle: (isClockedIn: boolean) => void;
  isClockedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onOpenMobileSidebar,
  onQuickClockToggle,
  isClockedIn
}) => {
  const titles: Record<ActiveScreen, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Executive HR Dashboard',
      subtitle: 'Institution-wide faculty metrics, academic-to-administrative staffing ratio, and recruitment'
    },
    profile: {
      title: 'Faculty & Staff Directory',
      subtitle: 'Employee dossiers, academic appointments, reporting lines, and professional certifications'
    },
    attendance: {
      title: 'Attendance & Shift Tracker',
      subtitle: 'Daily clock-in/out timestamps, hours reconciliation, manual overrides, and payroll exports'
    },
    departments: {
      title: 'Department Management',
      subtitle: 'Academic divisions, department chairs, faculty headcount, and allocated salary budgets'
    }
  };

  const current = titles[activeScreen];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 shadow-2xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile toggle + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col text-left">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {current.title}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Academic Date + Quick Clock Toggle Action */}
        <div className="flex items-center gap-3">
          {/* Academic Date Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium">Monday, Nov 2, 2026 · Fall Term</span>
          </div>

          {/* Quick Personal Attendance Clock Button */}
          <button
            onClick={() => onQuickClockToggle(!isClockedIn)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs ${
              isClockedIn
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-[#0a1128] text-white hover:bg-[#152352] border border-[#0a1128]'
            }`}
            title="Log individual campus attendance"
          >
            <Clock className={`w-3.5 h-3.5 ${isClockedIn ? 'text-emerald-600' : 'text-amber-400'}`} />
            <span>
              {isClockedIn ? 'Clocked In (07:55 AM)' : 'Clock In to Campus'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
