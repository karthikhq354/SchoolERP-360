// src/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './components/StatsCard';
import { Users, GraduationCap, UserCircle, TrendingUp, FileText, Settings as SettingsIcon } from 'lucide-react';
import { getUsers, getUserStats } from './data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    {
      title: 'Total Students',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Teachers',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: UserCircle,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Total Staff',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Active Users',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
  ]);

  // Calculate real counts from localStorage
  useEffect(() => {
    const calculateStats = () => {
      // Get actual counts from localStorage
      const allUsers = getUsers(); // This gets data from localStorage
      const students = allUsers.filter(user => user.role === 'student');
      const teachers = allUsers.filter(user => user.role === 'teacher');
      const staff = allUsers.filter(user => user.role === 'staff');
      const activeUsers = allUsers.filter(user => user.status === 'active');

      // Calculate percentage changes (simulated - comparing to previous month)
      const prevMonthStudents = Math.floor(students.length * 0.89);
      const prevMonthTeachers = Math.floor(teachers.length * 0.95);
      const prevMonthStaff = Math.floor(staff.length * 0.98);
      const prevMonthActive = Math.floor(activeUsers.length * 0.85);

      const calculateChange = (current, previous) => {
        if (previous === 0) return '+0%';
        const change = ((current - previous) / previous) * 100;
        return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
      };

      setStats([
        {
          title: 'Total Students',
          value: students.length.toString(),
          change: calculateChange(students.length, prevMonthStudents),
          trend: students.length >= prevMonthStudents ? 'up' : 'down',
          icon: GraduationCap,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Total Teachers',
          value: teachers.length.toString(),
          change: calculateChange(teachers.length, prevMonthTeachers),
          trend: teachers.length >= prevMonthTeachers ? 'up' : 'down',
          icon: UserCircle,
          color: 'from-purple-500 to-purple-600'
        },
        {
          title: 'Total Staff',
          value: staff.length.toString(),
          change: calculateChange(staff.length, prevMonthStaff),
          trend: staff.length >= prevMonthStaff ? 'up' : 'down',
          icon: Users,
          color: 'from-pink-500 to-pink-600'
        },
        {
          title: 'Active Users',
          value: activeUsers.length.toString(),
          change: calculateChange(activeUsers.length, prevMonthActive),
          trend: activeUsers.length >= prevMonthActive ? 'up' : 'down',
          icon: TrendingUp,
          color: 'from-green-500 to-green-600'
        },
      ]);
    };

    calculateStats();

    // Listen for storage changes (when data is updated from other tabs or pages)
    const handleStorageChange = () => {
      calculateStats();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh when window gains focus (after navigating back)
    window.addEventListener('focus', calculateStats);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', calculateStats);
    };
  }, []);

  // Refresh data when component mounts or becomes visible
  useEffect(() => {
    const interval = setInterval(() => {
      const allUsers = getUsers();
      const students = allUsers.filter(user => user.role === 'student');
      const teachers = allUsers.filter(user => user.role === 'teacher');
      const staff = allUsers.filter(user => user.role === 'staff');
      const activeUsers = allUsers.filter(user => user.status === 'active');

      const calculateChange = (current, previous) => {
        if (previous === 0) return '+0%';
        const change = ((current - previous) / previous) * 100;
        return change >= 0 ? `+${Math.round(change)}%` : `${Math.round(change)}%`;
      };

      const prevMonthStudents = Math.floor(students.length * 0.89);
      const prevMonthTeachers = Math.floor(teachers.length * 0.95);
      const prevMonthStaff = Math.floor(staff.length * 0.98);
      const prevMonthActive = Math.floor(activeUsers.length * 0.85);

      setStats([
        {
          title: 'Total Students',
          value: students.length.toString(),
          change: calculateChange(students.length, prevMonthStudents),
          trend: students.length >= prevMonthStudents ? 'up' : 'down',
          icon: GraduationCap,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Total Teachers',
          value: teachers.length.toString(),
          change: calculateChange(teachers.length, prevMonthTeachers),
          trend: teachers.length >= prevMonthTeachers ? 'up' : 'down',
          icon: UserCircle,
          color: 'from-purple-500 to-purple-600'
        },
        {
          title: 'Total Staff',
          value: staff.length.toString(),
          change: calculateChange(staff.length, prevMonthStaff),
          trend: staff.length >= prevMonthStaff ? 'up' : 'down',
          icon: Users,
          color: 'from-pink-500 to-pink-600'
        },
        {
          title: 'Active Users',
          value: activeUsers.length.toString(),
          change: calculateChange(activeUsers.length, prevMonthActive),
          trend: activeUsers.length >= prevMonthActive ? 'up' : 'down',
          icon: TrendingUp,
          color: 'from-green-500 to-green-600'
        },
      ]);
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Button handlers
  const handleAddStudent = () => {
    navigate('/admin/students');
    setTimeout(() => {
      const addButton = document.querySelector('[data-add-user]');
      if (addButton) addButton.click();
    }, 100);
  };

  const handleAddTeacher = () => {
    navigate('/admin/teachers');
    setTimeout(() => {
      const addButton = document.querySelector('[data-add-user]');
      if (addButton) addButton.click();
    }, 100);
  };

  const handleAddStaff = () => {
    navigate('/admin/staff');
    setTimeout(() => {
      const addButton = document.querySelector('[data-add-user]');
      if (addButton) addButton.click();
    }, 100);
  };

  const handleSettings = () => {
    navigate('/admin/settings');
  };

  // Get current data for table
  const currentUsers = getUsers();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Add Student */}
          <button 
            onClick={handleAddStudent}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-500 transition-colors">
              <GraduationCap className="w-6 h-6 text-blue-600 group-hover:text-white" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">Add Student</div>
            <div className="text-sm text-gray-500">Register new student</div>
          </button>

          {/* Add Teacher */}
          <button 
            onClick={handleAddTeacher}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-500 transition-colors">
              <UserCircle className="w-6 h-6 text-purple-600 group-hover:text-white" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">Add Teacher</div>
            <div className="text-sm text-gray-500">Register new teacher</div>
          </button>

          {/* View Reports */}
          <button 
            onClick={handleAddStaff}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 group-hover:bg-green-500 transition-colors">
              <Users className="w-6 h-6 text-green-600 group-hover:text-white" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">Add Staff</div>
            <div className="text-sm text-gray-500">Register new Staff</div>
          </button>

          {/* Settings */}
          <button 
            onClick={handleSettings}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-500 hover:bg-gray-50 transition-all text-left group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4 group-hover:bg-gray-500 transition-colors">
              <SettingsIcon className="w-6 h-6 text-gray-600 group-hover:text-white" />
            </div>
            <div className="font-semibold text-gray-900 mb-1">Settings</div>
            <div className="text-sm text-gray-500">Configure system</div>
          </button>

        </div>
      </div>

      {/* User Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inactive
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Students</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {currentUsers.filter(u => u.role === 'student').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 font-medium">
                    {currentUsers.filter(u => u.role === 'student' && u.status === 'active').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 font-medium">
                    {currentUsers.filter(u => u.role === 'student' && u.status === 'inactive').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => navigate('/admin/students')}
                    className="text-primary hover:text-primary-dark"
                  >
                    View All
                  </button>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Teachers</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {currentUsers.filter(u => u.role === 'teacher').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 font-medium">
                    {currentUsers.filter(u => u.role === 'teacher' && u.status === 'active').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 font-medium">
                    {currentUsers.filter(u => u.role === 'teacher' && u.status === 'inactive').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => navigate('/admin/teachers')}
                    className="text-primary hover:text-primary-dark"
                  >
                    View All
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Staff</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {currentUsers.filter(u => u.role === 'staff').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-green-600 font-medium">
                    {currentUsers.filter(u => u.role === 'staff' && u.status === 'active').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-red-600 font-medium">
                    {currentUsers.filter(u => u.role === 'staff' && u.status === 'inactive').length}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => navigate('/admin/staff')}
                    className="text-primary hover:text-primary-dark"
                  >
                    View All
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;