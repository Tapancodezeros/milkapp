import React from 'react';

const StatusBadge = ({ status, variant = 'default' }) => {
    const variants = {
        active: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        paused: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400',
        cancelled: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400',
        pending: 'bg-orange-500/10 dark:bg-orange-900/20 border-orange-500/50 dark:border-orange-900/30 text-orange-400',
        stable: 'bg-emerald-500/10 dark:bg-emerald-900/20 border-emerald-500/50 dark:border-emerald-900/30 text-emerald-400',
        completed: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400',
        default: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${variants[status] || variants.default}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
