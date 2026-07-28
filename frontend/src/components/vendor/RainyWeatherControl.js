import React, { useState, useEffect } from 'react';
import { CloudRain, ShieldCheck, Clock, Users } from 'lucide-react';
import axios from '../../api/config';
import { getAuthToken } from '../../utils/auth';

const RainyWeatherControl = ({ onRefreshData }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const res = await axios.get('/weather/vendor-summary', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSummary(res.data.data);
        } catch (err) {
            console.error('Error loading rain summary:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
                <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
            </div>
        );
    }

    const advisory = summary?.advisory;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-6 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                        <CloudRain className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rainy Weather Operations</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage rain protection requests & delivery delays</p>
                    </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    advisory?.isRainyMode
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                    {advisory?.isRainyMode ? '🌧️ Rainy Mode Active' : '☀️ Normal Delivery'}
                </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-900 dark:text-white">{summary?.rainproofCount || 0}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rainproof Wrap Requests</p>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-900 dark:text-white">+{advisory?.estimatedDelayMinutes || 0}m</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Broadcast Delay</p>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-900 dark:text-white">{summary?.todaySkippedCount || 0}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rain Skips Today</p>
                    </div>
                </div>
            </div>

            {/* List of Customers with Special Rain Notes */}
            {summary?.customersNeedingRainproof?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                        Customers Requesting Special Rain Setup ({summary.customersNeedingRainproof.length})
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {summary.customersNeedingRainproof.map((cust, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-bold text-slate-900 dark:text-white">{cust.customerName}</span>
                                    <span className="ml-2 text-slate-500">({cust.quantity}L Daily)</span>
                                    {cust.rainDropoffInstructions && (
                                        <p className="text-sky-700 dark:text-sky-300 font-medium mt-0.5">
                                            📍 "{cust.rainDropoffInstructions}"
                                        </p>
                                    )}
                                </div>
                                {cust.rainproofPackaging && (
                                    <span className="px-2 py-0.5 rounded bg-sky-500 text-white font-bold text-[10px]">
                                        Rain Wrap
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RainyWeatherControl;
