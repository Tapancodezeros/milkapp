import React from 'react';
import { History, CheckCircle, Clock, ArrowRight, Search } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const CustomerTransactions = ({ transactions, onVerify, onPay, onShowReceipt, searchQuery, setSearchQuery }) => {
    return (
        <div className="glass-card rounded-[2.5rem] overflow-hidden transition-colors duration-500 bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/5">
            <div className="p-8 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50 dark:bg-white/5">
                <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-2 flex items-center gap-3">
                        <div className="p-2 bg-primary-500/10 rounded-xl text-primary-600 dark:text-primary-400 border border-primary-500/20"><History size={18} strokeWidth={2.5} /></div>
                        Transactions
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">History</p>
                </div>
                <div className="relative group w-full md:w-auto">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search vendor or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-input w-full md:w-64 pl-12 pr-4 py-3 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-100 dark:bg-black/20 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <th className="px-8 py-5 first:pl-10 text-slate-500 dark:text-slate-400">Date</th>
                            <th className="px-8 py-5 text-slate-500 dark:text-slate-400">Vendor</th>
                            <th className="px-8 py-5 text-right text-slate-500 dark:text-slate-400">Quantity</th>
                            <th className="px-8 py-5 text-right text-slate-500 dark:text-slate-400">Amount</th>
                            <th className="px-8 py-5 text-center text-slate-500 dark:text-slate-400">Status</th>
                            <th className="px-8 py-5 text-center last:pr-10 text-slate-500 dark:text-slate-400">Delivery</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-white/5 group transition-colors duration-300">
                                <td className="px-8 py-6 first:pl-10">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">{t.date}</span>
                                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">#{String(t.id).slice(-6)}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:bg-white group-hover:shadow-sm dark:group-hover:bg-white/10 dark:group-hover:text-white transition-all">
                                            {t.Vendor?.name?.[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-display font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{t.Vendor?.name}</span>
                                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Seller</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm tabular-nums">{t.quantity} <span className="text-slate-400 dark:text-slate-500 font-bold ml-0.5 uppercase text-[9px]">L</span></span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="font-display font-bold text-slate-900 dark:text-white text-sm tabular-nums">₹{t.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <StatusBadge status={t.status} />
                                        {t.status === 'pending' && (
                                            <button
                                                onClick={() => onPay(t.id)}
                                                className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider hover:text-primary-500 dark:hover:text-primary-300 transition-colors border-b border-primary-500/30 hover:border-primary-400"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 last:pr-10 text-center">
                                    {t.deliveryStatus === 'delivered' ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="flex items-center justify-center gap-1.5 text-success font-bold text-[9px] uppercase tracking-widest bg-success/10 py-1.5 px-3 rounded-xl border border-success/20 mx-auto w-fit shadow-lg shadow-success/5">
                                                <CheckCircle size={12} strokeWidth={3} /> Received
                                            </span>
                                            <button
                                                onClick={() => onShowReceipt(t)}
                                                className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group/receipt"
                                            >
                                                Receipt
                                                <ArrowRight size={10} className="group-hover/receipt:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    ) : t.deliveryStatus === 'not_delivered' ? (
                                        <span className="flex items-center justify-center gap-1.5 text-danger font-bold text-[9px] uppercase tracking-widest bg-danger/10 py-1.5 px-3 rounded-xl border border-danger/20 mx-auto w-fit">
                                            Not Delivered
                                        </span>
                                    ) : (
                                        <div className="flex flex-col gap-2 items-center">
                                            <button
                                                onClick={() => onVerify(t.id, 'delivered')}
                                                disabled={t.status === 'pending'}
                                                className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-300 font-bold text-[9px] uppercase tracking-widest bg-primary-100 dark:bg-primary-900/20 py-2 px-4 rounded-xl border border-primary-500/30 hover:bg-primary-600 hover:text-white hover:border-primary-500 transition-all mx-auto w-fit active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                                            >
                                                <Clock size={12} strokeWidth={3} /> Received?
                                            </button>
                                            <button
                                                onClick={() => onVerify(t.id, 'not_delivered')}
                                                disabled={t.status === 'pending'}
                                                className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-danger hover:border-b hover:border-danger/30 transition-all disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:border-transparent"
                                            >
                                                Not Received
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="py-32 flex flex-col items-center justify-center text-slate-500 gap-6">
                        <div className="bg-white dark:bg-white/5 p-8 rounded-full border border-slate-100 dark:border-white/5 shadow-inner">
                            <History size={48} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs">No activity</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-600 mt-2">Transactions will appear here</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerTransactions;
