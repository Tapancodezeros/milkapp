import React from 'react';
import { ArrowRight, Lightbulb, Sparkles, TriangleAlert, Wallet } from 'lucide-react';
import Card from '../shared/Card';

const formatMoney = (amount) => `₹${(parseFloat(amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CustomerInsights = ({ insights, loading, onPrimaryAction, onRecommendedVendor }) => {
    if (loading && !insights) {
        return (
            <Card className="min-h-[260px] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Loading Insights</p>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Calculating your best next move</p>
                </div>
            </Card>
        );
    }

    if (!insights) {
        return null;
    }

    return (
        <Card className="bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.08),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(239,246,255,0.92))] dark:bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_40%),linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.98))]">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-2xl bg-amber-100/70 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/30">
                                <Lightbulb size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Smart Insights</h2>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1">Personalized guidance</p>
                            </div>
                        </div>
                        <p className="max-w-2xl text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                            {insights.nextAction?.description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onPrimaryAction}
                        className="self-start bg-slate-900 dark:bg-blue-600 text-white px-6 py-4 rounded-[1.6rem] text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-95 flex items-center gap-3"
                    >
                        {insights.nextAction?.title || 'Take Action'}
                        <ArrowRight size={16} strokeWidth={3} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400">
                                <TriangleAlert size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">Pending Dues</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatMoney(insights.pending?.amount)}</p>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {insights.pending?.count
                                ? `${insights.pending.count} order${insights.pending.count > 1 ? 's' : ''} still need payment from your wallet.`
                                : 'No unpaid orders right now. Your payment flow is fully clear.'}
                        </p>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400">
                                <Wallet size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">Wallet Health</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{formatMoney(insights.wallet?.balance)}</p>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {insights.wallet?.isLowBalance
                                ? `Below the suggested ₹${insights.wallet.lowBalanceThreshold} buffer for smooth recurring deliveries.`
                                : `Healthy balance for upcoming orders and daily plans.`}
                        </p>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400">
                                <Sparkles size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em]">Favorite Vendor</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{insights.favoriteVendor?.name || 'Still exploring'}</p>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {insights.favoriteVendor
                                ? `${insights.favoriteVendor.orderCount} completed order${insights.favoriteVendor.orderCount > 1 ? 's' : ''} and ${formatMoney(insights.favoriteVendor.totalSpent)} spent so far.`
                                : 'Place a few orders and we will start learning your preferred vendor pattern.'}
                        </p>
                    </div>
                </div>

                {insights.recommendedVendor && (
                    <div className="p-7 rounded-[2.4rem] bg-slate-900 text-white border border-slate-800 shadow-2xl shadow-slate-300/30 dark:shadow-none">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div>
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-2">Recommended Right Now</p>
                                <h3 className="text-2xl font-black tracking-tight">{insights.recommendedVendor.name}</h3>
                                <p className="text-sm font-bold text-slate-300 mt-3">
                                    Best live rate at {formatMoney(insights.recommendedVendor.rate)}/L with {insights.recommendedVendor.availableMilk}L currently available.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onRecommendedVendor}
                                className="self-start lg:self-center bg-white text-slate-900 px-6 py-4 rounded-[1.6rem] text-[11px] font-black uppercase tracking-[0.25em] hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-3"
                            >
                                Open Vendor
                                <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CustomerInsights;
