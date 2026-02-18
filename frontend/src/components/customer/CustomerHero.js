import React from 'react';
import { Wallet, Plus, Activity, TrendingUp } from 'lucide-react';
import StatsCard from '../shared/StatsCard';

const CustomerHero = ({ walletBalance, totalSpent, activeSubs, onTopupClick, onWithdrawClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-8 rounded-[2rem] shadow-2xl shadow-primary-900/40 relative overflow-hidden group col-span-1 md:col-span-2 min-h-[220px] flex flex-col justify-between border border-white/10">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl -ml-10 -mb-10 animate-pulse-slow"></div>

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 inline-flex mb-3 group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                            <Wallet className="text-white" size={20} />
                        </div>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">Wallet Balance</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onWithdrawClick}
                            className="bg-black/20 hover:bg-black/30 text-white p-2.5 rounded-xl backdrop-blur-md border border-white/10 transition-all active:scale-95 hover:border-white/20"
                            title="Withdraw"
                        >
                            <TrendingUp size={18} className="rotate-180" />
                        </button>
                        <button
                            onClick={onTopupClick}
                            className="bg-white text-primary-600 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition-all active:scale-95 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-black/20"
                        >
                            <Plus size={16} /> Top Up
                        </button>
                    </div>
                </div>

                <div className="relative z-10 mt-auto">
                    <div className="flex items-end gap-3">
                        <h2 className="text-5xl font-display font-bold text-white tracking-tight drop-shadow-sm">
                            ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h2>
                        <div className="mb-2">
                            <span className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-bold bg-emerald-500/20 px-3 py-1 rounded-full backdrop-blur-md border border-emerald-500/20 uppercase tracking-wider">
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
                color="primary"
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
