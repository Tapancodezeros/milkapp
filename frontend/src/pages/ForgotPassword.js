import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../api/config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('customer');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgot = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/forgot-password`, { email, role });
            const link = res.data.data.resetLink;
            toast.success("Reset link created! (Copied to console)");
            console.log("Password Reset Link:", link);
            setTimeout(() => {
                navigate(`/reset-password?token=${res.data.data.token}&role=${role}`);
            }, 3000);
        } catch (err) {
            toast.error(err.response?.data?.error || "Request failed");
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
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-blue-500/20 mb-4 group transition-transform hover:scale-105">
                        <KeyRound size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center">Forgot Password</h2>
                    <p className="text-blue-600 text-[11px] font-extrabold uppercase tracking-[0.25em] mt-1.5">Recover your account</p>
                </div>

                <form onSubmit={handleForgot} className="space-y-5">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Registered Email Address"
                                className="block w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold text-sm shadow-sm"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/70">
                        <button
                            type="button"
                            onClick={() => setRole('customer')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${role === 'customer' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-600 hover:text-slate-900 font-bold'}`}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('vendor')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${role === 'vendor' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-600 hover:text-slate-900 font-bold'}`}
                        >
                            Vendor
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl transition-all flex justify-center items-center gap-2.5 font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 transform active:scale-[0.99] disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Request Reset'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
