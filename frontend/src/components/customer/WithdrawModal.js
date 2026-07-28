import React from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import Modal from '../shared/Modal';

const WithdrawModal = ({
    showWithdraw,
    onCloseWithdraw,
    handleWithdraw,
    topupAmount,
    setTopupAmount,
    walletBalance,
    walletPassword,
    setWalletPassword,
    actionLoading
}) => {
    return (
        <Modal
            isOpen={showWithdraw}
            onClose={onCloseWithdraw}
            title="Withdraw Money"
        >
            <form onSubmit={handleWithdraw} className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-end px-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Amount (₹)</label>
                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase">Available: ₹{walletBalance}</span>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 text-2xl sm:text-4xl font-black text-slate-300 dark:text-slate-700 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">₹</div>
                        <input
                            type="number"
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-5 sm:p-8 pl-12 sm:pl-16 rounded-2xl sm:rounded-[2.5rem] outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-black text-2xl sm:text-4xl text-slate-900 dark:text-white shadow-inner group-hover:border-slate-200 dark:group-hover:border-slate-700"
                            placeholder="0.00"
                            autoFocus
                        />
                    </div>

                    <div className="pt-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-1.5">
                            <Lock size={12} /> Confirm Account Password
                        </label>
                        <input
                            type="password"
                            value={walletPassword}
                            onChange={(e) => setWalletPassword(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-sm text-slate-900 dark:text-white shadow-inner"
                            placeholder="Enter password to authorize"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full bg-slate-900 dark:bg-blue-600 group relative overflow-hidden text-white p-5 sm:p-7 rounded-2xl sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all disabled:opacity-50 flex justify-center items-center gap-3 shadow-2xl shadow-blue-500/20 dark:shadow-none"
                >
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                        {actionLoading ? <Loader2 className="animate-spin" /> : <>Withdraw Balance <ArrowRight size={18} strokeWidth={3} /></>}
                    </span>
                </button>
            </form>
        </Modal>
    );
};

export default WithdrawModal;
