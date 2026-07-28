import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Loader2,
    Calendar,
    ArrowRight,
    ArrowLeft,
    Plus,
    Printer,
    Download,
    TriangleAlert,
    Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import Header from '../components/shared/Header';
import CustomerHero from '../components/customer/CustomerHero';
import CustomerInsights from '../components/customer/CustomerInsights';
import Marketplace from '../components/customer/Marketplace';
import SavedVendorsPanel from '../components/customer/SavedVendorsPanel';
import AnalyticsChart from '../components/vendor/AnalyticsChart';
import SubscriptionItem from '../components/customer/SubscriptionItem';
import CustomerTransactions from '../components/customer/CustomerTransactions';
import Modal from '../components/shared/Modal';
import ProfileModal from '../components/shared/ProfileModal';
import { getAuthToken, getAuthUser, setAuth, clearAuth } from '../utils/auth';
import RainyWeatherBanner from '../components/shared/RainyWeatherBanner';
import RainPreferencesModal from '../components/customer/RainPreferencesModal';
import { API_BASE_URL } from '../api/config';

const CustomerDashboard = () => {
    const SAVED_VENDORS_KEY = 'milkapp_saved_vendors';
    const [vendors, setVendors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [transactions, setTransactions] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [action, setAction] = useState(null); // 'buy' or 'subscribe'
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [form, setForm] = useState({ quantity: '', duration: '7_days' });
    const [topupAmount, setTopupAmount] = useState('');
    const [walletPassword, setWalletPassword] = useState('');
    const [showTopup, setShowTopup] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [marketFilters, setMarketFilters] = useState({
        availableOnly: false,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        minRate: '',
        maxRate: ''
    });
    const [insights, setInsights] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(true);
    const [savedVendors, setSavedVendors] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [txFilter, setTxFilter] = useState('all');
    const [weatherAdvisory, setWeatherAdvisory] = useState(null);
    const [showRainModal, setShowRainModal] = useState(false);
    const navigate = useNavigate();

    const fetchWeatherAdvisory = React.useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/weather/advisory`);
            setWeatherAdvisory(res.data.data);
        } catch (err) {
            console.error("Weather Advisory Fetch Error:", err);
        }
    }, []);

    const handleExportReceipt = () => {
        if (!selectedReceipt) return;

        const headers = ['ReceiptID', 'Date', 'Vendor', 'Item', 'Quantity(L)', 'Amount(INR)', 'Status'];
        const row = [
            `#${String(selectedReceipt.id).slice(-8).toUpperCase()}`,
            selectedReceipt.date,
            selectedReceipt.Vendor?.name || 'Unknown',
            `Milk (${selectedReceipt.type === 'subscription' ? 'Sub' : 'One-time'})`,
            selectedReceipt.quantity,
            selectedReceipt.amount,
            'Verified'
        ];

        const csvContent = [headers.join(','), row.join(',')].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Receipt_${selectedReceipt.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportAllTransactions = () => {
        if (!transactions || transactions.length === 0) return toast.error("No transactions to export");

        const headers = ['ID', 'Date', 'Vendor', 'Quantity(L)', 'Amount(INR)', 'Type', 'Status'];
        const rowMapper = (t) => [
            t.id,
            t.date,
            t.Vendor?.name || 'Unknown',
            t.quantity,
            t.amount,
            t.type,
            t.status
        ];

        const csvContent = [
            headers.join(','),
            ...transactions.map(t => rowMapper(t).map(val => `"${val || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `customer_transactions_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredTransactions = transactions.filter(t => {
        if (txFilter === 'all') return true;
        if (txFilter === 'pending') return t.status === 'pending';
        if (txFilter === 'completed') return t.status === 'completed';
        if (txFilter === 'delivered') return t.deliveryStatus === 'delivered';
        if (txFilter === 'issues') return t.deliveryStatus === 'not_delivered';
        return true;
    });

    const token = getAuthToken();
    const user = getAuthUser();
    const savedVendorIds = savedVendors.map((vendor) => vendor.id);

    const fetchMarketData = React.useCallback(async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: currentPage,
                    limit: 3,
                    search: searchQuery,
                    availableOnly: marketFilters.availableOnly,
                    sortBy: marketFilters.sortBy,
                    sortOrder: marketFilters.sortOrder,
                    minRate: marketFilters.minRate,
                    maxRate: marketFilters.maxRate
                }
            };
            const vRes = await axios.get(`${API_BASE_URL}/vendors`, config);
            setVendors(vRes.data.data.vendors || []);
            setTotalPages(vRes.data.data.pagination?.totalPages || 1);
        } catch (err) {
            console.error("Market Fetch Error:", err);
        }
    }, [token, currentPage, searchQuery, marketFilters]);

    const fetchInsights = React.useCallback(async () => {
        try {
            setInsightsLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_BASE_URL}/customer/insights`, config);
            setInsights(res.data.data);
        } catch (err) {
            console.error("Insights Fetch Error:", err);
        } finally {
            setInsightsLoading(false);
        }
    }, [token]);

    const fetchTransactions = React.useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_BASE_URL}/transactions`, config);
            setTransactions(res.data.data);
        } catch (err) {
            console.error("Transactions Fetch Error:", err);
        }
    }, [token]);

    const fetchSubscriptions = React.useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`${API_BASE_URL}/subscriptions`, config);
            setSubscriptions(res.data.data);
        } catch (err) {
            console.error("Subscriptions Fetch Error:", err);
        }
    }, [token]);

    const fetchProfile = React.useCallback(async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const profileRes = await axios.get(`${API_BASE_URL}/customer/me`, config);
            setWalletBalance(parseFloat(profileRes.data.data.walletBalance) || 0);
            setProfileData(profileRes.data.data);
        } catch (err) {
            console.error("Profile Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const showConfirmToast = (message, onConfirm, type = 'danger') => {
        toast((t) => (
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 flex flex-col gap-5 min-w-[320px] transform transition-all duration-500 ease-out translate-x-0">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'} dark:bg-opacity-10 shadow-inner`}>
                        <TriangleAlert size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-black text-slate-900 dark:text-white leading-snug">{message}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Please confirm to proceed</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { toast.dismiss(t.id); onConfirm(); }}
                        className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${type === 'danger'
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-200 dark:shadow-none'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-200 dark:shadow-none'
                            }`}
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200/50 dark:border-slate-700/50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            position: 'top-center',
            style: { background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }
        });
    };

    useEffect(() => {
        if (!token || user?.role !== 'customer') {
            navigate('/');
            return;
        }
        fetchMarketData();
        fetchTransactions();
        fetchSubscriptions();
        fetchProfile();
        fetchInsights();
        fetchWeatherAdvisory();
    }, [fetchInsights, fetchMarketData, fetchTransactions, fetchSubscriptions, fetchProfile, fetchWeatherAdvisory, navigate, token, user?.role]);

    useEffect(() => {
        try {
            const rawSavedVendors = localStorage.getItem(SAVED_VENDORS_KEY);
            if (rawSavedVendors) {
                setSavedVendors(JSON.parse(rawSavedVendors));
            }
        } catch (error) {
            console.error('Saved vendors load error:', error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(SAVED_VENDORS_KEY, JSON.stringify(savedVendors));
        } catch (error) {
            console.error('Saved vendors persist error:', error);
        }
    }, [savedVendors]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, marketFilters.availableOnly, marketFilters.sortBy, marketFilters.sortOrder, marketFilters.minRate, marketFilters.maxRate]);

    const scrollToMarketplace = () => {
        document.getElementById('customer-marketplace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const openVendorAction = (vendor, nextAction) => {
        setForm({ quantity: '', duration: '7_days', deliveryTime: '07:00 AM' });
        setSelectedVendor(vendor);
        setAction(nextAction);
    };

    const createVendorSnapshot = (vendor) => ({
        id: vendor.id,
        name: vendor.name,
        rate: vendor.rate,
        availableMilk: vendor.availableMilk,
        isAvailable: vendor.isAvailable
    });

    const toggleSavedVendor = (vendor) => {
        const vendorSnapshot = createVendorSnapshot(vendor);
        const alreadySaved = savedVendorIds.includes(vendor.id);

        setSavedVendors((current) => {
            if (alreadySaved) {
                toast.success(`${vendor.name} removed from saved vendors`);
                return current.filter((entry) => entry.id !== vendor.id);
            }

            toast.success(`${vendor.name} saved for quick access`);
            return [vendorSnapshot, ...current.filter((entry) => entry.id !== vendor.id)].slice(0, 6);
        });
    };

    const removeSavedVendor = (vendorId) => {
        setSavedVendors((current) => current.filter((vendor) => vendor.id !== vendorId));
    };

    const handleInsightsAction = async () => {
        const nextAction = insights?.nextAction;
        if (!nextAction) return;

        if (nextAction.type === 'topup') {
            setShowTopup(true);
            return;
        }

        if (nextAction.type === 'pay_pending' && nextAction.transactionId) {
            await handlePayTransaction(nextAction.transactionId);
            return;
        }

        if (nextAction.type === 'subscribe' && insights?.recommendedVendor) {
            openVendorAction(insights.recommendedVendor, 'subscribe');
            return;
        }

        scrollToMarketplace();
    };

    const handleTopup = async (e) => {
        e.preventDefault();
        const amt = parseFloat(topupAmount);
        if (!amt || amt < 10) {
            return toast.error("Topup must be at least ₹10");
        }
        if (walletBalance + amt > 50000) {
            return toast.error(`Wallet balance cannot exceed ₹50,000. Current: ₹${walletBalance}`);
        }
        if (!walletPassword) {
            return toast.error("Please enter your account password");
        }

        setActionLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API_BASE_URL}/customer/topup`, { amount: amt, password: walletPassword }, config);
            toast.success(`₹${amt} added to your wallet`);
            setShowTopup(false);
            setTopupAmount('');
            setWalletPassword('');
            fetchProfile();
            fetchInsights();
        } catch (err) {
            toast.error(err.response?.data?.error || "Topup failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const amt = parseFloat(topupAmount);
        if (!amt || amt < 10) {
            return toast.error("Withdrawal must be at least ₹10");
        }
        if (amt > walletBalance) {
            return toast.error("Insufficient balance");
        }
        if (!walletPassword) {
            return toast.error("Please enter your account password");
        }

        setActionLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${API_BASE_URL}/customer/withdraw`, { amount: amt, password: walletPassword }, config);
            toast.success(`₹${amt} withdrawn from wallet`);
            setShowWithdraw(false);
            setTopupAmount('');
            setWalletPassword('');
            fetchProfile();
            fetchInsights();
        } catch (err) {
            toast.error(err.response?.data?.error || "Withdrawal failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitAction = async (e) => {
        e.preventDefault();
        const qty = parseFloat(form.quantity);

        if (action === 'buy' && (isNaN(qty) || qty < 0.1 || qty > 100)) {
            return toast.error("Purchase quantity must be between 0.1L and 100L");
        }
        if (action === 'subscribe' && (isNaN(qty) || qty < 0.1 || qty > 50)) {
            return toast.error("Daily quantity must be between 0.1L and 50L");
        }

        if (action === 'buy' && selectedVendor) {
            const estimatedCost = qty * (selectedVendor.rate || 0);
            if (walletBalance < estimatedCost) {
                return toast.error(`Insufficient wallet balance. Total cost: ₹${estimatedCost.toFixed(2)}, Wallet balance: ₹${walletBalance.toFixed(2)}. Please add money to your wallet.`);
            }
        }
        setActionLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const endpoint = action === 'buy' ? `${API_BASE_URL}/buy` : `${API_BASE_URL}/subscribe`;
            const payload = {
                vendorId: selectedVendor.id,
                quantity: qty,
                ...(action === 'subscribe' && {
                    duration: form.duration,
                    deliveryTime: form.deliveryTime || '07:00 AM'
                })
            };

            await axios.post(endpoint, payload, config);
            toast.success(action === 'buy' ? "Purchase successful! Deducted from wallet." : "Subscription initialized!");
            setSelectedVendor(null);
            setAction(null);
            setForm({ quantity: '', duration: '7_days', deliveryTime: '07:00 AM' });
            if (action === 'buy') {
                fetchProfile();
                fetchTransactions();
            } else {
                fetchSubscriptions();
            }
            fetchInsights();
        } catch (err) {
            toast.error(err.response?.data?.error || "Transaction failed");
        } finally {
            setActionLoading(false);
        }
    };

    const toggleSubscription = (id) => {
        showConfirmToast("Are you sure you want to change the status?", () => confirmToggle(id), 'primary');
    };

    const confirmToggle = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_BASE_URL}/subscriptions/${id}/toggle`, {}, config);
            toast.success("Flow state updated");
            fetchSubscriptions();
            fetchInsights();
        } catch (err) {
            toast.error("Toggle failed");
        }
    };

    const cancelSubscription = (id) => {
        showConfirmToast("Terminate this connection permanently?", () => confirmCancel(id), 'danger');
    };

    const confirmCancel = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_BASE_URL}/subscriptions/${id}/cancel`, {}, config);
            toast.success("Subscription terminated");
            fetchSubscriptions();
            fetchInsights();
        } catch (err) {
            toast.error(err.response?.data?.error || "Cancellation failed");
        }
    };

    const deleteSubscription = (id) => {
        showConfirmToast("Delete this subscription record?", () => confirmDelete(id), 'danger');
    };

    const confirmDelete = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${API_BASE_URL}/subscriptions/${id}`, config);
            toast.success("Subscription record deleted");
            fetchSubscriptions();
            fetchInsights();
        } catch (err) {
            toast.error(err.response?.data?.error || "Deletion failed");
        }
    };

    const verifyTransaction = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put(`${API_BASE_URL}/transactions/${id}/verify`, { status }, config);
            toast.success(status === 'delivered' ? "Delivery verified" : "Issue reported");
            fetchTransactions();
            if (status === 'delivered') {
                setSelectedReceipt(res.data.data);
            }
        } catch (err) {
            toast.error("Action failed");
        }
    };

    const handlePayTransaction = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put(`${API_BASE_URL}/transactions/${id}/pay`, {}, config);
            toast.success(res.data.message);
            fetchProfile();
            fetchTransactions();
            fetchInsights();
        } catch (err) {
            toast.error(err.response?.data?.error || "Payment failed");
        }
    };

    const handleLogout = () => {
        clearAuth();
        navigate('/');
    };

    // Analytics: Monthly Spending & Volume (excludes undelivered/refunded orders)
    const analyticsMap = transactions.reduce((acc, t) => {
        if (!t.date || t.deliveryStatus === 'not_delivered' || t.status !== 'completed') return acc;
        const month = t.date.substring(0, 7); // YYYY-MM
        if (!acc[month]) acc[month] = { revenue: 0, volume: 0 };
        acc[month].revenue += (parseFloat(t.amount) || 0);
        acc[month].volume += (parseFloat(t.quantity) || 0);
        return acc;
    }, {});

    const chartData = Object.entries(analyticsMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, data]) => {
            let label = 'Unknown';
            try {
                label = new Date(month + "-01").toLocaleDateString('en-US', { month: 'short' });
            } catch (e) { }
            return {
                name: label,
                revenue: data.revenue,
                volume: data.volume
            };
        });

    const totalSpent = transactions.reduce((sum, t) => {
        if (t.deliveryStatus === 'not_delivered' || t.status !== 'completed') return sum;
        return sum + (parseFloat(t.amount) || 0);
    }, 0);
    const activeSubCount = subscriptions.filter(s => s && s.status === 'active').length;

    if (loading && vendors.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#F8FAFC]">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-pulse text-blue-600 w-8 h-8" />
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p className="font-black text-slate-900 uppercase tracking-[0.4em] text-sm animate-pulse">Loading Dashboard</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Getting latest data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 relative transition-colors duration-500">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl -ml-64 -mb-64"></div>

            <Header
                user={user}
                role="customer"
                onLogout={handleLogout}
                onSettings={() => setShowProfile(true)}
                extra={walletBalance < 100 && (
                    <div className="hidden md:flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/30 animate-pulse">
                        <TriangleAlert size={14} className="text-amber-600 dark:text-amber-400" />
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Low Balance: ₹{walletBalance}</span>
                    </div>
                )}
            />

            <main className="relative z-10 flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-20">

                <RainyWeatherBanner
                    advisory={weatherAdvisory}
                    userRole="customer"
                    customerPrefs={profileData}
                    onOpenRainModal={() => setShowRainModal(true)}
                />

                <CustomerHero
                    walletBalance={typeof walletBalance === 'number' ? walletBalance : 0}
                    totalSpent={typeof totalSpent === 'number' ? totalSpent : 0}
                    activeSubs={activeSubCount}
                    onTopupClick={() => setShowTopup(true)}
                    onWithdrawClick={() => setShowWithdraw(true)}
                />

                <CustomerInsights
                    insights={insights}
                    loading={insightsLoading}
                    onPrimaryAction={handleInsightsAction}
                    onRecommendedVendor={() => openVendorAction(insights?.recommendedVendor, 'subscribe')}
                />

                <SavedVendorsPanel
                    vendors={savedVendors}
                    onBuy={(vendor) => openVendorAction(vendor, 'buy')}
                    onSubscribe={(vendor) => openVendorAction(vendor, 'subscribe')}
                    onRemove={removeSavedVendor}
                />

                <div id="customer-marketplace">
                    <Marketplace
                        vendors={vendors}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        marketFilters={marketFilters}
                        setMarketFilters={setMarketFilters}
                        savedVendorIds={savedVendorIds}
                        onToggleSave={toggleSavedVendor}
                        onBuy={(v) => openVendorAction(v, 'buy')}
                        onSubscribe={(v) => openVendorAction(v, 'subscribe')}
                    />
                </div>

                {/* Pagination */}
                {vendors.length > 0 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
                    <div className="lg:col-span-8 space-y-20">
                        <AnalyticsChart
                            reportData={chartData}
                            title="Monthly Spending"
                            subTitle="View your milk expenses"
                        />
                    </div>

                    <div className="lg:col-span-4 space-y-10 group/sub">
                        <div className="flex justify-between items-end px-2 border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm"><Calendar size={22} strokeWidth={2.5} /></div>
                                    Subscriptions
                                </h2>
                                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mt-2 ml-1">Recurring Orders</p>
                            </div>
                            <div className="bg-indigo-600 dark:bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-indigo-100 dark:shadow-none">
                                {subscriptions.length}
                            </div>
                        </div>
                        <div className="space-y-8">
                            {subscriptions.map(sub => (
                                <SubscriptionItem
                                    key={sub.id}
                                    sub={sub}
                                    onToggle={toggleSubscription}
                                    onCancel={cancelSubscription}
                                    onDelete={deleteSubscription}
                                />
                            ))}
                            {subscriptions.length === 0 && (
                                <div className="p-20 bg-white dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center shadow-[0_20px_50px_rgba(0,0,0,0.01)] dark:shadow-none group-hover/sub:border-indigo-100 dark:group-hover/sub:border-indigo-900 transition-colors duration-500">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-700"><Calendar size={32} /></div>
                                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">No Subscriptions</p>
                                    <p className="text-xs font-bold text-slate-300 dark:text-slate-700 mt-2">Subscribe to a vendor to start</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Transaction History</h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleExportAllTransactions}
                                className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-900/50 shadow-sm transition-all"
                                title="Export All Transactions"
                            >
                                <Download size={18} />
                            </button>
                            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                {[
                                    { key: 'all', label: 'all' },
                                    { key: 'pending', label: 'pending' },
                                    { key: 'completed', label: 'paid' },
                                    { key: 'delivered', label: 'delivered' },
                                    { key: 'issues', label: 'issues' }
                                ].map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setTxFilter(key)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${txFilter === key
                                            ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <CustomerTransactions
                        transactions={filteredTransactions}
                        onVerify={verifyTransaction}
                        onShowReceipt={(t) => setSelectedReceipt(t)}
                        onPay={handlePayTransaction}
                    />
                </div>

            </main>

            {/* MODALS */}
            <Modal
                isOpen={showTopup}
                onClose={() => { setShowTopup(false); setWalletPassword(''); }}
                title="Add Money"
            >
                <form onSubmit={handleTopup} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Amount (₹)</label>
                            <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase">Max Total: 50,000</span>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-300 dark:text-slate-700 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">₹</div>
                            <input
                                type="number"
                                value={topupAmount}
                                onChange={(e) => setTopupAmount(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-8 pl-16 rounded-[2.5rem] outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-black text-4xl text-slate-900 dark:text-white shadow-inner group-hover:border-slate-200 dark:group-hover:border-slate-700"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[500, 1000, 5000].map(amt => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setTopupAmount(amt.toString())}
                                    className="py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 rounded-2xl text-[11px] font-black text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 shadow-sm"
                                >
                                    +₹{amt}
                                </button>
                            ))}
                        </div>

                        <div className="pt-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-1.5">
                                <Lock size={12} /> Confirm Account Password
                            </label>
                            <input
                                type="password"
                                value={walletPassword}
                                onChange={(e) => setWalletPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-sm text-slate-900 dark:text-white shadow-inner"
                                placeholder="Enter password to authorize"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full bg-slate-900 dark:bg-blue-600 group relative overflow-hidden text-white p-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all disabled:opacity-50 flex justify-center items-center gap-3 shadow-2xl shadow-blue-500/20 dark:shadow-none"
                    >
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        <span className="relative z-10 flex items-center gap-3">
                            {actionLoading ? <Loader2 className="animate-spin" /> : <>Add to Wallet <Plus size={18} strokeWidth={3} /></>}
                        </span>
                    </button>
                </form>
            </Modal>

            <Modal
                isOpen={showWithdraw}
                onClose={() => { setShowWithdraw(false); setWalletPassword(''); }}
                title="Withdraw Money"
            >
                <form onSubmit={handleWithdraw} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Amount (₹)</label>
                            <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase">Available: ₹{walletBalance}</span>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-300 dark:text-slate-700 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">₹</div>
                            <input
                                type="number"
                                value={topupAmount}
                                onChange={(e) => setTopupAmount(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-8 pl-16 rounded-[2.5rem] outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-black text-4xl text-slate-900 dark:text-white shadow-inner group-hover:border-slate-200 dark:group-hover:border-slate-700"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>

                        <div className="pt-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-1.5">
                                <Lock size={12} /> Confirm Account Password
                            </label>
                            <input
                                type="password"
                                value={walletPassword}
                                onChange={(e) => setWalletPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-4 rounded-2xl outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-sm text-slate-900 dark:text-white shadow-inner"
                                placeholder="Enter password to authorize"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full bg-slate-900 dark:bg-blue-600 group relative overflow-hidden text-white p-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all disabled:opacity-50 flex justify-center items-center gap-3 shadow-2xl shadow-blue-500/20 dark:shadow-none"
                    >
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                        <span className="relative z-10 flex items-center gap-3">
                            {actionLoading ? <Loader2 className="animate-spin" /> : <>Withdraw Balance <ArrowRight size={18} strokeWidth={3} /></>}
                        </span>
                    </button>
                </form>
            </Modal>

            <Modal
                isOpen={!!selectedVendor}
                onClose={() => { setSelectedVendor(null); setAction(null); setForm({ quantity: '', duration: '7_days', deliveryTime: '07:00 AM' }); }}
                title={action === 'buy' ? 'Buy Milk' : 'Subscribe'}
            >
                <div className="mb-10 p-8 bg-blue-50/50 dark:bg-blue-900/20 rounded-[2.5rem] border border-blue-100/50 dark:border-blue-900/30 flex items-center justify-between shadow-inner transition-colors duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-[1.2rem] flex items-center justify-center font-black text-blue-600 dark:text-blue-400 shadow-lg border border-white dark:border-slate-700 translate-x-1 group hover:scale-110 transition-transform">{selectedVendor?.name ? selectedVendor.name[0] : ''}</div>
                        <div>
                            <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-[0.3em] leading-tight mb-1">Vendor</p>
                            <h4 className="font-black text-slate-900 dark:text-white text-lg">{selectedVendor?.name}</h4>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-[0.3em] leading-tight mb-1">Rate</p>
                        <p className="font-black text-slate-900 dark:text-white text-lg">₹{selectedVendor?.rate}<span className="text-xs text-slate-400 dark:text-slate-600">/L</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmitAction} className="space-y-10">
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">Quantity (Liters)</label>
                        <div className="relative group">
                            <input
                                type="number"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-8 rounded-[2.5rem] outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-black text-4xl text-slate-900 dark:text-white shadow-inner"
                                placeholder="0.0"
                                autoFocus
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 dark:text-slate-700">L</div>
                        </div>
                    </div>

                    {action === 'subscribe' && (
                        <>
                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">Duration</label>
                                <div className="grid grid-cols-1 gap-4">
                                    <select
                                        value={form.duration}
                                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-6 rounded-[2rem] outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-black text-sm text-slate-700 dark:text-slate-300 appearance-none cursor-pointer shadow-inner"
                                    >
                                        <option value="7_days" className="dark:bg-slate-900">7 Days</option>
                                        <option value="1_month" className="dark:bg-slate-900">30 Days</option>
                                        <option value="3_months" className="dark:bg-slate-900">90 Days</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-4">Preferred Delivery Time</label>
                                <div className="grid grid-cols-1 gap-4">
                                    <select
                                        value={form.deliveryTime || '07:00 AM'}
                                        onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100/80 dark:border-slate-800 p-6 rounded-[2rem] outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition-all font-black text-sm text-slate-700 dark:text-slate-300 appearance-none cursor-pointer shadow-inner"
                                    >
                                        <option value="06:00 AM" className="dark:bg-slate-900">06:00 AM (Early Morning)</option>
                                        <option value="07:00 AM" className="dark:bg-slate-900">07:00 AM (Morning)</option>
                                        <option value="08:00 AM" className="dark:bg-slate-900">08:00 AM (Late Morning)</option>
                                        <option value="05:00 PM" className="dark:bg-slate-900">05:00 PM (Evening)</option>
                                        <option value="06:00 PM" className="dark:bg-slate-900">06:00 PM (Late Evening)</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}



                    <div className="pt-4">
                        <div className="bg-slate-900/5 dark:bg-slate-800/20 p-6 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700 mb-8 flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Total</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(form.quantity * (selectedVendor?.rate || 0)).toFixed(2)}</p>
                        </div>
                        <button
                            type="submit"
                            disabled={actionLoading || !form.quantity}
                            className="w-full group relative overflow-hidden bg-slate-900 dark:bg-blue-600 text-white p-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all disabled:opacity-50 flex justify-center items-center gap-3 shadow-2xl shadow-blue-500/20 dark:shadow-none"
                        >
                            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                            {actionLoading ? <Loader2 className="animate-spin" /> : <span className="relative z-10 flex items-center gap-3">Confirm Order <ArrowRight size={20} strokeWidth={3} /></span>}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* RECEIPT MODAL */}
            <Modal
                isOpen={!!selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
                title="Receipt"
            >
                {selectedReceipt && (
                    <div className="space-y-8 animate-fadeIn">
                        <div className="text-center space-y-2 border-b-2 border-dashed border-slate-100 dark:border-slate-800 pb-8">
                            <div className="w-16 h-16 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3 transition-transform hover:rotate-0 duration-500">
                                <Plus size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Milk Receipt</h3>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">Verified Transaction</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Transaction ID</p>
                                    <p className="text-xs font-black text-slate-900 dark:text-white tracking-widest font-mono">#{String(selectedReceipt.id).slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest leading-none mb-1">Date</p>
                                    <p className="text-xs font-black text-slate-900 dark:text-white">{selectedReceipt.date}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4 shadow-inner">
                                <div className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-[10px] font-black text-blue-600 dark:text-blue-400 border border-slate-100 dark:border-slate-600 shadow-sm transition-transform group-hover:scale-110">{selectedReceipt.Vendor?.name ? selectedReceipt.Vendor.name[0] : 'V'}</div>
                                        <p className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">{selectedReceipt.Vendor?.name}</p>
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500">Authorized Seller</p>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Item</p>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Qty & Rate</p>
                                    </div>
                                    <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                        <p className="text-xs font-black text-slate-900 dark:text-white">Milk ({selectedReceipt.type === 'subscription' ? 'Subscription' : 'One-time'})</p>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedReceipt.quantity}L @ ₹{(selectedReceipt.amount / selectedReceipt.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-4 bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100/50 dark:border-blue-900/20">
                                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Total Amount</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">₹{parseFloat(selectedReceipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        <div className="py-4 px-6 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Delivered & Verified</p>
                            </div>
                            <span className="text-[8px] font-black text-emerald-600/50 dark:text-emerald-400/50 uppercase tracking-[0.2em]">SECURE TRANSACTION</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => window.print()}
                                className="bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 p-5 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95"
                            >
                                <Printer size={16} /> Print
                            </button>
                            <button
                                onClick={handleExportReceipt}
                                className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 p-5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 dark:shadow-none flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <footer className="relative z-10 bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800 p-12 text-center transition-colors duration-500">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4 text-slate-300 dark:text-slate-800">
                        <div className="h-[1px] w-12 bg-slate-100 dark:bg-slate-900"></div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-200 dark:shadow-none animate-pulse"></div>
                        <div className="h-[1px] w-12 bg-slate-100 dark:bg-slate-900"></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.5em]">Milk Supply Management v4.0 • Secured</p>
                    <p className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest mt-1">© 2026 DairyHub. All Rights Reserved.</p>
                </div>
            </footer>

            <ProfileModal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                user={profileData}
                role="customer"
                onUpdate={(updatedData) => {
                    setProfileData(prev => ({ ...prev, ...updatedData }));
                    setAuth(token, { ...user, name: updatedData.name, phone: updatedData.phone });
                }}
            />

            <RainPreferencesModal
                isOpen={showRainModal}
                onClose={() => setShowRainModal(false)}
                customerPrefs={profileData}
                onSaveSuccess={(updatedPrefs) => {
                    setProfileData(prev => ({ ...prev, ...updatedPrefs }));
                }}
            />
        </div>
    );
};

export default CustomerDashboard;
