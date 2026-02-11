import React from 'react';

const StatsCard = ({ label, val, icon: Icon, color, sub }) => {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/20 dark:border-blue-900/30',
        indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/20 dark:border-indigo-900/30',
        emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/20 dark:border-emerald-900/30',
        orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/20 dark:border-orange-900/30',
        pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200/20 dark:border-pink-900/30',
    };

    const dotColors = {
        emerald: 'bg-emerald-500',
        indigo: 'bg-indigo-500',
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        pink: 'bg-pink-500'
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-2">
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50 dark:opacity-20"></div>

            <div className={`relative z-10 ${colorClasses[color] || colorClasses.blue} p-4 rounded-[1.5rem] w-fit mb-8 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                <Icon size={26} strokeWidth={2.5} />
            </div>

            <div className="relative z-10">
                <span className="stat-label dark:text-slate-500">{label}</span>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white leading-tight tracking-tight mb-4">{val}</h3>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className={`w-2 h-2 rounded-full ${dotColors[color] || 'bg-slate-300'} animate-pulse`}></div>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{sub}</span>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
