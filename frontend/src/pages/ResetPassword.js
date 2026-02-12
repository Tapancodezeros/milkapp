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
        <div className="min-h-screen bg-[#0F172A] flex justify-center items-center relative overflow-hidden font-sans">
            <div className="absolute top-0 -left-40 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 mx-6">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 p-4 rounded-3xl text-white shadow-2xl shadow-emerald-500/20 mb-6 group transition-transform hover:scale-110">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight text-center">Reset Password</h2>
                    <p className="text-emerald-200/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Set your new password</p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-sm"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-5 rounded-2xl hover:bg-emerald-500 transition-all flex justify-center items-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <Link to="/" className="text-slate-500 text-xs font-bold flex items-center justify-center gap-2 hover:text-emerald-400 transition-colors">
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
