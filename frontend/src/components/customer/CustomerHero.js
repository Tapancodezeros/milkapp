import React from 'react';
import { Wallet, Plus, Activity, TrendingUp } from 'lucide-react';
import StatsCard from '../shared/StatsCard';

const CustomerHero = ({ walletBalance, totalSpent, activeSubs, onTopupClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-colors duration-500">
            <div className="bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#9333ea] p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 dark:shadow-indigo-500/10 relative overflow-hidden group col-span-1 md:col-span-2 min-h-[240px] flex flex-col justify-between border border-white/10">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10 floating-slow"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 inline-flex mb-4 group-hover:rotate-12 transition-transform duration-500">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <p className="text-white/70 text-[11px] font-black uppercase tracking-[0.3em] mb-1">Wallet Balance</p>
                    </div>
                    <button
                        onClick={onTopupClick}
                        className="bg-white/10 hover:bg-white text-white hover:text-indigo-600 p-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all active:scale-95 group/btn overflow-hidden relative shadow-xl"
                    >
                        <div className="relative z-10 flex items-center gap-2 font-bold text-sm">
                            <Plus size={20} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                            <span className="max-w-0 group-hover/btn:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap">Top Up</span>
                        </div>
                    </button>
                </div>

                <div className="relative z-10 mt-auto">
                    <div className="flex items-end gap-3">
                        <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-sm">
                            ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h2>
                        <div className="mb-2">
                            <span className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-black bg-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-emerald-500/20 uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                Active
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
