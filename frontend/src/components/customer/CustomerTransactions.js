import React from 'react';
import { History, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const CustomerTransactions = ({ transactions, onVerify, onPay, onShowReceipt }) => {
    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden transition-colors duration-500">
            <div className="p-4 sm:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-gradient-to-b from-slate-50/50 to-white/0 dark:from-slate-900/50 dark:to-transparent">
                <div>
                    <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-2.5 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl sm:rounded-[1.2rem] text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 shadow-sm">
                            <History className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        </div>
                        Transactions
                    </h2>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1 sm:ml-2">History</p>
                </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[640px]">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                            <th className="px-4 sm:px-10 py-3.5 sm:py-6">Date</th>
                            <th className="px-4 sm:px-10 py-3.5 sm:py-6">Vendor</th>
                            <th className="px-4 sm:px-10 py-3.5 sm:py-6 text-right">Quantity</th>
                            <th className="px-4 sm:px-10 py-3.5 sm:py-6 text-right">Amount</th>
                            <th className="px-4 sm:px-10 py-3.5 sm:py-6 text-center">Status</th>
                            <th className="px-4 sm:px-10 py-3.5 sm:py-6 text-center">Delivery</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50/50 dark:divide-slate-800/50">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group transition-all duration-300">
                                <td className="px-4 sm:px-10 py-4 sm:py-8 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-500 dark:text-slate-400 text-[10px] sm:text-[11px] uppercase tracking-wider">{t.date}</span>
                                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase mt-0.5">#{String(t.id).slice(-6)}</span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-10 py-4 sm:py-8 whitespace-nowrap">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-[1.2rem] bg-gradient-to-tr from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-xs sm:text-sm font-black text-slate-600 dark:text-slate-300 shadow-sm group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all flex-shrink-0">
                                            {t.Vendor?.name?.[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[120px] sm:max-w-xs">{t.Vendor?.name}</span>
                                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Seller</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-10 py-4 sm:py-8 text-right whitespace-nowrap">
                                    <span className="font-black text-slate-700 dark:text-slate-300 text-xs sm:text-sm tabular-nums">{t.quantity} <span className="text-slate-300 dark:text-slate-600 font-bold ml-0.5 uppercase text-[9px]">L</span></span>
                                </td>
                                <td className="px-4 sm:px-10 py-4 sm:py-8 text-right whitespace-nowrap">
                                    <span className="font-black text-slate-900 dark:text-white text-xs sm:text-base tabular-nums">₹{t.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </td>
                                <td className="px-4 sm:px-10 py-4 sm:py-8 text-center whitespace-nowrap">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <StatusBadge status={t.status} />
                                        {t.status === 'pending' && (
                                            <button
                                                onClick={() => onPay(t.id)}
                                                className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em] hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors border-b border-indigo-200 dark:border-indigo-900"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 sm:px-10 py-4 sm:py-8 text-center whitespace-nowrap">
                                    {t.deliveryStatus === 'delivered' ? (
                                        <div className="flex flex-col items-center gap-1.5">
                                            <span className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-[9px] sm:text-[10px] uppercase tracking-widest bg-emerald-50/50 dark:bg-emerald-900/10 py-1.5 px-3 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30 mx-auto w-fit shadow-sm">
                                                <CheckCircle size={13} strokeWidth={3} /> Received
                                            </span>
                                            <button
                                                onClick={() => onShowReceipt(t)}
                                                className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group/receipt"
                                            >
                                                Receipt
                                                <ArrowRight size={10} className="group-hover/receipt:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    ) : t.deliveryStatus === 'not_delivered' ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="flex items-center justify-center gap-1.5 text-red-600 dark:text-red-400 font-black text-[9px] sm:text-[10px] uppercase tracking-widest bg-red-50/50 dark:bg-red-900/10 py-1.5 px-3 rounded-xl border border-red-100/50 dark:border-red-900/30 mx-auto w-fit">
                                                Not Delivered
                                            </span>
                                            <span className="text-[8px] sm:text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                (Refunded to Wallet)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2 items-center">
                                            <button
                                                onClick={() => onVerify(t.id, 'delivered')}
                                                disabled={t.status === 'pending'}
                                                className="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400 font-black text-[9px] uppercase tracking-widest bg-white dark:bg-slate-800 py-2 px-4 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all mx-auto w-fit active:scale-95 disabled:opacity-30"
                                            >
                                                <Clock size={12} strokeWidth={3} /> Received?
                                            </button>
                                            <button
                                                onClick={() => onVerify(t.id, 'not_delivered')}
                                                disabled={t.status === 'pending'}
                                                className="text-[8px] font-black text-slate-400 dark:text-slate-500 hover:text-red-500 uppercase tracking-wider transition-colors disabled:opacity-30"
                                            >
                                                Not Delivered?
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTransactions;
