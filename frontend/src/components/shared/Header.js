import { LogOut, Briefcase, Store, Moon, Sun, Settings, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ user, onLogout, role, extra, onSettings }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <header className="fixed top-0 inset-x-0 z-50 h-20 px-6 lg:px-12 flex items-center justify-between pointer-events-none">
            {/* Glass Background Layer */}
            <div className="absolute inset-0 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 pointer-events-auto transition-colors duration-300"></div>

            <div className="relative z-10 flex items-center gap-4 pointer-events-auto">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${role === 'vendor' ? 'from-accent-500 to-primary-500' : 'from-primary-500 to-accent-500'} shadow-lg shadow-primary-500/20 text-white`}>
                    {role === 'vendor' ? <Briefcase size={20} strokeWidth={2.5} /> : <Store size={20} strokeWidth={2.5} />}
                </div>
                <div>
                    <h1 className="text-lg font-display font-bold text-slate-900 dark:text-white leading-none mb-1 transition-colors">
                        {role === 'vendor' ? 'Dairy Hub' : 'Marketplace'}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">
                            {user?.name}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-4 pointer-events-auto">
                {extra}

                <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-sm transition-colors">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-all shadow-sm dark:shadow-none"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button
                        onClick={onSettings}
                        className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-all shadow-sm dark:shadow-none"
                    >
                        <Settings size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-all relative shadow-sm dark:shadow-none">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white dark:border-[#0F172A]"></span>
                    </button>
                </div>

                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white uppercase tracking-wider group shadow-sm dark:shadow-none"
                >
                    <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Sign Out</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
