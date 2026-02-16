import React from 'react';
import { Calendar, LogOut } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const SubscriptionItem = ({ sub, onToggle, onCancel, onDelete }) => {
    return (
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group ${sub.status === 'active'
            ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/30 shadow-[0_20px_50px_rgba(79,70,229,0.06)] dark:shadow-none'
            : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800'}`}>

            {sub.status === 'active' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full translate-x-8 -translate-y-8 opacity-40 dark:opacity-20 group-hover:scale-125 transition-transform duration-700"></div>
            )}

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${sub.status === 'active' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-slate-400 dark:bg-slate-700 shadow-slate-200 dark:shadow-none'}`}>
                            {sub.Vendor?.name[0]}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${sub.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">{sub.Vendor?.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{sub.duration?.replace('_', ' ')}</p>
                    </div>
                </div>
                <StatusBadge status={sub.status} />
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors duration-500">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Daily Qty</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{sub.quantity} <span className="text-xs text-slate-400 dark:text-slate-600 uppercase ml-0.5">L</span></span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 text-indigo-600 dark:text-indigo-400">Rate</span>
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">₹{sub.fixedRate}<span className="text-xs text-indigo-300 dark:text-indigo-500 ml-0.5">/L</span></span>
                </div>
            </div>

            <div className="relative z-10 pt-2 flex gap-3">
                {sub.status !== 'cancelled' ? (
                    <>
                        <button
                            onClick={() => onToggle(sub.id)}
                            className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg ${sub.status === 'active' ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-slate-700' : 'bg-emerald-600 text-white shadow-emerald-100 dark:shadow-none hover:bg-emerald-500'}`}
                        >
                            {sub.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                        <button
                            onClick={() => onCancel(sub.id)}
                            className="px-5 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300 transition-all active:scale-95 border border-red-100/50 dark:border-red-900/30"
                            title="Cancel Subscription"
                        >
                            <LogOut size={18} strokeWidth={2.5} className="rotate-180" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onDelete(sub.id)}
                        className="w-full py-3.5 bg-red-600 text-white rounded-2xl hover:bg-red-500 font-bold uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-red-200 dark:shadow-none"
                    >
                        Delete Record
                    </button>
                )}
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Calendar size={12} strokeWidth={2.5} className="text-slate-300 dark:text-slate-600" /> Ends: {sub.endDate}
                </p>
            </div>
        </div>
    );
};

export default SubscriptionItem;
