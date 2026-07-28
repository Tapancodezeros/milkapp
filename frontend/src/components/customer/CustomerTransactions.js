import React from 'react';
import { History, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const CustomerTransactions = ({ transactions, onVerify, onPay, onShowReceipt }) => {
    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden transition-colors duration-500">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-gradient-to-b from-slate-50/50 to-white/0 dark:from-slate-900/50 dark:to-transparent">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2 flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50/50 dark:bg-blue-900/20 rounded-[1.2rem] text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 shadow-sm"><History size={22} strokeWidth={2.5} /></div>
                        Transactions
                    </h2>
                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">History</p>
                </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                            <th className="px-10 py-6">Date</th>
                            <th className="px-10 py-6">Vendor</th>
                            <th className="px-10 py-6 text-right">Quantity</th>
                            <th className="px-10 py-6 text-right">Amount</th>
                            <th className="px-10 py-6 text-center">Status</th>
                            <th className="px-10 py-6 text-center">Delivery</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50/50 dark:divide-slate-800/50">
                        {transactions.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group transition-all duration-300">
                                <td className="px-10 py-8">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">{t.date}</span>
                                        <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase mt-0.5">#{String(t.id).slice(-6)}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-tr from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-sm font-black text-slate-600 dark:text-slate-300 shadow-sm group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all">
                                            {t.Vendor?.name?.[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t.Vendor?.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Seller</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <span className="font-black text-slate-700 dark:text-slate-300 text-sm tabular-nums">{t.quantity} <span className="text-slate-300 dark:text-slate-600 font-bold ml-0.5 uppercase text-[10px]">L</span></span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <span className="font-black text-slate-900 dark:text-white text-base tabular-nums">₹{t.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <StatusBadge status={t.status} />
                                        {t.status === 'pending' && (
                                            <button
                                                onClick={() => onPay(t.id)}
                                                className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors border-b border-indigo-200 dark:border-indigo-900"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    {t.deliveryStatus === 'delivered' ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-50/50 dark:bg-emerald-900/10 py-2 px-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 mx-auto w-fit shadow-sm shadow-emerald-50 dark:shadow-none">
                                                <CheckCircle size={14} strokeWidth={3} /> Received
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
                                            <span className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-black text-[10px] uppercase tracking-widest bg-red-50/50 dark:bg-red-900/10 py-2 px-4 rounded-2xl border border-red-100/50 dark:border-red-900/30 mx-auto w-fit">
                                                Not Delivered
                                            </span>
                                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                (Refunded to Wallet)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3 items-center">
                                            <button
                                                onClick={() => onVerify(t.id, 'delivered')}
                                                disabled={t.status === 'pending'}
                                                className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest bg-white dark:bg-slate-800 py-2.5 px-5 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-lg shadow-blue-500/5 dark:shadow-none hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white hover:border-blue-600 transition-all mx-auto w-fit active:scale-95 disabled:opacity-30"
                                            >
                                                <Clock size={14} strokeWidth={3} /> Received?
                                            </button>
                                            <button
                                                onClick={() => onVerify(t.id, 'not_delivered')}
                                                disabled={t.status === 'pending'}
                                                className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-red-500 dark:hover:text-red-400 hover:border-b hover:border-red-200 dark:hover:border-red-900 transition-all"
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
                    <div className="py-40 flex flex-col items-center justify-center text-slate-300 dark:text-slate-800 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-full border border-slate-100 dark:border-slate-800 shadow-inner group-hover:scale-110 transition-transform duration-700">
                            <History size={60} className="text-slate-200 dark:text-slate-700" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] text-sm">No activity</p>
                            <p className="text-xs font-bold text-slate-300 dark:text-slate-700 mt-2">Transactions will appear here</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerTransactions;
