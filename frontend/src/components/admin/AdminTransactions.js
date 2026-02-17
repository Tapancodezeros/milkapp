import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminTransactions = ({
    transactions,
    filter,
    setFilter,
    sortConfig,
    requestSort,
    isDarkMode,
    currentPage,
    totalPages,
    setCurrentPage
}) => {
    return (
        <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>All Transactions</h3>
                <div className="flex gap-2">
                    {['all', 'completed', 'pending'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${filter === status ? (isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                        >
                            {status === 'completed' ? 'Paid' : status}
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className={`border-b border-white/5 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <th onClick={() => requestSort('Customer.name')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Customer {sortConfig.key === 'Customer.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th onClick={() => requestSort('Vendor.name')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Vendor {sortConfig.key === 'Vendor.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th onClick={() => requestSort('amount')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th onClick={() => requestSort('status')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th onClick={() => requestSort('date')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                        {transactions.map((item) => (
                            <tr key={item.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                                <td className="px-8 py-5">
                                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Customer?.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">{item.Customer?.phone}</div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Vendor?.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">{item.Vendor?.phone}</div>
                                </td>
                                <td className="px-8 py-5 font-black text-blue-500">₹{item.amount}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-xs text-slate-500 font-bold">{new Date(item.date || item.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={`flex items-center justify-between px-8 py-6 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-xl transition-all ${currentPage === 1
                            ? 'opacity-50 cursor-not-allowed text-slate-400'
                            : isDarkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-xl transition-all ${currentPage === totalPages
                            ? 'opacity-50 cursor-not-allowed text-slate-400'
                            : isDarkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-900'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminTransactions;
