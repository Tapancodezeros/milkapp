import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-6 overflow-hidden">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500"
                onClick={onClose}
            ></div>
            <div className={`bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] w-full ${maxWidth} max-h-[90vh] sm:max-h-[88vh] flex flex-col relative z-10 overflow-hidden animate-modal border border-white/20 dark:border-slate-800 transition-colors duration-500`}>
                <div className="p-4 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-tr from-slate-50/50 to-white dark:from-slate-900/50 dark:to-transparent relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate pr-2">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl sm:rounded-2xl transition-all active:scale-90 border border-transparent hover:border-red-100 dark:hover:border-red-900/50 flex-shrink-0"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
                    </button>
                </div>
                <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-4 sm:space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
