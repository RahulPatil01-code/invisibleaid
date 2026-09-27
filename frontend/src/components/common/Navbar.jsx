import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        {title && <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">{title}</h1>}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="h-8 w-px bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-700 leading-none mb-1">{[user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'User'}</p>
            <p className="text-xs text-teal-600 leading-none">{user?.role || 'Role'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            {(user?.first_name || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full lg:hidden"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}