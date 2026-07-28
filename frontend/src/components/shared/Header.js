import React from 'react';
import { LogOut, Briefcase, Store, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ user, onLogout, role, extra, onSettings }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50 px-3.5 sm:px-8 py-3 sm:py-5 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-colors duration-500">
            <div className="flex items-center gap-2.5 sm:gap-4">
                <div className={`bg-gradient-to-br ${role === 'vendor' ? 'from-indigo-600 via-indigo-500 to-purple-600' : 'from-blue-600 via-blue-500 to-indigo-600'} p-2.5 sm:p-3 rounded-[1rem] sm:rounded-[1.2rem] text-white shadow-xl shadow-indigo-200/40 dark:shadow-indigo-500/20 relative overflow-hidden group flex-shrink-0`}>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        {role === 'vendor' ? <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} /> : <Store className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />}
                    </div>
                </div>
                <div className="flex flex-col min-w-0">
                    <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-0.5 sm:mb-1 truncate">
                        {role === 'vendor' ? 'Dairy Hub' : 'Marketplace'}
                    </h1>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate max-w-[110px] sm:max-w-xs">
                            {role === 'vendor' ? `${user?.name || 'Vendor'}` : `${user?.name || 'Customer'}`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-6">
                {extra}

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 border border-slate-100 dark:border-slate-700 shadow-sm"
                        title={isDarkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />}
                    </button>

                    <button
                        onClick={onSettings}
                        className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 border border-slate-100 dark:border-slate-700 shadow-sm"
                        title="Profile Settings"
                    >
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    </button>
                </div>

                <div className="h-6 sm:h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden xs:block"></div>

                <button
                    onClick={onLogout}
                    className="group relative flex items-center gap-1.5 transition-all p-2 sm:p-3 px-3 sm:px-6 rounded-xl sm:rounded-[1.2rem] bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 active:scale-95 border border-slate-100 dark:border-slate-700 hover:border-red-100 dark:hover:border-red-900/30 font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-sm hover:shadow-red-500/10"
                    title="Sign Out"
                >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Sign Out</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
