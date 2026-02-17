import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, DollarSign, Save } from 'lucide-react';

export const DeleteModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-modal text-center ${isDarkMode ? 'bg-slate-900 border border-white/10' : 'bg-white'}`}>
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-600">
                        <AlertTriangle size={32} />
                    </div>
                </div>
                <h3 className={`text-xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Are you sure you want to change the status?</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Please confirm to proceed</p>

                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/30 transition-all active:scale-95"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onClose}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export const EditUserModal = ({ isOpen, onClose, data, role, isDarkMode, onSave }) => {
    const [formData, setFormData] = useState(data || {});

    useEffect(() => {
        setFormData(data || {});
    }, [data]);

    if (!isOpen || !data) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(data);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative w-full max-w-lg rounded-[2.5rem] border shadow-2xl p-8 animate-modal ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className={`text-xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{role === 'customer' ? 'Edit Customer' : 'Edit Vendor'}</h3>
                        <p className="text-slate-500 text-xs mt-1">Update details for ID: #{data.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={formData.email || ''}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                maxLength={10}
                                inputMode="numeric"
                                className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={formData.phone || ''}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setFormData({ ...formData, phone: val });
                                }}
                            />
                        </div>
                        {role === 'vendor' && (
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Milk Rate (₹/L)</label>
                                <div className={`flex items-center gap-3 border rounded-2xl px-5 py-3.5 transition-all focus-within:ring-4 focus-within:ring-blue-500/20 ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                                    <DollarSign size={16} className="text-slate-400" />
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-transparent text-sm font-bold focus:outline-none"
                                        value={formData.rate || ''}
                                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!hasChanges}
                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${!hasChanges
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600 shadow-none'
                                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20'
                                }`}
                        >
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AddUserModal = ({ isOpen, onClose, isDarkMode, onAdd }) => {
    const [newUserData, setNewUserData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer',
        rate: 60
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(newUserData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative w-full max-w-lg rounded-[2.5rem] border shadow-2xl p-8 animate-modal ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className={`text-xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add New User</h3>
                        <p className="text-slate-500 text-xs mt-1">Create a new customer or vendor account</p>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Role</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNewUserData({ ...newUserData, role: 'customer' })}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newUserData.role === 'customer' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                >
                                    Customer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewUserData({ ...newUserData, role: 'vendor' })}
                                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newUserData.role === 'vendor' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                >
                                    Vendor
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. John Doe"
                                className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={newUserData.name}
                                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="e.g. john@example.com"
                                className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={newUserData.email}
                                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                maxLength={10}
                                inputMode="numeric"
                                placeholder="e.g. 9876543210"
                                className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={newUserData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setNewUserData({ ...newUserData, phone: val });
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={newUserData.password}
                                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                            />
                        </div>

                        {newUserData.role === 'vendor' && (
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Milk Rate (₹/L)</label>
                                <div className={`flex items-center gap-3 border rounded-2xl px-5 py-3.5 transition-all focus-within:ring-4 focus-within:ring-blue-500/20 ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                                    <DollarSign size={16} className="text-slate-400" />
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-transparent text-sm font-bold focus:outline-none"
                                        value={newUserData.rate}
                                        onChange={(e) => setNewUserData({ ...newUserData, rate: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                        >
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
