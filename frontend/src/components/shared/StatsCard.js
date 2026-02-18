import React from 'react';
import { TrendingUp, Activity, User, CreditCard } from 'lucide-react';

const StatsCard = ({ label, val, icon: Icon, color, sub }) => {
    // Map colors to our design system variables
    const colorStyles = {
        primary: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
        secondary: 'bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 border-secondary-500/20',
        accent: 'bg-accent-500/10 text-accent-600 dark:text-accent-400 border-accent-500/20',
        success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        danger: 'bg-danger/10 text-danger border-danger/20',
        emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };

    const dotColors = {
        primary: 'bg-primary-500 shadow-primary-500/50',
        secondary: 'bg-secondary-500 shadow-secondary-500/50',
        accent: 'bg-accent-500 shadow-accent-500/50',
        success: 'bg-emerald-500 shadow-emerald-500/50',
        warning: 'bg-warning shadow-warning/50',
        danger: 'bg-danger shadow-danger/50',
        emerald: 'bg-emerald-500 shadow-emerald-500/50',
    };

    const selectedColorStyle = colorStyles[color] || colorStyles.primary;
    const selectedDotColor = dotColors[color] || dotColors.primary;

    return (
        <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10">
            {/* Decorative background glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:scale-150 ${color === 'primary' ? 'bg-primary-500' : 'bg-accent-500'}`}></div>

            <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${selectedColorStyle} shadow-lg shadow-black/5 dark:shadow-none`}>
                <Icon size={22} strokeWidth={2.5} />
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">{val}</h3>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedDotColor} animate-pulse shadow-glow`}></div>
                    <span className="text-[9px] font-bold text-slate-500/80 dark:text-slate-500 uppercase tracking-widest">{sub}</span>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
