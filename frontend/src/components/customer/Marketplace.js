import React from 'react';
import { Search } from 'lucide-react';
import VendorCard from './VendorCard';

const Marketplace = ({ vendors, searchQuery, setSearchQuery, onBuy, onSubscribe }) => {
    const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <section className="space-y-10 py-4 transition-colors duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Marketplace</h2>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em] ml-4">Choose your vendor</p>
                </div>
                <div className="relative w-full md:w-[450px] group">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredVendors.map(v => (
                    <VendorCard
                        key={v.id}
                        vendor={v}
                        onBuy={onBuy}
                        onSubscribe={onSubscribe}
                    />
                ))}
                {filteredVendors.length === 0 && (
                    <div className="col-span-full py-32 bg-slate-50/50 dark:bg-slate-900/30 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[4rem] flex flex-col items-center justify-center text-slate-300 gap-6">
                        <div className="p-8 bg-white dark:bg-slate-900 rounded-full shadow-xl shadow-slate-200/50 dark:shadow-none floating-slow border border-transparent dark:border-slate-800">
                            <Search size={48} className="text-slate-200 dark:text-slate-700" />
                        </div>
                        <div className="text-center">
                            <p className="font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] text-sm">No vendors found</p>
                            <p className="text-xs font-bold text-slate-300 dark:text-slate-700 mt-2">Try searching with a different name</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Marketplace;
