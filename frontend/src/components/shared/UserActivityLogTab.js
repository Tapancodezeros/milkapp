import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Activity,
    Clock,
    RefreshCw,
    Loader2,
    CheckCircle2,
    XCircle,
    Database,
    ChevronLeft,
    ChevronRight,
    Eye,
    X
} from 'lucide-react';
import { API_BASE_URL, getErrorMessage } from '../../api/config';
import { getAuthToken } from '../../utils/auth';
import { toast } from 'react-hot-toast';

const UserActivityLogTab = ({ isDarkMode, userRole = 'customer' }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [detailModal, setDetailModal] = useState({ isOpen: false, log: null });

    const token = getAuthToken();

    const fetchActivityLogs = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = userRole === 'vendor' ? '/vendor/activity-logs' : '/customer/activity-logs';
            const response = await axios.get(`${API_BASE_URL}${endpoint}?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = response.data.data;
            setLogs(data.logs || []);
            setTotalPages(data.totalPages || 1);
            setTotalLogs(data.total || 0);
        } catch (err) {
            console.error('Error fetching user activity logs:', err);
            toast.error(getErrorMessage(err, 'Failed to fetch activity logs'));
        } finally {
            setLoading(false);
        }
    }, [token, page, userRole]);

    useEffect(() => {
        fetchActivityLogs();
    }, [fetchActivityLogs]);

    const getActionBadgeClass = (action = '') => {
        if (action.includes('CREATE') || action.includes('REGISTER') || action.includes('TOPUP')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (action.includes('UPDATE') || action.includes('TOGGLE')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        if (action.includes('CANCEL') || action.includes('DELETE') || action.includes('FAILED')) return 'bg-red-500/10 text-red-500 border-red-500/20';
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
                            <Activity size={26} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Activity History Log</h3>
                                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                    Audited (`milkapp_audit`)
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                Secure history of your account actions, logins, and subscription changes ({totalLogs} recorded events)
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => fetchActivityLogs()}
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh History
                    </button>
                </div>
            </div>

            {/* Activity Table */}
            <div className={`rounded-3xl border shadow-xl overflow-hidden ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'}`}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-16 gap-3">
                        <Loader2 className="animate-spin text-blue-500" size={36} />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Loading Activity History...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center gap-3">
                        <Database size={44} className="text-slate-400" />
                        <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Activity Records Yet</h4>
                        <p className="text-xs text-slate-500 max-w-sm">Your recent account activity and audit logs will appear here once recorded.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className={`border-b text-[11px] font-black uppercase tracking-wider ${isDarkMode ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                                    <th className="py-4 px-6">Timestamp</th>
                                    <th className="py-4 px-6">Event / Action</th>
                                    <th className="py-4 px-6">Category</th>
                                    <th className="py-4 px-6">Result</th>
                                    <th className="py-4 px-6 text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium">
                                {logs.map((log) => (
                                    <tr key={log.id} className={`transition-colors hover:bg-blue-500/5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                                                <Clock size={13} className="text-blue-500" />
                                                {new Date(log.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-block font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border ${getActionBadgeClass(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-bold">{log.entity || 'General'}</span>
                                            {log.entityId && <span className="text-[11px] text-slate-500 font-mono ml-1">#{log.entityId}</span>}
                                        </td>
                                        <td className="py-4 px-6">
                                            {log.status === 'FAILED' ? (
                                                <span className="inline-flex items-center gap-1 text-red-500 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg text-[11px]">
                                                    <XCircle size={12} /> Failed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg text-[11px]">
                                                    <CheckCircle2 size={12} /> Success
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => setDetailModal({ isOpen: true, log })}
                                                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                title="View Details"
                                            >
                                                <Eye size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={`p-4 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="text-xs text-slate-500 font-bold">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`p-2 rounded-xl border transition-all ${page === 1 ? 'opacity-40 pointer-events-none' : ''} ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={`p-2 rounded-xl border transition-all ${page === totalPages ? 'opacity-40 pointer-events-none' : ''} ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* DETAIL MODAL */}
            {detailModal.isOpen && detailModal.log && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl border flex flex-col gap-4 max-h-[85vh] overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-base">Activity Log Details</h3>
                                    <p className="text-xs text-slate-500">{detailModal.log.action} • {new Date(detailModal.log.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDetailModal({ isOpen: false, log: null })}
                                className="p-2 rounded-xl text-slate-400 hover:bg-slate-500/10 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-1 text-xs">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-1.5">Action Metadata</span>
                                <pre className={`p-4 rounded-2xl font-mono text-[11px] overflow-x-auto border ${isDarkMode ? 'bg-slate-950 border-slate-800 text-blue-300' : 'bg-slate-900 border-slate-800 text-emerald-400'}`}>
                                    {JSON.stringify(detailModal.log.details || {}, null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setDetailModal({ isOpen: false, log: null })}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserActivityLogTab;
