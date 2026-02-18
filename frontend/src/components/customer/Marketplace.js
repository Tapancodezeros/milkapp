import React from 'react';
import { Search } from 'lucide-react';
import VendorCard from './VendorCard';

const Marketplace = ({ vendors, searchQuery, setSearchQuery, onBuy, onSubscribe }) => {
    const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <section className="space-y-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-accent-400 rounded-full"></div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-none">Marketplace</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest ml-4">Choose your vendor</p>
                </div>
                <div className="relative w-full md:w-[400px] group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search local vendors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-input w-full pl-14 pr-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map(v => (
                    <VendorCard
                        key={v.id}
                        vendor={v}
                        onBuy={onBuy}
                        onSubscribe={onSubscribe}
                    />
                ))}
                {filteredVendors.length === 0 && (
                    <div className="col-span-full py-24 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-slate-500 gap-6">
                        <div className="p-6 bg-white dark:bg-white/5 rounded-full shadow-inner floating-slow border border-slate-100 dark:border-white/5">
                            <Search size={32} className="text-slate-400" />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">No vendors found</p>
                            <p className="text-xs text-slate-500 dark:text-slate-600 mt-2">Try searching with a different name</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Marketplace;
