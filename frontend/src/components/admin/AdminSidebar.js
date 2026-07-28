import React from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, MenuItems, activeTab, setActiveTab, isDarkMode, handleLogout }) => {
    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Drawer */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 border-r transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'}`}
            >
                <div className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8 sm:mb-10 px-2">
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
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                    }}
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
        </>
    );
};

export default AdminSidebar;
