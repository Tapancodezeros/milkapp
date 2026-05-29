import React from 'react';
import { Bookmark, Heart, ShoppingBag } from 'lucide-react';
import Card from '../shared/Card';

const SavedVendorsPanel = ({ vendors, onBuy, onSubscribe, onRemove }) => {
    if (!vendors.length) {
        return (
            <Card className="border-dashed">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="p-4 rounded-[1.8rem] bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 mb-5 border border-rose-100 dark:border-rose-900/30">
                        <Heart size={26} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Saved Vendors</h3>
                    <p className="mt-3 max-w-md text-sm font-bold text-slate-400 dark:text-slate-500">
                        Save vendors you like so you can jump back to them quickly from the dashboard.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="bg-[linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(254,242,242,0.9))] dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(30,41,59,0.98))]">
            <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                            <Bookmark size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Saved Vendors</h2>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Personal shortlist</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {vendors.length} saved
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {vendors.map((vendor) => (
                    <div
                        key={vendor.id}
                        className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.03)]"
                    >
                        <div className="flex items-start justify-between gap-4 mb-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[1.2rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-300">
                                    {vendor.name?.[0] || 'V'}
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">{vendor.name}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                                        ₹{vendor.rate}/L
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(vendor.id)}
                                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all active:scale-95"
                                title="Remove from saved"
                            >
                                <Heart size={16} fill="currentColor" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-6 rounded-[1.4rem] bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 px-4 py-3">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">Stock</p>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{vendor.availableMilk}L</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${vendor.isAvailable
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30'
                                }`}>
                                {vendor.isAvailable ? 'Available' : 'Holiday'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => onBuy(vendor)}
                                disabled={!vendor.isAvailable || vendor.availableMilk <= 0}
                                className="py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-30"
                            >
                                Buy
                            </button>
                            <button
                                type="button"
                                onClick={() => onSubscribe(vendor)}
                                disabled={!vendor.isAvailable}
                                className="py-3.5 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-95 disabled:opacity-30"
                            >
                                Subscribe
                            </button>
                        </div>

                        <div className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                            <ShoppingBag size={14} strokeWidth={2.5} />
                            Quick access vendor
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default SavedVendorsPanel;
