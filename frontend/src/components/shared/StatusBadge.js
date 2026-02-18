import React from 'react';

const StatusBadge = ({ status, variant }) => {
    // Standardize status text
    const statusKey = (status || '').toLowerCase();

    // Map status/variant to design system tokens
    const styles = {
        // Success states
        active: 'bg-success/10 text-success border-success/20 shadow-glow-sm',
        completed: 'bg-success/10 text-success border-success/20 shadow-glow-sm',
        delivered: 'bg-success/10 text-success border-success/20 shadow-glow-sm',
        stable: 'bg-success/10 text-success border-success/20 shadow-glow-sm',

        // Warning/Yellow states
        pending: 'bg-warning/10 text-warning border-warning/20 shadow-glow-sm',
        paused: 'bg-warning/10 text-warning border-warning/20 shadow-glow-sm',

        // Danger/Red states
        cancelled: 'bg-danger/10 text-danger border-danger/20 shadow-glow-sm',
        not_delivered: 'bg-danger/10 text-danger border-danger/20 shadow-glow-sm',

        // Default/Neutral states
        default: 'bg-surface text-slate-400 border-white/10'
    };

    // Use variant if provided, otherwise fallback to statusKey, then default
    const selectedStyle = styles[variant] || styles[statusKey] || styles.default;

    // Format label (remove underscores)
    const label = status?.replace('_', ' ') || 'Unknown';

    return (
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md transition-all duration-300 hover:scale-105 ${selectedStyle}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
