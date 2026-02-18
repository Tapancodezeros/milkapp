import React from 'react';
import { TrendingUp, Star } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const VendorCard = ({ vendor, onBuy, onSubscribe }) => {
    return (
        <div className="glass-card p-6 rounded-[2rem] group relative overflow-hidden bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10">
            {/* Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white/80 font-display font-bold text-xl shadow-inner group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                        {vendor.name[0]}
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{vendor.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                ₹{vendor.rate}/L
                            </span>
                            <div className="flex items-center gap-0.5 text-warning text-[10px]">
                                <Star size={10} fill="currentColor" /> 4.8
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <StatusBadge
                        status={vendor.isAvailable ? (vendor.availableMilk > 0 ? 'In Stock' : 'Out of Stock') : 'On Holiday'}
                        variant={vendor.isAvailable ? (vendor.availableMilk > 0 ? 'active' : 'cancelled') : 'paused'}
                    />
                </div>
            </div>

            <div className="relative z-10 p-4 bg-slate-50/80 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 mb-6 flex justify-between items-center group-hover:border-primary-500/20 transition-colors shadow-sm dark:shadow-none">
                <div>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Availability</p>
                    <p className="font-display font-bold text-slate-900 dark:text-white tabular-nums">{vendor.availableMilk} <span className="text-[10px] text-slate-500">L</span></p>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/5"></div>
                <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quality</p>
                    <div className="flex gap-1 items-center text-emerald-500 dark:text-emerald-400 justify-end">
                        <TrendingUp size={12} strokeWidth={3} />
                        <span className="font-bold text-[10px] uppercase tracking-wider">Fresh</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-3">
                <button
                    onClick={() => onBuy(vendor)}
                    disabled={vendor.availableMilk <= 0 || !vendor.isAvailable}
                    className="bg-slate-900 dark:bg-white text-white dark:text-primary-950 rounded-xl py-3 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-black/10 dark:shadow-white/10"
                >
                    Buy Now
                </button>
                <button
                    onClick={() => onSubscribe(vendor)}
                    disabled={!vendor.isAvailable}
                    className="bg-transparent text-slate-600 dark:text-white border border-slate-200 dark:border-white/20 rounded-xl py-3 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 hover:border-slate-300 dark:hover:border-white/30"
                >
                    Subscribe
                </button>
            </div>
        </div>
    );
};

export default VendorCard;
