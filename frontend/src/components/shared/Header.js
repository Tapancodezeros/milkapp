import { LogOut, Briefcase, Store, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ user, onLogout, role, extra }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50 px-8 py-5 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-colors duration-500">
            <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-br ${role === 'vendor' ? 'from-indigo-600 via-indigo-500 to-purple-600' : 'from-blue-600 via-blue-500 to-indigo-600'} p-3 rounded-[1.2rem] text-white shadow-xl shadow-indigo-200/40 dark:shadow-indigo-500/20 relative overflow-hidden group`}>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        {role === 'vendor' ? <Briefcase size={22} strokeWidth={2.5} /> : <Store size={22} strokeWidth={2.5} />}
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-1">
                        {role === 'vendor' ? 'Dairy Hub' : 'Marketplace'}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                            {role === 'vendor' ? `${user?.name} Vendor Portal` : `Customer: ${user?.name}`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {extra}

                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 border border-slate-100 dark:border-slate-700 shadow-sm"
                    title={isDarkMode ? "Light Mode" : "Dark Mode"}
                >
                    {isDarkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
                </button>

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

                <button
                    onClick={onLogout}
                    className="group relative flex items-center gap-2 transition-all p-3 px-6 rounded-[1.2rem] bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 active:scale-95 border border-slate-100 dark:border-slate-700 hover:border-red-100 dark:hover:border-red-900/30 font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-red-500/10"
                >
                    <LogOut size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Sign Out</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
