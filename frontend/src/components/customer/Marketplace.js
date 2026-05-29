import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import VendorCard from './VendorCard';

const Marketplace = ({
    vendors,
    searchQuery,
    setSearchQuery,
    marketFilters,
    setMarketFilters,
    savedVendorIds,
    onToggleSave,
    onBuy,
    onSubscribe
}) => {
    return (
        <section className="space-y-10 py-4 transition-colors duration-500">
            <div className="flex flex-col gap-8 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Marketplace</h2>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] ml-4">Choose your vendor</p>
                </div>

                <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
                    <div className="relative w-full xl:max-w-[420px] group">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="text-slate-400 dark:text-slate-600 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search local vendors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 dark:focus:ring-blue-400/5 shadow-[0_10px_40px_rgba(0,0,0,0.02)] dark:shadow-none focus:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all font-bold text-slate-700 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
                            <SlidersHorizontal size={14} />
                            Filters
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                min="0"
                                placeholder="Min ₹"
                                value={marketFilters.minRate}
                                onChange={(e) => setMarketFilters((prev) => ({ ...prev, minRate: e.target.value }))}
                                className="w-28 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-bold outline-none focus:border-blue-500"
                            />
                            <input
                                type="number"
                                min="0"
                                placeholder="Max ₹"
                                value={marketFilters.maxRate}
                                onChange={(e) => setMarketFilters((prev) => ({ ...prev, maxRate: e.target.value }))}
                                className="w-28 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-bold outline-none focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setMarketFilters((prev) => ({ ...prev, availableOnly: !prev.availableOnly }))}
                            className={`px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${marketFilters.availableOnly
                                ? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-lg'
                                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            Available Only
                        </button>
                        <select
                            value={`${marketFilters.sortBy}:${marketFilters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split(':');
                                setMarketFilters((prev) => ({ ...prev, sortBy, sortOrder }));
                            }}
                            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-bold outline-none focus:border-blue-500"
                        >
                            <option value="createdAt:DESC">Newest First</option>
                            <option value="rate:ASC">Lowest Rate</option>
                            <option value="rate:DESC">Highest Rate</option>
                            <option value="availableMilk:DESC">Most Stock</option>
                            <option value="name:ASC">Name A-Z</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => setMarketFilters({
                                availableOnly: false,
                                sortBy: 'createdAt',
                                sortOrder: 'DESC',
                                minRate: '',
                                maxRate: ''
                            })}
                            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {vendors.map(v => (
                    <VendorCard
                        key={v.id}
                        vendor={v}
                        isSaved={savedVendorIds.includes(v.id)}
                        onToggleSave={onToggleSave}
                        onBuy={onBuy}
                        onSubscribe={onSubscribe}
                    />
                ))}
                {vendors.length === 0 && (
                    <div className="col-span-full py-32 bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem] flex flex-col items-center justify-center text-slate-300 gap-6">
                        <div className="p-8 bg-white dark:bg-slate-900 rounded-full shadow-xl shadow-slate-200/50 dark:shadow-none floating-slow border border-transparent dark:border-slate-800">
                            <Search size={48} className="text-slate-200 dark:text-slate-700" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] text-sm">No vendors found</p>
                            <p className="text-xs font-bold text-slate-300 dark:text-slate-700 mt-2">Try changing your search or vendor filters</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Marketplace;
