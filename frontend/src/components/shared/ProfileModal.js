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
                            <User className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="glass-input w-full pl-12 pr-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="glass-input w-full pl-12 pr-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 transition-colors" />
                        </div>
                        <input
                            type="password"
                            placeholder="New Password (leave blank to keep current)"
                            className="glass-input w-full pl-12 pr-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                </div>

                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center px-4">
                    Your email ({user?.email}) cannot be changed for security reasons.
                </p>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-xl transition-all flex justify-center items-center gap-3 font-bold text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 transform active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                </button>
            </form>
        </Modal>
    );
};

export default ProfileModal;
