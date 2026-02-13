import React from 'react';
import { Zap, PlusCircle } from 'lucide-react';
import Card from '../shared/Card';

const QuickControls = ({ addStock, setAddStock, newRate, setNewRate, onUpdate }) => {
    return (
        <Card className="flex flex-col gap-8 transition-colors duration-500">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400"><Zap size={20} /></div>
                Actions
            </h2>

            <div className="grid grid-cols-1 gap-6">
                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 group transition-all hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-50/50 dark:hover:shadow-none">
                    <div className="flex justify-between items-start mb-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Manage Stock (Liters)</label>
                        <span className="text-[8px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Max Total: 1,000L</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                            onClick={() => onUpdate('stock')}
                            className="bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-2xl hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <PlusCircle size={16} /> Add
                        </button>
                        <button
                            onClick={() => onUpdate('remove_stock')}
                            className="bg-white dark:bg-slate-700 text-red-500 border border-red-100 dark:border-red-900/30 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <div className="w-4 h-0.5 bg-current rounded-full"></div> Remove
                        </button>
                    </div>
                    <input
                        type="number" value={addStock} onChange={e => setAddStock(e.target.value)}
                        className="bg-transparent font-black text-2xl w-full outline-none text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700 text-center border-b border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/30 transition-colors pb-2" placeholder="0.0"
                    />
                </div>

                <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 group transition-all hover:border-purple-200 dark:hover:border-purple-500/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-purple-50/50 dark:hover:shadow-none">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 block">Price (₹/Liter)</label>
                    <div className="flex gap-3">
                        <input
                            type="number" value={newRate} onChange={e => setNewRate(e.target.value)}
                            className="bg-transparent font-black text-2xl w-full outline-none text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700" placeholder="0.0"
                        />
                        <button onClick={() => onUpdate('rate')} className="bg-purple-600 text-white px-6 py-3 rounded-2xl hover:bg-purple-700 transition-all font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-100 dark:shadow-none transform active:scale-95">Save</button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default QuickControls;
