import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, LogIn, Briefcase, Smile, Loader2, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
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
            } else if (user.role === 'admin') {
                navigate('/admin');
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
        <div className="min-h-screen bg-background flex relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-primary-900/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent-900/20 rounded-full blur-[100px] translate-y-1/3 pointer-events-none"></div>

            {/* Left Side: Brand & Visuals (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative z-10 text-white">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-tr from-primary-500 to-accent-500 p-2.5 rounded-xl shadow-lg shadow-primary-500/30">
                            <Zap size={24} className="text-white" fill="currentColor" />
                        </div>
                        <h1 className="text-2xl font-display font-bold tracking-tight">DairyHub</h1>
                    </div>
                </div>

                <div className="max-w-md">
                    <h2 className="text-6xl font-display font-bold leading-tight mb-6">
                        Fresh Milk, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Delivered Daily.</span>
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        Experience the premium marketplace for dairy products. Connect with verified local vendors and manage your subscriptions with ease.
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                                    <User size={16} />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-white">2k+ Happy Customers</p>
                            <div className="flex text-yellow-500 text-xs gap-0.5 mt-0.5">
                                {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                    © 2024 DairyHub Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    <div className="glass-card p-8 md:p-12 rounded-3xl border-t border-white/10 relative overflow-hidden group">

                        {/* Decorative top sheen */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="mb-10">
                            <h3 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h3>
                            <p className="text-slate-400">Please enter your details to sign in.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Role Selector */}
                            <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 mx-auto">
                                {[
                                    { id: 'customer', icon: Smile, label: 'Customer' },
                                    { id: 'vendor', icon: Briefcase, label: 'Vendor' },
                                    { id: 'admin', icon: ShieldCheck, label: 'Admin' }
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setForm({ ...form, role: role.id })}
                                        className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${form.role === role.id
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                            }`}
                                    >
                                        <role.icon size={16} />
                                        {role.label}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email or Username</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            className="glass-input block w-full pl-12 pr-4 py-4 rounded-xl text-sm font-medium"
                                            placeholder="Enter your identifier"
                                            value={form.identifier}
                                            onChange={e => setForm({ ...form, identifier: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            className="glass-input block w-full pl-12 pr-4 py-4 rounded-xl text-sm font-medium"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 font-bold text-sm tracking-wide shadow-lg shadow-primary-900/20 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                            <p className="text-slate-400 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">
                                    Create Free Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
