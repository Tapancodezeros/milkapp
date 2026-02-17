import React from 'react';
import { Users, Briefcase, DollarSign, Calendar, CreditCard, Filter } from 'lucide-react';
import AnalyticsChart from '../vendor/AnalyticsChart';

const AdminOverview = ({ overviewStats, overviewFilter, setOverviewFilter, reportData, isDarkMode }) => {
    return (
        <div className="space-y-8">
            {/* Filter and Grid */}
            <div>
                <div className="flex items-center justify-end mb-6">
                    <div className={`inline-flex p-1.5 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        {['all', 'this_month', 'last_month', 'this_week'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setOverviewFilter(period)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${overviewFilter === period ? (isDarkMode ? 'bg-slate-700 text-white shadow-lg' : 'bg-white text-slate-900 shadow-lg') : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {period === 'all' && <Filter size={14} />}
                                {period.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                <Users size={24} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Customers</div>
                        </div>
                        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{overviewStats.totalCustomers}</div>
                    </div>
                    <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                                <Briefcase size={24} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Vendors</div>
                        </div>
                        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{overviewStats.totalVendors}</div>
                    </div>
                    <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                <DollarSign size={24} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Revenue</div>
                        </div>
                        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{overviewStats.totalRevenue?.toLocaleString()}</div>
                    </div>
                    <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                <Calendar size={24} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Subs</div>
                        </div>
                        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{overviewStats.activeSubscriptions}</div>
                    </div>
                </div>
            </div>

            {/* Monthly Analytics Chart */}
            <div className="my-8">
                <AnalyticsChart
                    reportData={reportData}
                    title="Platform Performance"
                    subTitle="Revenue & Volume Analytics"
                />
            </div>

            {/* Recent Transactions */}
            <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className={`p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Transactions</h3>
                            <p className="text-slate-500 text-xs mt-1 font-medium">Latest 5 financial activities</p>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Vendor</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                            {overviewStats.recentTransactions?.length > 0 ? (
                                overviewStats.recentTransactions.map((tx) => (
                                    <tr key={tx.id} className={`transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                        <td className={`px-8 py-5 text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className={`px-8 py-5 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {tx.Customer?.name || 'Unknown'}
                                        </td>
                                        <td className={`px-8 py-5 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {tx.Vendor?.name || 'Unknown'}
                                        </td>
                                        <td className={`px-8 py-5 text-sm font-bold text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            ₹{tx.amount}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.status === 'completed'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-12 text-center text-slate-500 text-sm font-medium">
                                        No recent transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
