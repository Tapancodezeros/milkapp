import React from 'react';
import { CreditCard, Lock, Plus, Loader2, CheckCircle2, AlertOctagon, ShieldCheck, Shield } from 'lucide-react';
import Modal from '../shared/Modal';
import DemoCardSelector from '../shared/DemoCardSelector';

export const TopupModal = ({
    showTopup,
    onCloseTopup,
    topupAmount,
    setTopupAmount,
    paymentTab,
    setPaymentTab,
    selectedDemoCard,
    handleSelectDemoCard,
    userId,
    actionLoading,
    handleTopup,
    walletPassword,
    setWalletPassword
}) => {
    return (
        <Modal
            isOpen={showTopup}
            onClose={onCloseTopup}
            title="Add Money to Wallet"
            maxWidth="max-w-xl"
        >
            <div className="space-y-5">
                {/* Amount Input */}
                <div className="space-y-2.5">
                    <div className="flex justify-between items-end px-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Amount (₹)</label>
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase">Max Wallet: ₹50,000</span>
                    </div>
                    <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-black text-slate-300 dark:text-slate-700 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">₹</div>
                        <input
                            type="number"
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-3.5 sm:p-4 pl-12 sm:pl-14 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-black text-2xl sm:text-3xl text-slate-900 dark:text-white shadow-inner group-hover:border-slate-200 dark:group-hover:border-slate-700"
                            placeholder="0.00"
                            autoFocus
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {[500, 1000, 5000].map(amt => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => setTopupAmount(amt.toString())}
                                className="py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 shadow-sm"
                            >
                                +₹{amt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="space-y-4 pt-2">
                    <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                        <button
                            type="button"
                            onClick={() => setPaymentTab('card')}
                            className={`flex-1 py-2.5 sm:py-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                paymentTab === 'card'
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md border border-slate-200/60 dark:border-slate-800'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <CreditCard size={15} /> Demo Card
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentTab('password')}
                            className={`flex-1 py-2.5 sm:py-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                paymentTab === 'password'
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md border border-slate-200/60 dark:border-slate-800'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Lock size={15} /> Account Password
                        </button>
                    </div>

                    {paymentTab === 'card' ? (
                        <div className="space-y-4 sm:space-y-6 pt-1 sm:pt-2">
                            <DemoCardSelector
                                selectedCard={selectedDemoCard}
                                onSelectCard={handleSelectDemoCard}
                                userId={userId}
                            />
                            <button
                                type="button"
                                onClick={handleTopup}
                                disabled={actionLoading || !topupAmount || parseFloat(topupAmount) < 10}
                                className="w-full bg-slate-900 dark:bg-blue-600 group relative overflow-hidden text-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all disabled:opacity-50 flex justify-center items-center gap-3 shadow-2xl shadow-blue-500/20 dark:shadow-none"
                            >
                                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                    {actionLoading ? <Loader2 className="animate-spin" /> : <>Pay & Add ₹{topupAmount || '0'} via Demo Card <CreditCard size={18} strokeWidth={2.5} /></>}
                                </span>
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleTopup} className="space-y-4 sm:space-y-6 pt-1 sm:pt-2">
                            <div className="space-y-2">
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
                            <button
                                type="submit"
                                disabled={actionLoading || !topupAmount || parseFloat(topupAmount) < 10}
                                className="w-full bg-slate-900 dark:bg-blue-600 group relative overflow-hidden text-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all disabled:opacity-50 flex justify-center items-center gap-3 shadow-2xl shadow-blue-500/20 dark:shadow-none"
                            >
                                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                    {actionLoading ? <Loader2 className="animate-spin" /> : <>Authorize Add to Wallet <Plus size={18} strokeWidth={3} /></>}
                                </span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export const Bank3DSModal = ({ show3DSModal, processing3DSStep, processing3DSMsg }) => {
    return (
        <Modal
            isOpen={show3DSModal}
            onClose={() => {}}
            title="3D Secure Bank Gateway"
        >
            <div className="p-3 sm:p-4 text-center space-y-4 sm:space-y-6">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-50 dark:bg-blue-950/50 border-4 border-blue-500/20 flex items-center justify-center">
                            {processing3DSStep === 3 ? (
                                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 animate-bounce" />
                            ) : processing3DSStep === 4 ? (
                                <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12 text-rose-500" />
                            ) : (
                                <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
                            )}
                        </div>
                        {processing3DSStep < 3 && (
                            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        {processing3DSStep === 3 ? 'Payment Verified!' : processing3DSStep === 4 ? 'Payment Failed' : 'Verifying Demo Card...'}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        {processing3DSMsg}
                    </p>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 sm:h-2.5 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-700 ${
                            processing3DSStep === 3 ? 'bg-emerald-500 w-full' : processing3DSStep === 4 ? 'bg-rose-500 w-full' : processing3DSStep === 2 ? 'bg-blue-600 w-3/4 animate-pulse' : 'bg-blue-400 w-1/3'
                        }`}
                    ></div>
                </div>

                <div className="flex justify-center items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1 sm:pt-2">
                    <Shield size={12} className="text-emerald-500" /> 256-Bit Encrypted Demo Sandbox
                </div>
            </div>
        </Modal>
    );
};

export default TopupModal;
