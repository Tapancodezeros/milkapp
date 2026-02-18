import React from 'react';
import { Calendar, LogOut } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const SubscriptionItem = ({ sub, onToggle, onCancel, onDelete }) => {
    return (
        <div className={`glass-card p-6 rounded-[2rem] relative overflow-hidden group transition-all duration-300 border-slate-200 dark:border-white/5 ${sub.status === 'active' ? 'border-primary-500/30' : 'opacity-80 hover:opacity-100 bg-white/60 dark:bg-white/5'}`}>
            {/* Background Gradient for Active State */}
            {sub.status === 'active' && (
                <div className="absolute inset-0 bg-primary-50/50 dark:bg-primary-500/5 pointer-events-none"></div>
            )}

            {sub.status === 'active' && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:bg-primary-500/20 transition-colors duration-700"></div>
            )}

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-white shadow-lg ${sub.status === 'active' ? 'bg-primary-600 shadow-primary-500/20' : 'bg-slate-400 dark:bg-slate-700'}`}>
                            {sub.Vendor?.name[0]}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-surface ${sub.status === 'active' ? 'bg-success animate-pulse' : 'bg-warning'}`}></div>
                    </div>
                    <div>
                        <h4 className="font-display font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight text-lg">{sub.Vendor?.name}</h4>
                        <p className="text-[10px] font-bold text-slate-500/80 dark:text-slate-500 uppercase tracking-wider mt-0.5">{sub.duration?.replace('_', ' ')}</p>
                    </div>
                </div>
                <StatusBadge status={sub.status} />
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mb-6 bg-slate-50/80 dark:bg-black/20 p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Daily Qty</span>
                    <span className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">{sub.quantity} <span className="text-[10px] text-slate-500 uppercase ml-0.5">L</span></span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rate</span>
                    <span className="text-xl font-display font-bold text-primary-600 dark:text-primary-400 tracking-tight">₹{sub.fixedRate}<span className="text-[10px] text-primary-600/60 dark:text-primary-400/60 ml-0.5">/L</span></span>
                </div>
            </div>

            <div className="relative z-10 pt-2 flex gap-2">
                {sub.status !== 'cancelled' ? (
                    <>
                        <button
                            onClick={() => onToggle(sub.id)}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-lg ${sub.status === 'active' ? 'bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/5' : 'bg-success text-white shadow-success/20 hover:bg-success/90'}`}
                        >
                            {sub.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button
                            onClick={() => onCancel(sub.id)}
                            className="px-4 py-3 bg-danger/10 text-danger rounded-xl hover:bg-danger/20 transition-all active:scale-95 border border-danger/20"
                            title="Cancel Subscription"
                        >
                            <LogOut size={16} strokeWidth={2.5} className="rotate-180" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onDelete(sub.id)}
                        className="w-full py-3 bg-danger text-white rounded-xl hover:bg-danger/90 font-bold uppercase tracking-wider text-[10px] transition-all active:scale-95 shadow-lg shadow-danger/20"
                    >
                        Delete Record
                    </button>
                )}
            </div>

            <div className="relative z-10 mt-5 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-500/80 dark:text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400 dark:text-slate-600" /> Ends: {sub.endDate}
                </p>
            </div>
        </div>
    );
};

export default SubscriptionItem;
