import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Milk, Loader2, TrendingUp, Users, Zap, Palmtree, Power } from 'lucide-react';

import Header from '../components/shared/Header';
import StatsCard from '../components/shared/StatsCard';
import QuickControls from '../components/vendor/QuickControls';
import FulfillmentEngine from '../components/vendor/FulfillmentEngine';
import AnalyticsChart from '../components/vendor/AnalyticsChart';
import LedgerStream from '../components/shared/LedgerStream';
import ProfileModal from '../components/shared/ProfileModal';

import { API_BASE_URL } from '../api/config';

const VendorDashboard = () => {
    const [sales, setSales] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [stats, setStats] = useState({ availableMilk: 0, rate: 0, todayProcessed: false, isAvailable: true });
    const [monthlyReports, setMonthlyReports] = useState({});
    const [newRate, setNewRate] = useState('');
    const [addStock, setAddStock] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedSales, setPaginatedSales] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));

    const fetchGlobalData = React.useCallback(async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const meRes = await axios.get(`${API_BASE_URL}/vendor/me`, config);
            setStats(meRes.data.data);
            setNewRate(meRes.data.data.rate);

            const [salesRes, subRes, reportsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/transactions`, config),
                axios.get(`${API_BASE_URL}/subscriptions`, config),
                axios.get(`${API_BASE_URL}/vendor/reports`, config),
            ]);

            setSales(salesRes.data.data);
            setSubscriptions(subRes.data.data);
            setMonthlyReports(reportsRes.data.data);
        } catch (err) {
            console.error("Global Fetch Error:", err);
            toast.error("Failed to load core data.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchPaginatedData = React.useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const paginatedRes = await axios.get(`${API_BASE_URL}/transactions?paginate=true&page=${currentPage}&limit=10`, config);
            setPaginatedSales(paginatedRes.data.data.data);
            setTotalPages(paginatedRes.data.data.totalPages);
        } catch (err) {
            console.error("Paginated Fetch Error:", err);
        }
    }, [token, currentPage]);

    useEffect(() => {
        if (!token || user?.role !== 'vendor') {
            navigate('/');
            return;
        }
        fetchGlobalData();
    }, [refreshKey, fetchGlobalData, navigate, token, user?.role]);

    useEffect(() => {
        if (token) fetchPaginatedData();
    }, [currentPage, refreshKey, fetchPaginatedData, token]);

    const handleUpdate = async (type) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (type === 'process_subs') {
                const res = await axios.post(`${API_BASE_URL}/vendor/process-subscriptions`, {}, config);
                toast.success(res.data.message);
            } else {
                if (type === 'rate') {
                    const r = parseFloat(newRate);
                    if (!r || r < 20 || r > 200) return toast.error("Rate must be between ₹20 and ₹200");
                }
                if (type === 'stock' || type === 'remove_stock') {
                    const s = parseFloat(addStock);
                    if (!s || s <= 0) return toast.error("Please enter a valid amount");
                    if (type === 'stock' && stats.availableMilk + s > 1000) {
                        return toast.error(`Cannot exceed total stock of 1000L. Current: ${stats.availableMilk}L`);
                    }
                    if (type === 'remove_stock' && stats.availableMilk < s) {
                        return toast.error(`Cannot remove more than current stock. Current: ${stats.availableMilk}L`);
                    }
                }

                const payload = type === 'rate' ? { rate: newRate } : (type === 'remove_stock' ? { removeMilk: addStock } : { addMilk: addStock });
                await axios.put(`${API_BASE_URL}/vendor/update`, payload, config);
                toast.success(type === 'rate' ? "Rate Updated!" : (type === 'remove_stock' ? "Stock Removed!" : "Stock Added!"));
                if (type === 'stock') setAddStock('');
            }
            setRefreshKey(old => old + 1);
        } catch (err) {
            toast.error("Action Failed: " + (err.response?.data?.error || err.message));
        }
    };

    const handleUpdateDelivery = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${API_BASE_URL}/transactions/${id}/delivery`, { status }, config);
            toast.success(status === 'delivered' ? "Marked as Delivered" : "Marked as Failed");
            setRefreshKey(old => old + 1);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const toggleAvailability = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put(`${API_BASE_URL}/vendor/toggle-availability`, {}, config);
            toast.success(res.data.message);
            setRefreshKey(old => old + 1);
        } catch (err) {
            toast.error("Failed to toggle availability");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const totalRev = sales.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

    const reportData = Object.entries(monthlyReports)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, data]) => {
            let label = 'Unknown';
            try {
                label = new Date(month + "-01").toLocaleDateString('en-US', { month: 'short' });
            } catch (e) { }
            return {
                name: label,
                revenue: data.revenue || 0,
                volume: data.volume || 0
            };
        });

    if (loading && sales.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin w-12 h-12" />
                    <p className="font-bold animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-500">
            <Header
                user={user}
                role="vendor"
                onLogout={handleLogout}
                onSettings={() => setShowProfile(true)}
                extra={(
                    <div className="hidden md:flex flex-col items-end border-r border-slate-200 dark:border-slate-800 pr-6 mr-6">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Shop Status</span>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${stats.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} `}></div>
                            <span className={`text-xs font-bold ${stats.isAvailable ? 'text-slate-700 dark:text-slate-300' : 'text-red-500'} `}>
                                {stats.isAvailable ? 'Active' : 'Holiday Mode'}
                            </span>
                        </div>
                    </div>
                )}
            />

            <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative group cursor-pointer" onClick={toggleAvailability}>
                        <StatsCard label="Operating Mode" val={stats.isAvailable ? 'Active' : 'Holiday'} icon={stats.isAvailable ? Zap : Palmtree} color={stats.isAvailable ? 'emerald' : 'orange'} sub="Click to toggle" />
                        <div className="absolute top-4 right-4 bg-white/20 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Power size={14} className="text-white" />
                        </div>
                    </div>
                    <StatsCard label="Stock" val={`${stats.availableMilk} L`} icon={Milk} color="blue" sub="Current amount" />
                    <StatsCard label="Customers" val={subscriptions.length} icon={Users} color="indigo" sub="Active subscribers" />
                    <StatsCard label="Revenue" val={`₹${totalRev.toFixed(0)}`} icon={TrendingUp} color="emerald" sub="Total earned" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-4 space-y-10">
                        <QuickControls
                            addStock={addStock} setAddStock={setAddStock}
                            newRate={newRate} setNewRate={setNewRate}
                            onUpdate={handleUpdate}
                        />
                        <FulfillmentEngine
                            sales={sales} subscriptions={subscriptions}
                            onProcess={() => handleUpdate('process_subs')}
                        />
                    </div>

                    <div className="lg:col-span-8 space-y-10">
                        <AnalyticsChart
                            reportData={reportData}
                            title="Sales Overview"
                            subTitle="View your performance"
                        />
                        <LedgerStream
                            sales={paginatedSales}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                            onUpdateDelivery={handleUpdateDelivery}
                        />
                    </div>
                </div>
            </main>

            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-8 text-center transition-colors">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">Dairy Hub • Dashboard</p>
            </footer>

            <ProfileModal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                user={stats}
                role="vendor"
                onUpdate={(updatedData) => {
                    setStats(prev => ({ ...prev, ...updatedData }));
                    sessionStorage.setItem('user', JSON.stringify({ ...user, name: updatedData.name, phone: updatedData.phone }));
                }}
            />
        </div>
    );
};

export default VendorDashboard;
