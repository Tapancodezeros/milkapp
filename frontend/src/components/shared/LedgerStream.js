import { History, Download, Search } from 'lucide-react';
import Card from '../shared/Card';

const LedgerStream = ({ sales, currentPage, totalPages, setCurrentPage, onUpdateDelivery, onExport, searchQuery, setSearchQuery }) => {
    return (
        <Card className="flex flex-col transition-colors duration-500" noPadding>
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/50 dark:to-transparent">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400"><History size={20} /></div>
                        Sales
                    </h2>
                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-60">History</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-bold uppercase text-[10px] tracking-widest border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#FBFCFD] dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                        <tr>
                            <th className="px-10 py-6">Date</th>
                            <th className="px-10 py-6">Customer</th>
                            <th className="px-10 py-6 text-right">Qty</th>
                            <th className="px-10 py-6 text-right">Amount</th>
                            <th className="px-10 py-6 text-center">Type</th>
                            <th className="px-10 py-6 text-center">Delivery</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {sales.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group transition-all duration-300">
                                <td className="px-10 py-7 font-black text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.date}</td>
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300 shadow-sm group-hover:scale-110 transition-transform">
                                            {s.Customer?.name?.[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 dark:text-white text-sm whitespace-nowrap">{s.Customer?.name || 'Guest'}</span>
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">ID: {s.customerId}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <span className="font-black text-slate-700 dark:text-slate-300 text-sm tabular-nums">{s.quantity} <span className="text-slate-300 dark:text-slate-600 font-bold ml-0.5">L</span></span>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-base tabular-nums">₹{s.amount}</span>
                                </td>
                                <td className="px-10 py-7 text-center">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.2em] border uppercase transition-all ${s.type === 'subscription' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                        {s.type}
                                    </span>
                                </td>
                                <td className="px-10 py-7 text-center">
                                    {s.deliveryStatus === 'pending' || !s.deliveryStatus ? (
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => onUpdateDelivery(s.id, 'delivered')}
                                                className="px-3 py-1 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                                            >
                                                Deliver
                                            </button>
                                            <button
                                                onClick={() => onUpdateDelivery(s.id, 'not_delivered')}
                                                className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-red-500 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                                            >
                                                Fail
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${s.deliveryStatus === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                            'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400'
                                            }`}>
                                            {s.deliveryStatus}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {
                totalPages > 1 && (
                    <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
                        <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
                            >
                                Prev
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-6 py-2 bg-slate-900 dark:bg-indigo-600 border border-slate-900 dark:border-indigo-600 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all disabled:opacity-30 active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )
            }

            {
                sales.length === 0 && (
                    <div className="p-20 flex flex-col items-center justify-center text-slate-300 dark:text-slate-800 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-full border border-slate-100 dark:border-slate-800"><History size={40} className="text-slate-200 dark:text-slate-700" /></div>
                        <p className="font-bold text-sm text-slate-400 dark:text-slate-600">No sales yet.</p>
                    </div>
                )
            }
        </Card >
    );
};

export default LedgerStream;
