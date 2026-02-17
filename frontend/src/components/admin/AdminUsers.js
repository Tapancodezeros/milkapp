import React from 'react';
import { Pencil, Trash2, KeyRound, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminUsers = ({
    data,
    role,
    sortConfig,
    requestSort,
    isDarkMode,
    onEdit,
    onDelete,
    onResetPassword,
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
                            <th onClick={() => requestSort('name')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th onClick={() => requestSort('email')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Phone</th>
                            {role === 'customers' && (
                                <th onClick={() => requestSort('walletBalance')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Wallet {sortConfig.key === 'walletBalance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                            )}
                            {role === 'vendors' && (
                                <>
                                    <th onClick={() => requestSort('rate')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Rate {sortConfig.key === 'rate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('availableMilk')} className="cursor-pointer px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Stock {sortConfig.key === 'availableMilk' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Status</th>
                                </>
                            )}
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                        {data.map((item) => (
                            <tr key={item.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                                <td className="px-8 py-5">
                                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter mt-0.5">ID: #{item.id}</div>
                                </td>
                                <td className={`px-8 py-5 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.email}</td>
                                <td className={`px-8 py-5 text-sm font-mono italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.phone}</td>
                                {role === 'customers' && (
                                    <td className={`px-8 py-5 text-sm font-black ${item.walletBalance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        ₹{item.walletBalance || 0}
                                    </td>
                                )}
                                {role === 'vendors' && (
                                    <>
                                        <td className="px-8 py-5 text-sm font-bold text-blue-500">₹{item.rate}/L</td>
                                        <td className={`px-8 py-5 text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {item.availableMilk ? `${item.availableMilk}L` : '0L'}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.isAvailable
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {item.isAvailable ? 'Active' : 'Holiday'}
                                            </span>
                                        </td>
                                    </>
                                )}
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-blue-500 hover:bg-blue-500/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                            title="Edit User"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => onResetPassword(item.id)}
                                            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                            title="Generate Reset Password Link"
                                        >
                                            <KeyRound size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-red-500 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
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

export default AdminUsers;
