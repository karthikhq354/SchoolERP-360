import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'user';

  const roleLabel = {
    superadmin: 'Super Admin',
    admin: 'Administrator',
    teacher: 'Teacher',
    student: 'Student',
    staff: 'Staff',
  }[userRole] || 'User';

  const roleColor = {
    superadmin: 'from-red-500 to-pink-500',
    admin: 'from-primary to-secondary',
    teacher: 'from-purple-500 to-purple-600',
    student: 'from-blue-500 to-blue-600',
    staff: 'from-green-500 to-green-600',
  }[userRole] || 'from-primary to-secondary';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end gap-3">

        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
          <div className={`w-10 h-10 bg-gradient-to-br ${roleColor} rounded-full flex items-center justify-center cursor-pointer`}>
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </header>
  );
};

export default Header;