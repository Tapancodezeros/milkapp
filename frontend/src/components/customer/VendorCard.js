import React from 'react';
import { Heart, TrendingUp } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const VendorCard = ({ vendor, onBuy, onSubscribe, onToggleSave, isSaved }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-7 rounded-[2.5rem] border border-slate-100/80 dark:border-slate-800 hover:border-blue-200/50 dark:hover:border-blue-900/50 hover:shadow-[0_20px_60px_rgba(59,130,246,0.08)] dark:hover:shadow-none transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700 opacity-40 dark:opacity-20"></div>

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-[1.2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-all duration-500 font-black text-xl shadow-sm">
                        {vendor.name[0]}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors text-lg leading-tight mb-1">{vendor.name}</h3>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">₹{vendor.rate}/L</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <button
                        type="button"
                        onClick={() => onToggleSave(vendor)}
                        className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${isSaved
                            ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                            : 'bg-white/80 dark:bg-slate-800/90 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 hover:text-rose-500 dark:hover:text-rose-400'
                            }`}
                        title={isSaved ? 'Remove from saved vendors' : 'Save vendor'}
                    >
                        <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                    <StatusBadge
                        status={vendor.isAvailable ? (vendor.availableMilk > 0 ? 'In Stock' : 'Out of Stock') : 'On Holiday'}
                        variant={vendor.isAvailable ? (vendor.availableMilk > 0 ? 'active' : 'cancelled') : 'paused'}
                    />
                    {!vendor.isAvailable && (
                        <div className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-orange-100 dark:border-orange-900/30">
                            Returning Soon
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10 p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 mb-8 flex justify-between items-center group-hover:bg-white dark:group-hover:bg-slate-800 transition-all duration-500">
                <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Availability</p>
                    <p className="font-black text-slate-700 dark:text-slate-300 tabular-nums">{vendor.availableMilk} <span className="text-[10px] text-slate-400 dark:text-slate-600">L</span></p>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Quality</p>
                    <div className="flex gap-1 items-center text-emerald-500 dark:text-emerald-400 justify-end">
                        <TrendingUp size={14} strokeWidth={3} />
                        <span className="font-black text-[11px] uppercase tracking-wider">Fresh</span>
                    </div>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
                <button
                    onClick={() => onBuy(vendor)}
                    disabled={vendor.availableMilk <= 0 || !vendor.isAvailable}
                    className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-20 shadow-lg shadow-slate-200 dark:shadow-none"
                >
                    Buy Now
                </button>
                <button
                    onClick={() => onSubscribe(vendor)}
                    disabled={!vendor.isAvailable}
                    className="bg-white dark:bg-transparent text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-95 hover:shadow-lg hover:shadow-blue-500/5 disabled:opacity-20"
                >
                    Subscribe
                </button>
            </div>
        </div>
    );
};

export default VendorCard;
