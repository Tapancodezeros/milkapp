import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Briefcase,
    CreditCard,
    Calendar,
    Search,
    Menu,
    X,
    LayoutDashboard,
    UserPlus,
    Loader2,
    Moon,
    Sun,
    Download,
    AlertTriangle,
    DollarSign
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import RainyWeatherBanner from '../components/shared/RainyWeatherBanner';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import AdminDataTable from '../components/admin/AdminDataTable';
import { AdminEditUserModal, AdminAddUserModal } from '../components/admin/AdminUserModal';
import { getAuthToken, clearAuth } from '../utils/auth';
import { API_BASE_URL } from '../api/config';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [overviewStats, setOverviewStats] = useState(null);
    const [overviewFilter, setOverviewFilter] = useState('all');
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const [editModal, setEditModal] = useState({ isOpen: false, data: null, initialData: null, role: '' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({ name: '', email: '', phone: '', password: '', role: 'customer', rate: '50' });
    const [weatherAdvisory, setWeatherAdvisory] = useState(null);
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const token = getAuthToken();

    const fetchWeatherAdvisory = React.useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/weather/advisory`);
            setWeatherAdvisory(res.data.data);
        } catch (err) {
            console.error("Weather Advisory Fetch Error:", err);
        }
    }, []);

    const fetchOverviewStats = React.useCallback(async (filterPeriod = 'all') => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/admin/overview?filter=${filterPeriod}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOverviewStats(response.data.data);
            fetchWeatherAdvisory();
        } catch (error) {
            console.error('Error fetching admin overview:', error);
            if (error.response && error.response.status === 401) {
                toast.error('Unauthorized access. Please login as Admin.');
                clearAuth();
                navigate('/login');
            } else {
                toast.error('Failed to load overview analytics.');
            }
        } finally {
            setLoading(false);
        }
    }, [token, navigate, fetchWeatherAdvisory]);

    const fetchData = React.useCallback(async () => {
        if (activeTab === 'overview') {
            fetchOverviewStats(overviewFilter);
            return;
        }

        try {
            setLoading(true);
            let endpoint = '';
            switch (activeTab) {
                case 'customers':
                    endpoint = '/admin/customers';
                    break;
                case 'vendors':
                    endpoint = '/admin/vendors';
                    break;
                case 'transactions':
                    endpoint = '/admin/transactions';
                    break;
                case 'subscriptions':
                    endpoint = '/admin/subscriptions';
                    break;
                case 'ledger':
                    endpoint = '/admin/transactions';
                    break;
                default:
                    endpoint = '/admin/customers';
            }

            const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setData(response.data.data);
            setCurrentPage(1);
        } catch (error) {
            console.error(`Error fetching ${activeTab}:`, error);
            if (error.response && error.response.status === 401) {
                toast.error('Unauthorized access. Please login as Admin.');
                clearAuth();
                navigate('/login');
            } else {
                toast.error(`Failed to load ${activeTab} data.`);
            }
        } finally {
            setLoading(false);
        }
    }, [activeTab, overviewFilter, token, navigate, fetchOverviewStats]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = () => {
        clearAuth();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDeleteUser = (role, id) => {
        toast((t) => (
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-slate-800 flex flex-col gap-5 min-w-[320px]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-50 text-red-500 dark:bg-opacity-10 shadow-inner">
                        <AlertTriangle size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[13px] font-black text-slate-900 dark:text-white leading-snug">Delete {role} #{id}?</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">This action cannot be undone.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const endpoint = role === 'vendor' ? `/admin/vendor/${id}` : `/admin/customer/${id}`;
                                await axios.delete(`${API_BASE_URL}${endpoint}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                toast.success(`${role} deleted successfully`);
                                fetchData();
                            } catch (error) {
                                console.error(`Error deleting ${role}:`, error);
                                toast.error(`Failed to delete ${role}`);
                            }
                        }}
                        className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl"
                    >
                        Confirm Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200/50 dark:border-slate-700/50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    const handleResetPassword = async (role, id) => {
        try {
            const endpoint = role === 'vendor' ? `/auth/reset-password-request` : `/auth/reset-password-request`;
            const response = await axios.post(`${API_BASE_URL}${endpoint}`, { role, userId: id });
            toast.success(
                (t) => (
                    <div className="flex flex-col gap-1">
                        <span className="font-bold">Reset Password Link:</span>
                        <a href={response.data.resetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-xs break-all">
                            {response.data.resetUrl}
                        </a>
                    </div>
                ),
                { duration: 8000 }
            );
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("Failed to generate reset password link.");
        }
    };

    const handleUpdateDelivery = async (id, status) => {
        try {
            await axios.put(`${API_BASE_URL}/transactions/${id}/verify`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Delivery status updated to ${status}`);
            fetchData();
        } catch (error) {
            console.error("Error updating delivery status:", error);
            toast.error("Failed to update delivery status");
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const { role, data: userData } = editModal;
            const endpoint = role === 'vendor' ? `/admin/vendor/${userData.id}` : `/admin/customer/${userData.id}`;

            await axios.put(`${API_BASE_URL}${endpoint}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`${role} details updated successfully`);
            setEditModal({ isOpen: false, data: null, initialData: null, role: '' });
            fetchData();
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user details");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const endpoint = newUserData.role === 'vendor' ? '/admin/vendors' : '/admin/customers';
            await axios.post(`${API_BASE_URL}${endpoint}`, newUserData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`New ${newUserData.role} added successfully!`);
            setIsAddModalOpen(false);
            setNewUserData({ name: '', email: '', phone: '', password: '', role: 'customer', rate: '50' });
            fetchData();
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error(error.response?.data?.message || `Failed to create ${newUserData.role}`);
        }
    };

    const handleExport = () => {
        if (!data || data.length === 0) {
            toast.error("No data available to export");
            return;
        }

        let headers = [];
        let rowMapper = (item) => [];

        if (activeTab === 'customers' || activeTab === 'vendors') {
            headers = ['ID', 'Name', 'Email', 'Phone', ...(activeTab === 'vendors' ? ['Rate(INR)'] : [])];
            rowMapper = (item) => [
                item.id,
                item.name,
                item.email,
                item.phone,
                ...(activeTab === 'vendors' ? [item.rate] : [])
            ];
        } else if (activeTab === 'transactions') {
            headers = ['ID', 'Date', 'Customer Name', 'Vendor Name', 'Amount(INR)', 'Status'];
            rowMapper = (item) => [
                item.id,
                item.date || item.createdAt,
                item.Customer?.name || 'N/A',
                item.Vendor?.name || 'N/A',
                item.amount,
                item.status
            ];
        } else if (activeTab === 'subscriptions') {
            headers = ['ID', 'Customer Name', 'Vendor Name', 'Quantity(L)', 'Status'];
            rowMapper = (item) => [
                item.id,
                item.Customer?.name || 'N/A',
                item.Vendor?.name || 'N/A',
                item.quantity,
                item.status
            ];
        }

        const csvContent = [
            headers.join(','),
            ...data.map(item => rowMapper(item).map(val => `"${val || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredData = React.useMemo(() => {
        let result = [...data];

        if (activeTab === 'transactions' && transactionFilter !== 'all') {
            result = result.filter(item => item.status === transactionFilter);
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter((item) => {
                if (activeTab === 'customers' || activeTab === 'vendors') {
                    return (
                        item.name?.toLowerCase().includes(query) ||
                        item.email?.toLowerCase().includes(query) ||
                        item.phone?.toLowerCase().includes(query)
                    );
                } else if (activeTab === 'transactions') {
                    return (
                        item.Customer?.name?.toLowerCase().includes(query) ||
                        item.Vendor?.name?.toLowerCase().includes(query) ||
                        item.status?.toLowerCase().includes(query)
                    );
                } else if (activeTab === 'subscriptions') {
                    return (
                        item.Customer?.name?.toLowerCase().includes(query) ||
                        item.Vendor?.name?.toLowerCase().includes(query) ||
                        item.status?.toLowerCase().includes(query)
                    );
                }
                return false;
            });
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

                let aVal = getNestedValue(a, sortConfig.key);
                let bVal = getNestedValue(b, sortConfig.key);

                if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                if (typeof bVal === 'string') bVal = bVal.toLowerCase();

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchQuery, sortConfig, activeTab, transactionFilter]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const MenuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'vendors', label: 'Vendors', icon: Briefcase },
        { id: 'transactions', label: 'Transactions', icon: CreditCard },
        { id: 'subscriptions', label: 'Subscriptions', icon: Calendar },
        { id: 'ledger', label: 'Ledger Audit', icon: DollarSign },
    ];

    return (
        <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <AdminSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                MenuItems={MenuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isDarkMode={isDarkMode}
                handleLogout={handleLogout}
            />

            {/* Main Content */}
            <main className="flex-grow flex flex-col min-w-0">
                {/* Header */}
                <header className={`h-16 sm:h-20 backdrop-blur-md border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 transition-all ${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-white/80 border-slate-200'}`}>
                    <div className="flex items-center gap-3 sm:gap-4 flex-grow max-w-2xl">
                        <button
                            className={`lg:hidden p-2 transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="relative w-full">
                            <Search className={`absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={16} />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                className={`w-full border rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all ${isDarkMode ? 'bg-slate-800/50 border-white/5 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 ml-3 sm:ml-4">
                        {activeTab !== 'overview' && (
                            <button
                                onClick={handleExport}
                                className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                                title="Export Data"
                            >
                                <Download size={18} />
                            </button>
                        )}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <UserPlus size={15} />
                            <span className="hidden sm:inline">Add User</span>
                        </button>
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                    <RainyWeatherBanner
                        advisory={weatherAdvisory}
                        userRole="admin"
                        onUpdateAdvisory={(newAdvisory) => setWeatherAdvisory(newAdvisory)}
                    />

                    <div>
                        <h2 className={`text-xl sm:text-2xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'overview' ? 'Dashboard Overview' : activeTab}</h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">{activeTab === 'overview' ? 'View key metrics and system performance' : `Manage and monitor all system ${activeTab}`}</p>
                    </div>

                    {loading && !overviewStats && data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-80 sm:h-96 gap-4">
                            <Loader2 className="animate-spin text-blue-500" size={40} />
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Loading data...</p>
                        </div>
                    ) : (
                        <div className={`transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            {activeTab === 'overview' ? (
                                <AdminOverviewTab
                                    overviewStats={overviewStats}
                                    overviewFilter={overviewFilter}
                                    setOverviewFilter={setOverviewFilter}
                                    isDarkMode={isDarkMode}
                                />
                            ) : (
                                <AdminDataTable
                                    activeTab={activeTab}
                                    filteredData={filteredData}
                                    paginatedData={paginatedData}
                                    loading={loading}
                                    isDarkMode={isDarkMode}
                                    transactionFilter={transactionFilter}
                                    setTransactionFilter={setTransactionFilter}
                                    sortConfig={sortConfig}
                                    requestSort={requestSort}
                                    setEditModal={setEditModal}
                                    handleResetPassword={handleResetPassword}
                                    handleDeleteUser={handleDeleteUser}
                                    onUpdateDelivery={handleUpdateDelivery}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalPages={totalPages}
                                    itemsPerPage={itemsPerPage}
                                />
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* EDIT USER MODAL */}
            <AdminEditUserModal
                editModal={editModal}
                setEditModal={setEditModal}
                handleSaveEdit={handleSaveEdit}
                isDarkMode={isDarkMode}
            />

            {/* ADD USER MODAL */}
            <AdminAddUserModal
                isAddModalOpen={isAddModalOpen}
                setIsAddModalOpen={setIsAddModalOpen}
                newUserData={newUserData}
                setNewUserData={setNewUserData}
                handleAddUser={handleAddUser}
                isDarkMode={isDarkMode}
            />
        </div>
    );
};

export default AdminDashboard;
