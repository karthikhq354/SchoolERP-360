import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, Users, UserCircle,
  Settings, LogOut, ChevronRight, BookOpen, ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'student';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/admin/login');
  };

  const adminMenu = [
    { name: 'Dashboard',       icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Management', icon: Users,            path: '/admin/users' },
    { name: 'Students',        icon: GraduationCap,    path: '/admin/students' },
    { name: 'Teachers',        icon: UserCircle,       path: '/admin/teachers' },
    { name: 'Staff',           icon: Users,            path: '/admin/staff' },
    { name: 'Settings',        icon: Settings,         path: '/admin/settings' },
  ];

  const teacherMenu = [
    { name: 'Dashboard',    icon: LayoutDashboard,  path: '/admin/dashboard' },
    { name: 'My Students',  icon: GraduationCap,    path: '/admin/students' },
    { name: 'Attendance',   icon: ClipboardList,    path: '/admin/attendance' },
    { name: 'Settings',     icon: Settings,         path: '/admin/settings' },
  ];

  const studentMenu = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'My Profile', icon: UserCircle,     path: '/admin/settings' },
  ];

  const menuMap = {
    superadmin: adminMenu,
    admin:      adminMenu,
    teacher:    teacherMenu,
    student:    studentMenu,
    staff:      adminMenu,
  };

  const menuItems = menuMap[role] || adminMenu;

  const panelLabel = {
    superadmin: 'Super Admin',
    admin:      'Admin Panel',
    teacher:    'Teacher Panel',
    student:    'Student Panel',
    staff:      'Staff Panel',
  }[role] || 'Panel';

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">

      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold">School 360°</h1>
            <p className="text-xs text-gray-400">{panelLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1 font-medium text-sm">{item.name}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-gray-400 truncate">{localStorage.getItem('userEmail') || ''}</p>
          <p className="text-xs font-semibold text-gray-300 capitalize mt-0.5">{role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;