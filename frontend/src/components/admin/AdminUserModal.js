import React from 'react';
import { X, Save, UserPlus } from 'lucide-react';

export const AdminEditUserModal = ({ editModal, setEditModal, handleSaveEdit, isDarkMode }) => {
    if (!editModal.isOpen || !editModal.data) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditModal({ isOpen: false, data: null, initialData: null, role: '' })}></div>
            <div className={`relative w-full max-w-lg rounded-2xl sm:rounded-[2.5rem] border shadow-2xl p-5 sm:p-8 animate-modal ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <h3 className={`text-lg sm:text-xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit {editModal.role}</h3>
                        <p className="text-slate-500 text-xs mt-0.5">Modify profile details and security settings</p>
                    </div>
                    <button
                        onClick={() => setEditModal({ isOpen: false, data: null, initialData: null, role: '' })}
                        className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={editModal.data.name || ''}
                                onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={editModal.data.email || ''}
                                onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, email: e.target.value } }))}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                maxLength={10}
                                inputMode="numeric"
                                className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={editModal.data.phone || ''}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setEditModal(prev => ({ ...prev, data: { ...prev.data, phone: val } }));
                                }}
                            />
                        </div>

                        {editModal.role === 'vendor' && (
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Milk Rate (₹/L)</label>
                                <input
                                    type="number"
                                    required
                                    className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={editModal.data.rate || ''}
                                    onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, rate: e.target.value } }))}
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">New Password (Optional)</label>
                            <input
                                type="password"
                                placeholder="Leave blank to keep unchanged"
                                className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={editModal.data.password || ''}
                                onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, password: e.target.value } }))}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setEditModal({ isOpen: false, data: null, initialData: null, role: '' })}
                            className={`flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={JSON.stringify(editModal.data) === JSON.stringify(editModal.initialData)}
                            className={`flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl ${JSON.stringify(editModal.data) === JSON.stringify(editModal.initialData)
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

export const AdminAddUserModal = ({ isAddModalOpen, setIsAddModalOpen, newUserData, setNewUserData, handleAddUser, isDarkMode }) => {
    if (!isAddModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
            <div className={`relative w-full max-w-lg rounded-2xl sm:rounded-[2.5rem] border shadow-2xl p-5 sm:p-8 animate-modal ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <h3 className={`text-lg sm:text-xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add New User</h3>
                        <p className="text-slate-500 text-xs mt-0.5">Create a new customer or vendor account</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(false)}
                        className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Role</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNewUserData({ ...newUserData, role: 'customer' })}
                                    className={`flex-1 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all ${newUserData.role === 'customer' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                >
                                    Customer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewUserData({ ...newUserData, role: 'vendor' })}
                                    className={`flex-1 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all ${newUserData.role === 'vendor' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                >
                                    Vendor
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. John Doe"
                                className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={newUserData.name}
                                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="e.g. john@example.com"
                                className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={newUserData.email}
                                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="10 digits"
                                maxLength={10}
                                inputMode="numeric"
                                className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={newUserData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setNewUserData({ ...newUserData, phone: val });
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Min 6 characters"
                                className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                value={newUserData.password}
                                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                            />
                        </div>
                        {newUserData.role === 'vendor' && (
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block px-1">Milk Rate (₹/L)</label>
                                <input
                                    type="number"
                                    required
                                    className={`w-full border rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                    value={newUserData.rate}
                                    onChange={(e) => setNewUserData({ ...newUserData, rate: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className={`flex-1 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/20"
                        >
                            <UserPlus size={16} /> Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
