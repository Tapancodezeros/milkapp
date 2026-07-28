import React from 'react';
import { Calendar } from 'lucide-react';
import SubscriptionItem from './SubscriptionItem';

const SubscriptionsPanel = ({ subscriptions, onToggleStatus, onCancel, onDelete }) => {
    return (
        <div className="lg:col-span-4 space-y-6 sm:space-y-10 group/sub">
            <div className="flex justify-between items-end px-2 border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 sm:gap-3">
                        <div className="p-2 sm:p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl sm:rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        </div>
                        Subscriptions
                    </h2>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mt-1.5 sm:mt-2 ml-1">Recurring Orders</p>
                </div>
                <div className="bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black px-2.5 sm:px-3 py-1 rounded-full shadow-lg shadow-indigo-100 dark:shadow-none">
                    {subscriptions.length}
                </div>
            </div>
            <div className="space-y-6 sm:space-y-8">
                {subscriptions.map(sub => (
                    <SubscriptionItem
                        key={sub.id}
                        sub={sub}
                        onToggleStatus={onToggleStatus}
                        onCancel={onCancel}
                        onDelete={onDelete}
                    />
                ))}
                {subscriptions.length === 0 && (
                    <div className="py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 gap-3">
                        <Calendar size={32} className="text-slate-200 dark:text-slate-700" />
                        <p className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest text-center px-4">No Active Subscriptions</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionsPanel;
