// src/admin/Dashboard.jsx
import React from 'react';
import StatsCard from './components/StatsCard';
import { Users, GraduationCap, UserCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '2,450',
      change: '+12%',
      trend: 'up',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Teachers',
      value: '145',
      change: '+5%',
      trend: 'up',
      icon: UserCircle,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Total Staff',
      value: '89',
      change: '+2%',
      trend: 'up',
      icon: Users,
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Active Users',
      value: '2,684',
      change: '+18%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
  ];

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

      {/* Recent Activity & Charts would go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for charts/activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-sm">Activity feed will be displayed here...</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <p className="text-gray-500 text-sm">Chart will be displayed here...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;