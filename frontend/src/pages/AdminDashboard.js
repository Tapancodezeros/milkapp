import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminOverview from '../components/admin/AdminOverview';
import AdminUsers from '../components/admin/AdminUsers';
import AdminTransactions from '../components/admin/AdminTransactions';
import AdminSubscriptions from '../components/admin/AdminSubscriptions';
import { DeleteModal, EditUserModal, AddUserModal } from '../components/admin/AdminModals';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [overviewStats, setOverviewStats] = useState(null);
    const [overviewFilter, setOverviewFilter] = useState('all');
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { isDarkMode, toggleTheme } = useTheme();
    const [editModal, setEditModal] = useState({ isOpen: false, data: null, initialData: null, role: '' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Pagination & Confirmation Modal State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, role: '', id: '' });

    const navigate = useNavigate();

    const fetchItems = async (tab) => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const url = tab === 'overview' ? 'overview' : tab;
            const params = {};
            if (tab === 'overview') params.period = overviewFilter;
            if (tab === 'transactions') params.status = transactionFilter;
            if (searchQuery) params.search = searchQuery;

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
        setCurrentPage(1);
        fetchItems(activeTab);
    }, [activeTab, overviewFilter, transactionFilter, searchQuery]);

    const handleUpdateUser = async (updatedData) => {
        try {
            const token = sessionStorage.getItem('token');
            const { role, data } = editModal;
            await axios.put(`${API_BASE_URL}/admin/user/${role}/${data.id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User updated successfully");
            setEditModal({ isOpen: false, data: null, initialData: null, role: '' });
            fetchItems(activeTab);
        } catch (err) {
            toast.error("Failed to update user: " + (err.response?.data?.error || err.message));
        }
    };

    const handleResetPassword = async (id) => {
        // Determine role based on activeTab or helper
        const role = activeTab === 'vendors' ? 'vendor' : 'customer';
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

    const handleDeleteUser = (id) => {
        const role = activeTab === 'vendors' ? 'vendor' : 'customer';
        setDeleteModal({ isOpen: true, role, id });
    };

    const executeDelete = async () => {
        const { role, id } = deleteModal;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/admin/user/${role}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User deleted successfully");
            fetchItems(activeTab);
            setDeleteModal({ isOpen: false, role: '', id: '' });
        } catch (err) {
            toast.error("Failed to delete user: " + (err.response?.data?.error || err.message));
        }
    };

    const handleAddUser = async (userData) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/admin/user/create`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("User created successfully");
            setIsAddModalOpen(false);

            if (activeTab === userData.role + 's') { // 'customer' -> 'customers', 'vendor' -> 'vendors'
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

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = React.useMemo(() => {
        if (!data) return [];
        let sortableItems = [...data];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nested keys like Customer.name
                if (sortConfig.key.includes('.')) {
                    const keys = sortConfig.key.split('.');
                    aValue = a[keys[0]]?.[keys[1]];
                    bValue = b[keys[0]]?.[keys[1]];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const reportData = React.useMemo(() => {
        if (!overviewStats?.monthlyReports) return [];
        return Object.entries(overviewStats.monthlyReports)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, d]) => {
                let label = 'Unknown';
                try {
                    // Try to format like "Jan"
                    const date = new Date(month + "-01");
                    if (!isNaN(date.getTime())) {
                        label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    } else {
                        label = month;
                    }
                } catch (e) { label = month }
                return {
                    name: label,
                    revenue: Number(d.revenue) || 0,
                    volume: Number(d.volume) || 0
                };
            });
    }, [overviewStats]);

    const handleExport = () => {
        if (!filteredData || filteredData.length === 0) return toast.error("No data to export");

        // Determine columns based on active tab
        let headers = [];
        let rowMapper = (item) => [];

        if (activeTab === 'customers' || activeTab === 'vendors') {
            headers = ['ID', 'Name', 'Email', 'Phone', 'Role'];
            if (activeTab === 'customers') headers.push('Wallet');
            if (activeTab === 'vendors') headers.push('Rate', 'Stock (L)', 'Status');
            rowMapper = (item) => [
                item.id,
                item.name,
                item.email,
                item.phone,
                activeTab.slice(0, -1), // customer/vendor
                ...(activeTab === 'customers' ? [item.walletBalance || 0] : []),
                ...(activeTab === 'vendors' ? [item.rate, item.availableMilk || 0, item.isAvailable ? 'Active' : 'Holiday'] : [])
            ];
        } else if (activeTab === 'transactions') {
            headers = ['ID', 'Date', 'Customer', 'Vendor', 'Amount', 'Status'];
            rowMapper = (item) => [
                item.id,
                new Date(item.date || item.createdAt).toLocaleDateString(),
                item.Customer?.name,
                item.Vendor?.name,
                item.amount,
                item.status
            ];
        } else if (activeTab === 'subscriptions') {
            headers = ['ID', 'Customer', 'Vendor', 'Quantity', 'Status'];
            rowMapper = (item) => [
                item.id,
                item.Customer?.name,
                item.Vendor?.name,
                item.quantity,
                item.status
            ];
        } else {
            return toast.error("Export not supported for this view");
        }

        const csvContent = [
            headers.join(','),
            ...filteredData.map(item => rowMapper(item).map(val => `"${val || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `admin_${activeTab}_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0F172A] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                isDarkMode={isDarkMode}
                handleLogout={handleLogout}
            />

            <main className="flex-grow flex flex-col min-w-0">
                <AdminHeader
                    activeTab={activeTab}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    onExport={handleExport}
                    onAddUser={() => setIsAddModalOpen(true)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <div className="p-8 overflow-auto">
                    <div className="mb-8">
                        <h2 className={`text-2xl font-black capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'overview' ? 'Dashboard Overview' : activeTab}</h2>
                        <p className="text-slate-500 text-sm mt-1">{activeTab === 'overview' ? 'View key metrics and system performance' : `Manage and monitor all system ${activeTab}`}</p>
                    </div>

                    {loading && !overviewStats && data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 gap-4">
                            <Loader2 className="animate-spin text-blue-500" size={48} />
                            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Loading data...</p>
                        </div>
                    ) : (
                        <div className={`transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            {activeTab === 'overview' && overviewStats && (
                                <AdminOverview
                                    overviewStats={overviewStats}
                                    overviewFilter={overviewFilter}
                                    setOverviewFilter={setOverviewFilter}
                                    reportData={reportData}
                                    isDarkMode={isDarkMode}
                                />
                            )}

                            {(activeTab === 'customers' || activeTab === 'vendors') && (
                                <AdminUsers
                                    data={paginatedData}
                                    role={activeTab}
                                    sortConfig={sortConfig}
                                    requestSort={requestSort}
                                    isDarkMode={isDarkMode}
                                    onEdit={(item) => setEditModal({ isOpen: true, role: activeTab === 'vendors' ? 'vendor' : 'customer', data: { ...item }, initialData: { ...item } })}
                                    onDelete={(id) => handleDeleteUser(id)}
                                    onResetPassword={(id) => handleResetPassword(id)}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    setCurrentPage={setCurrentPage}
                                />
                            )}

                            {activeTab === 'transactions' && (
                                <AdminTransactions
                                    transactions={paginatedData}
                                    filter={transactionFilter}
                                    setFilter={setTransactionFilter}
                                    sortConfig={sortConfig}
                                    requestSort={requestSort}
                                    isDarkMode={isDarkMode}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    setCurrentPage={setCurrentPage}
                                />
                            )}

                            {activeTab === 'subscriptions' && (
                                <AdminSubscriptions
                                    subscriptions={paginatedData}
                                    sortConfig={sortConfig}
                                    requestSort={requestSort}
                                    isDarkMode={isDarkMode}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    setCurrentPage={setCurrentPage}
                                />
                            )}

                            {activeTab !== 'overview' && filteredData.length === 0 && !loading && (
                                <div className={`flex flex-col items-center justify-center h-96 rounded-[2.5rem] border border-dashed p-12 text-center ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                                    <div className={`p-6 rounded-[2rem] mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <Search size={48} className="text-slate-400" />
                                    </div>
                                    <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No results found</h3>
                                    <p className="text-slate-500 max-w-sm mt-2 font-medium">We couldn't find any {activeTab} matching your current search or filters.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, role: '', id: '' })}
                onConfirm={executeDelete}
                isDarkMode={isDarkMode}
            />

            <EditUserModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, data: null, initialData: null, role: '' })}
                data={editModal.data}
                role={editModal.role}
                isDarkMode={isDarkMode}
                onSave={handleUpdateUser}
            />

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                isDarkMode={isDarkMode}
                onAdd={handleAddUser}
            />
        </div>
    );
};

export default AdminDashboard;
