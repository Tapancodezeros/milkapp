import React, { useState } from 'react';
import { User, Phone, Lock, Save, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { API_BASE_URL } from '../../api/config';

const ProfileModal = ({ isOpen, onClose, user, role, onUpdate }) => {
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const endpoint = role === 'vendor' ? `${API_BASE_URL}/vendor/profile` : `${API_BASE_URL}/customer/profile`;
            const res = await axios.put(endpoint, form, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Profile updated successfully!");
            if (onUpdate) onUpdate(res.data.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-sm"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-sm"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="password"
                            placeholder="New Password (leave blank to keep current)"
                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-sm"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                </div>

                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center px-4">
                    Your email ({user?.email}) cannot be changed for security reasons.
                </p>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all flex justify-center items-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-xl transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                </button>
            </form>
        </Modal>
    );
};

export default ProfileModal;
