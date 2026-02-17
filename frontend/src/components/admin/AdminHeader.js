import React from 'react';
import { Menu, X, Search, Download, UserPlus, Moon, Sun } from 'lucide-react';

const AdminHeader = ({
    activeTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isDarkMode,
    toggleTheme,
    onExport,
    onAddUser,
    searchQuery,
    setSearchQuery
}) => {
    return (
        <header className={`px-8 py-6 mb-8 flex flex-col md:flex-row gap-6 md:items-center justify-between border-b sticky top-0 z-40 backdrop-blur-3xl ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`lg:hidden p-2 rounded-xl ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'}`}
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
                {activeTab !== 'overview' && (
                    <button
                        onClick={onExport}
                        className={`p-2.5 rounded-2xl transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                        title="Export Data"
                    >
                        <Download size={20} />
                    </button>
                )}
                <button
                    onClick={onAddUser}
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">Add User</span>
                </button>
                <button
                    onClick={toggleTheme}
                    className={`p-3 rounded-2xl transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}                      >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
