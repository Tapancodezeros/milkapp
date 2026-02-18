import React from 'react';
import { BarChart2, Download, AreaChart as AreaIcon, BarChart as BarIcon } from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';

import { useTheme } from '../../context/ThemeContext';

const AnalyticsChart = ({ reportData, title, subTitle }) => {
    const { isDarkMode } = useTheme();
    const [view, setView] = React.useState('revenue'); // 'revenue' or 'volume'
    const [chartType, setChartType] = React.useState('area'); // 'area' or 'bar'

    const isRevenue = view === 'revenue';
    const color = isRevenue ? '#6366F1' : '#10B981';

    const handleDownload = () => {
        const headers = ['Period', 'Revenue', 'Volume'];
        const csvContent = [
            headers.join(','),
            ...reportData.map(row => `${row.name},${row.revenue},${row.volume}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title.replace(/\s+/g, '_').toLowerCase()}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="glass-card rounded-[2.5rem] overflow-hidden group transition-all duration-500">
            <div className="p-8 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white/5">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-tight leading-none mb-2">{title}</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">{subTitle}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => setChartType('area')}
                            className={`p-2.5 rounded-lg transition-all duration-300 ${chartType === 'area' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-white'}`}
                            title="Area Chart"
                        >
                            <AreaIcon size={16} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`p-2.5 rounded-lg transition-all duration-300 ${chartType === 'bar' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-white'}`}
                            title="Bar Chart"
                        >
                            <BarIcon size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block"></div>

                    <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 backdrop-blur-sm">
                        <button
                            onClick={() => setView('revenue')}
                            className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${isRevenue ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-white'}`}>
                            Revenue
                        </button>
                        <button
                            onClick={() => setView('volume')}
                            className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${!isRevenue ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-white'}`}>
                            Volume
                        </button>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="p-3 rounded-xl bg-black/20 text-slate-500 hover:text-white transition-colors border border-white/5 hover:border-white/20"
                        title="Download Report"
                    >
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="p-8 h-[400px] w-full">
                {reportData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'area' ? (
                            <AreaChart data={reportData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                        padding: '16px',
                                        background: 'rgba(5, 5, 20, 0.8)',
                                        backdropFilter: 'blur(16px)'
                                    }}
                                    itemStyle={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}
                                    labelStyle={{ fontWeight: 700, fontSize: '10px', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                    formatter={(value) => [isRevenue ? `₹${value.toLocaleString()}` : `${value} L`, isRevenue ? 'Amount' : 'Volume']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={view === 'revenue' ? 'revenue' : 'volume'}
                                    stroke={color}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorMetric)"
                                    animationDuration={2500}
                                />
                            </AreaChart>
                        ) : (
                            <BarChart data={reportData} margin={{ top: 20, right: 20, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                        padding: '16px',
                                        background: 'rgba(5, 5, 20, 0.8)',
                                        backdropFilter: 'blur(16px)'
                                    }}
                                    itemStyle={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}
                                    labelStyle={{ fontWeight: 700, fontSize: '10px', color: '#94A3B8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                    formatter={(value) => [isRevenue ? `₹${value.toLocaleString()}` : `${value} L`, isRevenue ? 'Amount' : 'Volume']}
                                />
                                <Bar
                                    dataKey={view === 'revenue' ? 'revenue' : 'volume'}
                                    fill={color}
                                    radius={[6, 6, 6, 6]}
                                    animationDuration={2000}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-6">
                        <div className="bg-white/5 p-8 rounded-full border border-white/5 floating-slow">
                            <BarChart2 size={48} className="text-slate-600" strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">No data available</p>
                            <p className="text-xs font-medium text-slate-700 mt-1">Data will appear after your first sale.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsChart;
