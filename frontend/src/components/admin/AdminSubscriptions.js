import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminSubscriptions = ({
    subscriptions,
    sortConfig,
    requestSort,
    isDarkMode,
    currentPage,
    totalPages,
    setCurrentPage
}) => {
    return (
        <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className={`border-b border-white/5 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <th onClick={() => requestSort('Customer.name')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Customer {sortConfig.key === 'Customer.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th onClick={() => requestSort('Vendor.name')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Vendor {sortConfig.key === 'Vendor.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th onClick={() => requestSort('quantity')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th onClick={() => requestSort('status')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                        {subscriptions.map((item) => (
                            <tr key={item.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                                <td className={`px-8 py-5 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Customer?.name}</td>
                                <td className={`px-8 py-5 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Vendor?.name}</td>
                                <td className={`px-8 py-5 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.quantity}L / day</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
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

export default AdminSubscriptions;
