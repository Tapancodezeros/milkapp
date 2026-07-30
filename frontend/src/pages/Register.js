import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Phone, Mail, UserPlus, Briefcase, Smile, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { API_BASE_URL } from '../api/config';
import { getAuthToken, getAuthUser, getDashboardPath } from '../utils/auth';

const Register = () => {
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', role: 'customer' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = getAuthToken();
        const user = getAuthUser();
        if (token && user?.role) {
            navigate(getDashboardPath(user.role), { replace: true });
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (form.name.length < 2 || form.name.length > 50) {
            return toast.error("Name must be between 2 and 50 characters");
        }
        if (form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            return toast.error("Invalid email address format");
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex justify-center items-center relative overflow-hidden font-sans p-4 sm:p-6">
            {/* Ambient Gradient Glows */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full filter blur-[128px]"></div>
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-teal-500/20 rounded-full filter blur-[128px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full filter blur-[128px]"></div>

            <div className="bg-white/90 backdrop-blur-2xl border border-white/80 p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 p-4 rounded-3xl text-white shadow-xl shadow-emerald-500/20 mb-4 group transition-transform hover:scale-105">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center">Join Dairy Hub</h2>
                    <p className="text-emerald-600 text-[11px] font-extrabold uppercase tracking-[0.25em] mt-1.5">Create your account</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-3">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="block w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-semibold text-sm shadow-sm"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type="tel"
                                placeholder="Phone Number (10 digits)"
                                className="block w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-semibold text-sm shadow-sm"
                                value={form.phone}
                                maxLength={10}
                                inputMode="numeric"
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 10) setForm({ ...form, phone: val });
                                }}
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="block w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-semibold text-sm shadow-sm"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="block w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-semibold text-sm shadow-sm"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/70">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: 'customer' })}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${form.role === 'customer' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'text-slate-600 hover:text-slate-900 font-bold'}`}
                        >
                            <Smile size={14} /> Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: 'vendor' })}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${form.role === 'vendor' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'text-slate-600 hover:text-slate-900 font-bold'}`}
                        >
                            <Briefcase size={14} /> Vendor
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl transition-all flex justify-center items-center gap-2.5 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/30 transform active:scale-[0.99] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-600 text-xs font-semibold">
                        Already have an account? <Link to="/" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors hover:underline">Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
