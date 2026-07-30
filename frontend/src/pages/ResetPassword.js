import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../api/config';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const role = query.get('role');

    useEffect(() => {
        if (!token || !role) {
            toast.error("Invalid reset link");
            navigate('/');
        }
    }, [token, role, navigate]);

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/reset-password`, {
                token,
                newPassword: password,
                role
            });
            toast.success("Password reset successful! Please login.");
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || "Reset failed");
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
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center">Reset Password</h2>
                    <p className="text-emerald-600 text-[11px] font-extrabold uppercase tracking-[0.25em] mt-1.5">Set your new password</p>
                </div>

                <form onSubmit={handleReset} className="space-y-5">
                    <div className="space-y-3.5">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="block w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-semibold text-sm shadow-sm"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="block w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-semibold text-sm shadow-sm"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl transition-all flex justify-center items-center gap-2.5 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/30 transform active:scale-[0.99] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 hover:text-emerald-600 transition-colors">
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
