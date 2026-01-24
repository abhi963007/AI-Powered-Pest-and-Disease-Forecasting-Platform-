import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Microscope, Bell, History, CloudSun, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/forecast', label: 'Forecast', icon: <CloudSun size={20} /> },
        { path: '/detect', label: 'Detect', icon: <Microscope size={20} /> },
        { path: '/alerts', label: 'Alerts', icon: <Bell size={20} /> },
        { path: '/history', label: 'History', icon: <History size={20} /> }
    ];

    return (
        <aside className="w-72 bg-[#1a237e] text-white flex flex-col p-8 space-y-8 hidden md:flex shrink-0 h-screen sticky top-0">
            <h1 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
                <div className="bg-white/10 p-2 rounded-xl border border-white/10 text-blue-400">
                    <Microscope size={28} />
                </div>
                AGRO SCAN
            </h1>

            <nav className="flex-1 space-y-3">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition duration-300 ${location.pathname === item.path
                                ? 'bg-white/10 border-l-4 border-blue-400'
                                : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                            }`}
                    >
                        {item.icon} {item.label}
                    </Link>
                ))}
            </nav>

            <button
                onClick={logout}
                className="flex items-center gap-4 p-4 text-red-300 hover:text-red-400 hover:bg-red-400/10 rounded-2xl font-bold transition duration-300"
            >
                <LogOut size={20} /> Logout
            </button>
        </aside>
    );
};

export default Sidebar;
