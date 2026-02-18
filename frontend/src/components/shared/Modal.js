import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500"
                onClick={onClose}
            ></div>
            <div className="glass-card w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up border border-slate-200/50 dark:border-white/10 rounded-[2.5rem]">
                <div className="p-8 border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-white/5">
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl transition-all active:scale-95 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
