import React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Clock, 
  Building2, 
  GraduationCap, 
  CalendarDays,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export type ActiveScreen = 'dashboard' | 'profile' | 'attendance' | 'departments';

interface SidebarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  employeeCount: number;
  attendanceCount: number;
  departmentCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  employeeCount,
  attendanceCount,
  departmentCount,
  isMobileOpen,
  onCloseMobile
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveScreen,
      label: 'Executive Dashboard',
      sublabel: 'Overview, ratios & recruitment',
      icon: LayoutDashboard,
      badge: 'Main'
    },
    {
      id: 'profile' as ActiveScreen,
      label: 'Faculty & Staff Directory',
      sublabel: 'Profiles, training & credentials',
      icon: UserCheck,
      count: employeeCount
    },
    {
      id: 'attendance' as ActiveScreen,
      label: 'Attendance & Shift Tracker',
      sublabel: 'Time logs, overrides & exports',
      icon: Clock,
      count: attendanceCount
    },
    {
      id: 'departments' as ActiveScreen,
      label: 'Department Management',
      sublabel: 'Headcount & salary budgets',
      icon: Building2,
      count: departmentCount
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0a1128] text-white flex flex-col justify-between border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Institutional Brand Header */}
        <div>
          <div className="p-5 border-b border-white/10 bg-[#070b19]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center shadow-md shadow-indigo-950/50 shrink-0 text-white">
                <GraduationCap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-extrabold text-base tracking-tight text-white font-sans">Apex College</span>
                <span className="text-[10px] text-amber-300/90 font-mono tracking-wider uppercase font-semibold">Faculty & Workforce ERP</span>
              </div>
            </div>
            
            <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                Academic Year 2026–27
              </span>
              <span className="text-[11px] bg-indigo-950/80 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-700/50 font-medium">
                Fall Term
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1" aria-label="Main Navigation">
            <div className="px-3 pt-3 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Core Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950/40 font-medium'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-white text-indigo-700 shadow-2xs'
                          : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-amber-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-sm font-semibold leading-snug truncate">{item.label}</span>
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-300 truncate">
                        {item.sublabel}
                      </span>
                    </div>
                  </div>

                  {item.count !== undefined ? (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-mono tabular-nums shrink-0 ml-2 ${
                        isActive
                          ? 'bg-indigo-900/90 text-amber-200 border border-amber-400/30'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  ) : (
                    item.badge && (
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-400/30 shrink-0 ml-2">
                        {item.badge}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer with Authenticated HR Administrator */}
        <div className="p-3 border-t border-white/10 bg-[#070b19]">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                SJ
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm font-semibold text-white truncate">Sarah Jenkins</span>
                <span className="text-xs text-slate-400 truncate">VP of Human Resources</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Senior Admin Access
              </span>
              <span className="text-slate-400 font-mono">Main Campus</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
