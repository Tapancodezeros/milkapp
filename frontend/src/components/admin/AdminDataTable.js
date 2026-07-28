import React from 'react';
import { Search, Pencil, KeyRound, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import LedgerStream from '../shared/LedgerStream';

const AdminDataTable = ({
    activeTab,
    filteredData,
    paginatedData,
    loading,
    isDarkMode,
    transactionFilter,
    setTransactionFilter,
    sortConfig,
    requestSort,
    setEditModal,
    handleResetPassword,
    handleDeleteUser,
    onUpdateDelivery,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage
}) => {
    if (activeTab === 'ledger') {
        return (
            <div className="pt-2">
                <LedgerStream
                    sales={paginatedData}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    onUpdateDelivery={onUpdateDelivery}
                />
            </div>
        );
    }

    if (filteredData.length === 0 && !loading) {
        return (
            <div className={`flex flex-col items-center justify-center h-80 sm:h-96 rounded-2xl sm:rounded-[2.5rem] border border-dashed p-8 sm:p-12 text-center ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] mb-4 sm:mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <Search size={40} className="text-slate-400" />
                </div>
                <h3 className={`text-lg sm:text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No results found</h3>
                <p className="text-slate-500 max-w-sm mt-1.5 sm:mt-2 font-medium text-xs sm:text-sm">We couldn't find any {activeTab} matching your current search or filters.</p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl sm:rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
            {activeTab === 'transactions' && (
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between flex-wrap gap-2">
                    <h3 className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>All Transactions</h3>
                    <div className="flex gap-2">
                        {['all', 'completed', 'pending'].map(status => (
                            <button
                                key={status}
                                onClick={() => setTransactionFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all ${transactionFilter === status ? (isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                {status === 'completed' ? 'Paid' : status}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className={`border-b border-white/5 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                            {activeTab === 'customers' || activeTab === 'vendors' ? (
                                <>
                                    <th onClick={() => requestSort('name')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('email')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th className="px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">Phone</th>
                                    {activeTab === 'vendors' && <th onClick={() => requestSort('rate')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Rate {sortConfig.key === 'rate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>}
                                    <th className="px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                </>
                            ) : activeTab === 'transactions' ? (
                                <>
                                    <th onClick={() => requestSort('Customer.name')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Customer {sortConfig.key === 'Customer.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('Vendor.name')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Vendor {sortConfig.key === 'Vendor.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('amount')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('status')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('date')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                </>
                            ) : (
                                <>
                                    <th onClick={() => requestSort('Customer.name')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Customer {sortConfig.key === 'Customer.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('Vendor.name')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Vendor {sortConfig.key === 'Vendor.name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('quantity')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th onClick={() => requestSort('status')} className="cursor-pointer px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                        {paginatedData.map((item) => (
                            <tr key={item.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                                {activeTab === 'customers' || activeTab === 'vendors' ? (
                                    <>
                                        <td className="px-6 sm:px-8 py-4 whitespace-nowrap">
                                            <div className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</div>
                                            <div className="text-[9px] text-slate-500 uppercase tracking-tighter mt-0.5">ID: #{item.id}</div>
                                        </td>
                                        <td className={`px-6 sm:px-8 py-4 text-xs sm:text-sm whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.email}</td>
                                        <td className={`px-6 sm:px-8 py-4 text-xs sm:text-sm font-mono italic whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.phone}</td>
                                        {activeTab === 'vendors' && <td className="px-6 sm:px-8 py-4 text-xs sm:text-sm font-bold text-blue-500 whitespace-nowrap">₹{item.rate}/L</td>}
                                        <td className="px-6 sm:px-8 py-4 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-1.5 sm:gap-2">
                                                <button
                                                    onClick={() => setEditModal({ isOpen: true, role: activeTab === 'vendors' ? 'vendor' : 'customer', data: { ...item }, initialData: { ...item } })}
                                                    className={`p-1.5 sm:p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-blue-500 hover:bg-blue-500/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                    title="Edit User"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleResetPassword(activeTab === 'vendors' ? 'vendor' : 'customer', item.id)}
                                                    className={`p-1.5 sm:p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                                    title="Generate Reset Password Link"
                                                >
                                                    <KeyRound size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(activeTab === 'vendors' ? 'vendor' : 'customer', item.id)}
                                                    className={`p-1.5 sm:p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-red-500 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : activeTab === 'transactions' ? (
                                    <>
                                        <td className="px-6 sm:px-8 py-4 whitespace-nowrap">
                                            <div className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Customer?.name}</div>
                                            <div className="text-[9px] text-slate-500 uppercase">{item.Customer?.phone}</div>
                                        </td>
                                        <td className="px-6 sm:px-8 py-4 whitespace-nowrap">
                                            <div className={`font-bold text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Vendor?.name}</div>
                                            <div className="text-[9px] text-slate-500 uppercase">{item.Vendor?.phone}</div>
                                        </td>
                                        <td className="px-6 sm:px-8 py-4 font-black text-blue-500 text-xs sm:text-sm whitespace-nowrap">₹{item.amount}</td>
                                        <td className="px-6 sm:px-8 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 sm:px-8 py-4 text-xs text-slate-500 font-bold whitespace-nowrap">{new Date(item.date || item.createdAt).toLocaleDateString()}</td>
                                    </>
                                ) : (
                                    <>
                                        <td className={`px-6 sm:px-8 py-4 font-bold text-xs sm:text-sm whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Customer?.name}</td>
                                        <td className={`px-6 sm:px-8 py-4 font-bold text-xs sm:text-sm whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Vendor?.name}</td>
                                        <td className={`px-6 sm:px-8 py-4 text-xs sm:text-sm whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.quantity}L / day</td>
                                        <td className="px-6 sm:px-8 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${item.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className={`p-4 border-t flex flex-wrap items-center justify-between gap-4 ${isDarkMode ? 'border-white/5 bg-slate-900/30' : 'border-slate-100 bg-slate-50/50'}`}>
                    <div className="text-xs text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-700 dark:text-slate-300">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-slate-700 dark:text-slate-300">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-bold text-slate-700 dark:text-slate-300">{filteredData.length}</span> entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-xl border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-200 hover:bg-white text-slate-700'}`}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-bold px-2 text-slate-500">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-xl border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-slate-300' : 'border-slate-200 hover:bg-white text-slate-700'}`}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDataTable;
