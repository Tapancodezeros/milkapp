import React from 'react';
import { Activity, CheckCircle } from 'lucide-react';

const FulfillmentEngine = ({ sales, subscriptions, onProcess }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const processedCustomerIds = new Set(
        sales.filter(s => s.date === todayStr && s.type === 'subscription').map(s => s.customerId)
    );
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const pendingSubs = activeSubs.filter(s => !processedCustomerIds.has(s.customerId));
    const pendingDemand = pendingSubs.reduce((sum, s) => sum + s.quantity, 0);
    const progress = activeSubs.length > 0 ? ((activeSubs.length - pendingSubs.length) / activeSubs.length) * 100 : 0;

    return (
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 p-24 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute left-1/4 top-1/2 p-20 bg-indigo-500/10 rounded-full blur-3xl group-hover:translate-x-10 transition-transform duration-700"></div>

            <h2 className="text-xl font-bold mb-10 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-white/10 rounded-xl"><Activity size={20} /></div>
                Mark Deliveries
            </h2>

            <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Pending Liters Today</p>
                        <h3 className="text-5xl font-black tracking-tighter">{pendingDemand} <span className="text-xl text-slate-500 font-bold ml-1">L</span></h3>
                    </div>
                    <div className="text-right">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] border-2 uppercase ${pendingDemand > 0 ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'}`}>
                            {pendingDemand > 0 ? 'In Progress' : 'Done'}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <span>Delivery Progress</span>
                        <span className="text-white">{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="w-full bg-white/5 h-4 rounded-2xl overflow-hidden p-1 border border-white/5">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-2xl transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <button
                    onClick={onProcess}
                    disabled={pendingDemand === 0}
                    className={`w-full py-5 rounded-[2rem] font-black text-sm transition-all transform active:scale-95 flex justify-center items-center gap-3 tracking-[0.2em] uppercase overflow-hidden relative group/btn ${pendingDemand > 0 ? 'bg-white text-slate-900 shadow-2xl shadow-white/10' : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed'}`}
                >
                    <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300 flex items-center gap-3">
                        {pendingDemand > 0 ? (
                            <><CheckCircle size={22} className="group-hover/btn:rotate-12 transition-transform" /> Process All Today</>
                        ) : (
                            <><CheckCircle size={22} /> All Processed</>
                        )}
                    </span>
                </button>
            </div>
        </section>
    );
};

export default FulfillmentEngine;
