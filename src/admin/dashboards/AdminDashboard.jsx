import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, GraduationCap, UserCircle, TrendingUp,
  Settings, DollarSign, BookOpen, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import api from '../../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.get('/dashboard/overview');
        if (data.success) {
          setOverview(data.data);
        } else {
          setError(data.message || 'Failed to load dashboard');
        }
      } catch {
        setError('Cannot connect to server. Make sure backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Students',
      value: loading ? '...' : String(overview?.students?.total ?? 0),
      change: `${overview?.students?.active ?? 0} active`,
      trend: 'up',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Teachers',
      value: loading ? '...' : String(overview?.teachers?.total ?? 0),
      change: `${overview?.teachers?.active ?? 0} active`,
      trend: 'up',
      icon: UserCircle,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Active Users',
      value: loading ? '...' : String(overview?.users?.active ?? 0),
      change: `of ${overview?.users?.total ?? 0} total`,
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Today Present',
      value: loading ? '...' : String(overview?.todayAttendance?.present ?? 0),
      change: `${overview?.todayAttendance?.absent ?? 0} absent`,
      trend: (overview?.todayAttendance?.absent ?? 0) > 0 ? 'down' : 'up',
      icon: Users,
      color: 'from-pink-500 to-pink-600',
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-red-500 font-semibold mb-1">Connection Error</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-primary">{localStorage.getItem('userName') || 'Admin'}</span>! Here's what's happening today.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <Activity className="w-4 h-4 text-green-500" />
          <span>Live data from MongoDB</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900">Today's Attendance</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Live</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">{overview?.todayAttendance?.present ?? 0}</span>
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-500">{overview?.todayAttendance?.absent ?? 0}</span>
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Late</span>
                </div>
                <span className="text-lg font-bold text-yellow-500">{overview?.todayAttendance?.late ?? 0}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Marked</span>
                  <span className="font-semibold text-gray-900">{overview?.todayAttendance?.total ?? 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900">Fee Collection</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-xs text-green-600 font-medium mb-1">Collected This Month</p>
                <p className="text-2xl font-display font-bold text-green-700">
                  ₹{(overview?.fees?.collectedThisMonth ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-xs text-red-500 font-medium mb-1">Pending Balance</p>
                <p className="text-2xl font-display font-bold text-red-600">
                  ₹{(overview?.fees?.pendingBalance ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            {[
              { label: '+ Add Student', path: '/admin/students', color: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200' },
              { label: '+ Add Teacher', path: '/admin/teachers', color: 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200' },
              { label: '+ Add Staff', path: '/admin/staff', color: 'hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200' },
              { label: 'User Management', path: '/admin/users', color: 'hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300' },
              { label: 'Settings', path: '/admin/settings', color: 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg border border-transparent text-gray-600 transition-all duration-200 ${item.color}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">User Summary</h3>
          <span className="text-xs text-gray-400">Live from MongoDB</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['User Type', 'Total', 'Active', 'Inactive', 'Action'].map(h => (
                  <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === 'Action' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {[
                { label: 'Students', icon: GraduationCap, color: 'bg-blue-100 text-blue-600', total: overview?.students?.total ?? 0, active: overview?.students?.active ?? 0, path: '/admin/students' },
                { label: 'Teachers', icon: UserCircle, color: 'bg-purple-100 text-purple-600', total: overview?.teachers?.total ?? 0, active: overview?.teachers?.active ?? 0, path: '/admin/teachers' },
                { label: 'All Users', icon: Users, color: 'bg-pink-100 text-pink-600', total: overview?.users?.total ?? 0, active: overview?.users?.active ?? 0, path: '/admin/users' },
              ].map((row, i) => {
                const Icon = row.icon;
                const inactive = row.total - row.active;
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${row.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{row.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{loading ? '...' : row.total}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {loading ? '...' : row.active} active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                        {loading ? '...' : inactive} inactive
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(row.path)}
                        className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors"
                      >
                        View All →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;