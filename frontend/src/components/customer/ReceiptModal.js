import React from 'react';
import { Plus, Printer, Download } from 'lucide-react';
import Modal from '../shared/Modal';

const ReceiptModal = ({ selectedReceipt, onCloseReceipt, handleExportReceipt }) => {
    return (
        <Modal
            isOpen={!!selectedReceipt}
            onClose={onCloseReceipt}
            title="Receipt"
        >
            {selectedReceipt && (
                <div className="space-y-6 sm:space-y-8 animate-fadeIn">
                    <div className="text-center space-y-2 border-b-2 border-dashed border-slate-100 dark:border-slate-800 pb-6 sm:pb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 dark:bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xl rotate-3 transition-transform hover:rotate-0 duration-500">
                            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Milk Receipt</h3>
                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">Verified Transaction</p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Transaction ID</p>
                                <p className="text-xs font-black text-slate-900 dark:text-white tracking-widest font-mono">#{String(selectedReceipt.id).slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Date</p>
                                <p className="text-xs font-black text-slate-900 dark:text-white">{selectedReceipt.date}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4 shadow-inner">
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-[10px] font-black text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-600 shadow-sm transition-transform group-hover:scale-110">{selectedReceipt.Vendor?.name ? selectedReceipt.Vendor.name[0] : 'V'}</div>
                                    <p className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">{selectedReceipt.Vendor?.name}</p>
                                </div>
                                <p className="text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-500">Authorized Seller</p>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Item</p>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Qty & Rate</p>
                                </div>
                                <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <p className="text-xs font-black text-slate-900 dark:text-white">Milk ({selectedReceipt.type === 'subscription' ? 'Subscription' : 'One-time'})</p>
                                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedReceipt.quantity}L @ ₹{(selectedReceipt.amount / selectedReceipt.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-4 bg-blue-50/30 dark:bg-blue-900/10 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-blue-100/50 dark:border-blue-900/20">
                            <p className="text-[9px] sm:text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Total Amount</p>
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">₹{parseFloat(selectedReceipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>

                    <div className="py-3 sm:py-4 px-4 sm:px-6 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Delivered & Verified</p>
                        </div>
                        <span className="text-[8px] font-black text-emerald-600/50 dark:text-emerald-400/50 uppercase tracking-[0.15em] hidden sm:inline">SECURE TRANSACTION</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                        <button
                            onClick={() => window.print()}
                            className="bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95"
                        >
                            <Printer size={16} /> Print
                        </button>
                        <button
                            onClick={handleExportReceipt}
                            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 dark:shadow-none flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Download size={16} /> Export
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ReceiptModal;
