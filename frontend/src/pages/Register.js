import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Phone, Mail, UserPlus, Briefcase, Smile, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { API_BASE_URL } from '../api/config';

const Register = () => {
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', role: 'customer' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (form.name.length < 2 || form.name.length > 50) {
            return toast.error("Name must be between 2 and 50 characters");
        }
        if (form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        if (!form.email.includes('@')) {
            return toast.error("Invalid email address");
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/register`, form);
            toast.success("Account Created. Please Login.");
            navigate('/');
        } catch (err) {
            toast.error("Registration Failed: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex justify-center items-center relative overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-0 -right-40 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 mx-6">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 p-4 rounded-3xl text-white shadow-2xl shadow-emerald-500/20 mb-6 group transition-transform hover:scale-110">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight text-center">Join Dairy Hub</h2>
                    <p className="text-emerald-200/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Create your account</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-3">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: 'customer' })}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.role === 'customer' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Smile size={14} /> Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: 'vendor' })}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.role === 'vendor' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            <Briefcase size={14} /> Vendor
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-5 rounded-2xl hover:bg-emerald-500 transition-all flex justify-center items-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-xs font-bold">
                        Already have an account? <Link to="/" className="text-emerald-400 hover:text-emerald-300 transition-colors">Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
