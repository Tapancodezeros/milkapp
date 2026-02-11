import React from 'react';
import { BarChart2 } from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';

import { useTheme } from '../../context/ThemeContext';

const AnalyticsChart = ({ reportData, title, subTitle }) => {
    const { isDarkMode } = useTheme();
    const [view, setView] = React.useState('revenue'); // 'revenue' or 'volume'

    const isRevenue = view === 'revenue';
    const color = isRevenue ? '#6366F1' : '#10B981';

    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden group transition-colors duration-500">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-b from-slate-50/50 to-white/0 dark:from-slate-900/50 dark:to-transparent">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">{title}</h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] ml-2">{subTitle}</p>
                </div>
                <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-[1.2rem] border border-slate-200/50 dark:border-slate-700/50 shadow-inner backdrop-blur-sm">
                    <button
                        onClick={() => setView('revenue')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isRevenue ? 'bg-white dark:bg-slate-700 shadow-lg dark:shadow-none text-slate-900 dark:text-white border border-slate-100 dark:border-slate-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'}`}>
                        Revenue
                    </button>
                    <button
                        onClick={() => setView('volume')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${!isRevenue ? 'bg-white dark:bg-slate-700 shadow-lg dark:shadow-none text-slate-900 dark:text-white border border-slate-100 dark:border-slate-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'}`}>
                        Volume
                    </button>
                </div>
            </div>

            <div className="p-10 h-[450px] w-full">
                {reportData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={reportData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke={isDarkMode ? '#1E293B' : '#F8FAFC'} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: isDarkMode ? '#475569' : '#94A3B8', fontSize: 10, fontWeight: 900 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: isDarkMode ? '#475569' : '#94A3B8', fontSize: 10, fontWeight: 900 }}
                            />
                            <Tooltip
                                cursor={{ stroke: color, strokeWidth: 2, strokeDasharray: '6 6' }}
                                contentStyle={{
                                    borderRadius: '24px',
                                    border: isDarkMode ? '1px solid rgba(30, 41, 59, 1)' : '1px solid rgba(241, 245, 249, 1)',
                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
                                    padding: '24px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(12px)'
                                }}
                                itemStyle={{ fontWeight: 900, fontSize: '15px', color: isDarkMode ? '#F1F5F9' : '#1E293B', textTransform: 'uppercase' }}
                                labelStyle={{ fontWeight: 900, fontSize: '10px', color: isDarkMode ? '#64748B' : '#64748B', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                                formatter={(value) => [isRevenue ? `₹${value.toLocaleString()}` : `${value} L`, isRevenue ? 'Amount' : 'Volume']}
                            />
                            <Area
                                type="monotone"
                                dataKey={view === 'revenue' ? 'revenue' : 'volume'}
                                stroke={color}
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorMetric)"
                                animationDuration={2500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-800 gap-8">
                        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-1000">
                            <BarChart2 size={64} className="text-slate-200 dark:text-slate-700" strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] text-xs">No data</p>
                            <p className="text-xs font-bold text-slate-300 dark:text-slate-700 mt-2">Data will appear after your first sale.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsChart;
