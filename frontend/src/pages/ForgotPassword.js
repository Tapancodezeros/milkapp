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
            toast.success("Reset link created! (Check console for token)");
            setTimeout(() => {
                navigate(`/reset-password?token=${res.data.data.token}&role=${role}`);
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.error || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex justify-center items-center relative overflow-hidden font-sans">
            <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>

            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10 mx-6">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-4 rounded-3xl text-white shadow-2xl shadow-blue-500/20 mb-6 group transition-transform hover:scale-110">
                        <KeyRound size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight text-center">Forgot Password</h2>
                    <p className="text-blue-200/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Recover your account</p>
                </div>

                <form onSubmit={handleForgot} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                placeholder="Registered Email Address"
                                className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-sm"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                        <button
                            type="button"
                            onClick={() => setRole('customer')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'customer' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            Customer
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('vendor')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'vendor' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            Vendor
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl hover:bg-blue-500 transition-all flex justify-center items-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Request Reset'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <Link to="/" className="text-slate-500 text-xs font-bold flex items-center justify-center gap-2 hover:text-blue-400 transition-colors">
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
