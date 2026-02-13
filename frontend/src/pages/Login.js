import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, LogIn, Briefcase, Smile, Loader2, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { API_BASE_URL } from '../api/config';

const Login = () => {
    const [form, setForm] = useState({ identifier: '', password: '', role: 'customer' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, form);
            const { token, user } = res.data.data;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));

            toast.success(res.data.message || "Welcome back!");
            if (user.role === 'vendor') {
                navigate('/vendor');
            } else {
                navigate('/customer');
            }
        } catch (err) {
            console.error("Login Error Details:", err);
            toast.error("Login failed: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex justify-center items-center relative overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 mx-6">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-3xl text-white shadow-2xl shadow-blue-500/20 mb-6 group transition-transform hover:scale-110">
                        <Zap size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight text-center">Login</h2>
                    <p className="text-blue-200/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Welcome to Dairy Hub</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Email or Name"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm"
                                value={form.identifier}
                                onChange={e => setForm({ ...form, identifier: e.target.value })}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm"
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
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl hover:bg-blue-500 transition-all flex justify-center items-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> Login</>}
                    </button>
                </form>

                <div className="mt-10 text-center space-y-4">
                    <p className="text-slate-500 text-xs font-bold">
                        Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Sign Up</Link>
                    </p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <Link to="/forgot-password" title="Recover Password" override="forgot-password-link" className="hover:text-blue-400 transition-colors">Forgot your password?</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
