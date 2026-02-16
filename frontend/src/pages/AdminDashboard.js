import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Briefcase,
    CreditCard,
    Calendar,
    LogOut,
    Trash2,
    Search,
    Menu,
    X,
    LayoutDashboard,
    UserPlus,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Moon,
    Sun,
    Pencil,
    Save,
    KeyRound,
    ExternalLink,
    DollarSign,
    Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [overviewStats, setOverviewStats] = useState(null);
    const [overviewFilter, setOverviewFilter] = useState('all');
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('adminDarkMode');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [editModal, setEditModal] = useState({ isOpen: false, data: null, role: '' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({ name: '', email: '', phone: '', password: '', role: 'customer', rate: 60 });
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('adminDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const fetchItems = async (tab) => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const url = tab === 'overview' ? 'overview' : tab;
            const params = {};
            if (tab === 'overview') params.period = overviewFilter;
            if (tab === 'transactions') params.status = transactionFilter;

            const res = await axios.get(`${API_BASE_URL}/admin/${url}`, {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (tab === 'overview') {
                setOverviewStats(res.data.data);
                setData([]);
            } else {
                setData(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to fetch data: " + (err.response?.data?.error || err.message));
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(activeTab);
    }, [activeTab, overviewFilter, transactionFilter]);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            const { role, data } = editModal;
            await axios.put(`${API_BASE_URL}/admin/user/${role}/${data.id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User updated successfully");
            setEditModal({ isOpen: false, data: null, role: '' });
            fetchItems(activeTab);
        } catch (err) {
            toast.error("Failed to update user: " + (err.response?.data?.error || err.message));
        }
    };

    const handleResetPassword = async (role, id) => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/admin/user/${role}/${id}/reset-password`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const link = res.data.data.resetLink;

            // Copy to clipboard
            navigator.clipboard.writeText(link);
            toast.success("Reset link generated & copied to clipboard!");
            console.log("Reset Link:", link);
        } catch (err) {
            toast.error("Failed to generate reset link: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDeleteUser = async (role, id) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/admin/user/${role}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User deleted successfully");
            fetchItems(activeTab);
        } catch (err) {
            toast.error("Failed to delete user: " + (err.response?.data?.error || err.message));
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/admin/user/create`, newUserData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User created successfully");
            setIsAddModalOpen(false);
            setNewUserData({ name: '', email: '', phone: '', password: '', role: 'customer', rate: 60 });
            if (activeTab === newUserData.role + 's') { // 'customer' -> 'customers', 'vendor' -> 'vendors'
                fetchItems(activeTab);
            }
        } catch (err) {
            toast.error("Failed to create user: " + (err.response?.data?.error || err.message));
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const filteredData = data.filter(item => {
        const searchInput = searchQuery.toLowerCase();
        if (activeTab === 'customers' || activeTab === 'vendors') {
            return item.name?.toLowerCase().includes(searchInput) || item.email?.toLowerCase().includes(searchInput) || item.phone?.includes(searchInput);
        }
        if (activeTab === 'transactions' || activeTab === 'subscriptions') {
            return item.Customer?.name?.toLowerCase().includes(searchInput) || item.Vendor?.name?.toLowerCase().includes(searchInput);
        }
        return true;
    });

    const MenuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'vendors', label: 'Vendors', icon: Briefcase },
        { id: 'transactions', label: 'Transactions', icon: CreditCard },
        { id: 'subscriptions', label: 'Subscriptions', icon: Calendar },
    ];

    return (
        <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 border-r transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}
            >
                <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
                            <LayoutDashboard className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Admin</h1>
                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Panel</p>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-grow">
                        {MenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20'
                                        : isDarkMode
                                            ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-8 flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black text-sm uppercase tracking-widest"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col min-w-0">
                {/* Header */}
                <header className={`h-20 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                    <div className="flex items-center gap-4 flex-grow max-w-2xl">
                        <button
                            className={`lg:hidden p-2 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X /> : <Menu />}
                        </button>
                        <div className="relative w-full">
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                className={`w-full border rounded-2xl pl-12 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800/50 border-white/5 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <UserPlus size={16} />
                            <span className="hidden sm:inline">Add User</span>
                        </button>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-3 rounded-2xl transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}                      >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8 overflow-auto">
                    <div className="mb-8">
                        <h2 className={`text-2xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'overview' ? 'Dashboard Overview' : activeTab}</h2>
                        <p className="text-slate-500 text-sm mt-1">{activeTab === 'overview' ? 'View key metrics and system performance' : `Manage and monitor all system ${activeTab}`}</p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96 gap-4">
                            <Loader2 className="animate-spin text-blue-500" size={48} />
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Loading data...</p>
                        </div>
                    ) : activeTab === 'overview' && overviewStats ? (
                        <div className="space-y-8">
                            {/* Filter and Grid */}
                            <div>
                                <div className="flex items-center justify-end mb-6">
                                    <div className={`inline-flex p-1.5 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        {['all', 'this_month', 'last_month', 'this_week'].map((period) => (
                                            <button
                                                key={period}
                                                onClick={() => setOverviewFilter(period)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${overviewFilter === period ? (isDarkMode ? 'bg-slate-700 text-white shadow-lg' : 'bg-white text-slate-900 shadow-lg') : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {period === 'all' && <Filter size={14} />}
                                                {period.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                                <Users size={24} />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Customers</div>
                                        </div>
                                        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{overviewStats.totalCustomers}</div>
                                    </div>
                                    <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                                                <Briefcase size={24} />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Vendors</div>
                                        </div>
                                        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{overviewStats.totalVendors}</div>
                                    </div>
                                    <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                                                <DollarSign size={24} />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Revenue</div>
                                        </div>
                                        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{overviewStats.totalRevenue?.toLocaleString()}</div>
                                    </div>
                                    <div className={`p-6 rounded-[2rem] border transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                                <Calendar size={24} />
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Subs</div>
                                        </div>
                                        <div className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{overviewStats.activeSubscriptions}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
                                <div className={`p-8 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Transactions</h3>
                                            <p className="text-slate-500 text-xs mt-1 font-medium">Latest 5 financial activities</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className={`border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Vendor</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Amount</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                                            {overviewStats.recentTransactions?.length > 0 ? (
                                                overviewStats.recentTransactions.map((tx) => (
                                                    <tr key={tx.id} className={`transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                                                        <td className={`px-8 py-5 text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className={`px-8 py-5 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                            {tx.Customer?.name || 'Unknown'}
                                                        </td>
                                                        <td className={`px-8 py-5 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                            {tx.Vendor?.name || 'Unknown'}
                                                        </td>
                                                        <td className={`px-8 py-5 text-sm font-bold text-right ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                            ₹{tx.amount}
                                                        </td>
                                                        <td className="px-8 py-5 text-center">
                                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.status === 'completed'
                                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                                : 'bg-amber-500/10 text-amber-500'
                                                                }`}>
                                                                {tx.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-12 text-center text-slate-500 text-sm font-medium">
                                                        No recent transactions found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center h-96 rounded-[2.5rem] border border-dashed p-12 text-center ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className={`p-6 rounded-[2rem] mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <Search size={48} className="text-slate-400" />
                            </div>
                            <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No results found</h3>
                            <p className="text-slate-500 max-w-sm mt-2 font-medium">We couldn't find any {activeTab} matching your current search or filters.</p>
                        </div>
                    ) : (
                        <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'}`}>
                            {activeTab === 'transactions' && (
                                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>All Transactions</h3>
                                    <div className="flex gap-2">
                                        {['all', 'completed', 'pending'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setTransactionFilter(status)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${transactionFilter === status ? (isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white') : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                            >
                                                {status === 'completed' ? 'Paid' : status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className={`border-b border-white/5 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                            {activeTab === 'customers' || activeTab === 'vendors' ? (
                                                <>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Name</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Phone</th>
                                                    {activeTab === 'vendors' && <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Rate</th>}
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                                                </>
                                            ) : activeTab === 'transactions' ? (
                                                <>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Vendor</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Vendor</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Quantity</th>
                                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                                        {filteredData.map((item) => (
                                            <tr key={item.id} className={`transition-colors group ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                                                {activeTab === 'customers' || activeTab === 'vendors' ? (
                                                    <>
                                                        <td className="px-8 py-5">
                                                            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</div>
                                                            <div className="text-[10px] text-slate-500 uppercase tracking-tighter mt-0.5">ID: #{item.id}</div>
                                                        </td>
                                                        <td className={`px-8 py-5 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.email}</td>
                                                        <td className={`px-8 py-5 text-sm font-mono italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.phone}</td>
                                                        {activeTab === 'vendors' && <td className="px-8 py-5 text-sm font-bold text-blue-500">₹{item.rate}/L</td>}
                                                        <td className="px-8 py-5 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => setEditModal({ isOpen: true, role: activeTab === 'vendors' ? 'vendor' : 'customer', data: { ...item } })}
                                                                    className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-blue-500 hover:bg-blue-500/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                                    title="Edit User"
                                                                >
                                                                    <Pencil size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleResetPassword(activeTab === 'vendors' ? 'vendor' : 'customer', item.id)}
                                                                    className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                                                    title="Generate Reset Password Link"
                                                                >
                                                                    <KeyRound size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(activeTab === 'vendors' ? 'vendor' : 'customer', item.id)}
                                                                    className={`p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-500 hover:text-red-500 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                                                                    title="Delete User"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : activeTab === 'transactions' ? (
                                                    <>
                                                        <td className="px-8 py-5">
                                                            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Customer?.name}</div>
                                                            <div className="text-[10px] text-slate-500 uppercase">{item.Customer?.phone}</div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Vendor?.name}</div>
                                                            <div className="text-[10px] text-slate-500 uppercase">{item.Vendor?.phone}</div>
                                                        </td>
                                                        <td className="px-8 py-5 font-black text-blue-500">₹{item.amount}</td>
                                                        <td className="px-8 py-5">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                                                                }`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 text-xs text-slate-500 font-bold">{new Date(item.date || item.createdAt).toLocaleDateString()}</td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className={`px-8 py-5 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Customer?.name}</td>
                                                        <td className={`px-8 py-5 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.Vendor?.name}</td>
                                                        <td className={`px-8 py-5 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.quantity}L / day</td>
                                                        <td className="px-8 py-5">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                                }`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {editModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditModal({ isOpen: false, data: null, role: '' })}></div>
                    <div className={`relative w-full max-w-lg rounded-[2.5rem] border shadow-2xl p-8 animate-modal ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className={`text-xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit {editModal.role}</h3>
                                <p className="text-slate-500 text-xs mt-1">Update details for ID: #{editModal.data.id}</p>
                            </div>
                            <button
                                onClick={() => setEditModal({ isOpen: false, data: null, role: '' })}
                                className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        value={editModal.data.name}
                                        onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, name: e.target.value } })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        value={editModal.data.email}
                                        onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, email: e.target.value } })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Phone Number</label>
                                    <input
                                        type="text"
                                        required
                                        className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        value={editModal.data.phone}
                                        onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, phone: e.target.value } })}
                                    />
                                </div>
                                {editModal.role === 'vendor' && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Milk Rate (₹/L)</label>
                                        <input
                                            type="number"
                                            required
                                            className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                            value={editModal.data.rate}
                                            onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, rate: e.target.value } })}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditModal({ isOpen: false, data: null, role: '' })}
                                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition-all"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className={`relative w-full max-w-lg rounded-[2.5rem] border shadow-2xl p-8 animate-modal ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className={`text-xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add New User</h3>
                                <p className="text-slate-500 text-xs mt-1">Create a new customer or vendor account</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Role</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setNewUserData({ ...newUserData, role: 'customer' })}
                                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newUserData.role === 'customer' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                        >
                                            Customer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewUserData({ ...newUserData, role: 'vendor' })}
                                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${newUserData.role === 'vendor' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                                        >
                                            Vendor
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. John Doe"
                                        className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        value={newUserData.name}
                                        onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="e.g. john@example.com"
                                        className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        value={newUserData.email}
                                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Phone Number</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 9876543210"
                                        className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        value={newUserData.phone}
                                        onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Min 6 characters"
                                        className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                        value={newUserData.password}
                                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                    />
                                </div>
                                {newUserData.role === 'vendor' && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block px-1">Milk Rate (₹/L)</label>
                                        <input
                                            type="number"
                                            required
                                            className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                            value={newUserData.rate}
                                            onChange={(e) => setNewUserData({ ...newUserData, rate: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition-all"
                                >
                                    <UserPlus size={16} /> Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
