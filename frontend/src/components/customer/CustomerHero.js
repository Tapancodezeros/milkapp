import React from 'react';
import { Wallet, Plus, Activity, TrendingUp } from 'lucide-react';
import StatsCard from '../shared/StatsCard';

const CustomerHero = ({ walletBalance, totalSpent, activeSubs, onTopupClick, onWithdrawClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 transition-colors duration-500">
            <div className="bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#9333ea] p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 dark:shadow-indigo-500/10 relative overflow-hidden group col-span-1 sm:col-span-2 min-h-[200px] sm:min-h-[240px] flex flex-col justify-between border border-white/10">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10 floating-slow"></div>

                <div className="relative z-10 flex justify-between items-start gap-3">
                    <div>
                        <div className="bg-white/10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/20 inline-flex mb-2 sm:mb-4 group-hover:rotate-12 transition-transform duration-500">
                            <Wallet className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <p className="text-white/70 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.25em] mb-1">Wallet Balance</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onWithdrawClick}
                            className="bg-white/10 hover:bg-white/20 text-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-md border border-white/20 transition-all active:scale-95 flex items-center gap-1.5 shadow-xl text-xs font-bold"
                            title="Withdraw Money"
                        >
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                            <span className="hidden xs:inline">Withdraw</span>
                        </button>
                        <button
                            onClick={onTopupClick}
                            className="bg-white text-indigo-600 hover:bg-white/90 p-2.5 sm:p-3 px-3.5 sm:px-5 rounded-xl sm:rounded-2xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 shadow-xl text-xs font-black uppercase tracking-wider"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
                            <span>Top Up</span>
                        </button>
                    </div>
                </div>

                <div className="relative z-10 mt-4 sm:mt-auto">
                    <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-sm tabular-nums">
                            ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h2>
                        <div>
                            <span className="inline-flex items-center gap-1.5 text-emerald-300 text-[9px] sm:text-[10px] font-black bg-emerald-500/20 px-2.5 py-1 rounded-full backdrop-blur-md border border-emerald-500/20 uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                Active Wallet
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <StatsCard
                label="Total Spent"
                val={`₹${totalSpent.toLocaleString('en-IN')}`}
                icon={TrendingUp}
                color="indigo"
                sub="Overall spending"
            />

            <StatsCard
                label="Subscriptions"
                val={activeSubs}
                icon={Activity}
                color="emerald"
                sub="Live Subscriptions"
            />
        </div>
    );
};

export default CustomerHero;
