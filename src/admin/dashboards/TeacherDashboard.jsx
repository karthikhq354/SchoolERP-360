import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, CheckCircle, XCircle,
  Clock, TrendingUp, Calendar, Activity
} from 'lucide-react';
import api from '../../utils/api';

const TeacherDashboard = () => {
  const [trend, setTrend] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    api.get('/dashboard/attendance-trend')
      .then(data => { if (data.success) setTrend(data.data); })
      .catch(() => {})
      .finally(() => setLoadingTrend(false));

    api.get('/students?limit=5&status=active')
      .then(data => { if (data.success) setStudents(data.data || []); })
      .catch(() => {})
      .finally(() => setLoadingStudents(false));
  }, []);

  const totalPresent = trend.reduce((sum, d) => sum + (d.present || 0), 0);
  const totalAbsent = trend.reduce((sum, d) => sum + (d.absent || 0), 0);
  const totalLate = trend.reduce((sum, d) => sum + (d.late || 0), 0);
  const totalMarked = totalPresent + totalAbsent + totalLate;
  const attendanceRate = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;

  const summaryCards = [
    { title: 'Present (7 days)', value: totalPresent, icon: CheckCircle, bg: 'bg-green-50', iconColor: 'text-green-500', textColor: 'text-green-700' },
    { title: 'Absent (7 days)', value: totalAbsent, icon: XCircle, bg: 'bg-red-50', iconColor: 'text-red-500', textColor: 'text-red-600' },
    { title: 'Late (7 days)', value: totalLate, icon: Clock, bg: 'bg-yellow-50', iconColor: 'text-yellow-500', textColor: 'text-yellow-600' },
    { title: 'Attendance Rate', value: `${attendanceRate}%`, icon: TrendingUp, bg: 'bg-blue-50', iconColor: 'text-blue-500', textColor: 'text-blue-700' },
  ];

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome, <span className="font-semibold text-primary">{localStorage.getItem('userName') || 'Teacher'}</span>!
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{today}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`${card.bg} rounded-xl p-5 border border-gray-100`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.title}</p>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <p className={`text-3xl font-display font-bold ${card.textColor}`}>
                {loadingTrend ? '...' : card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-gray-900">Attendance Trend</h3>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Last 7 days</span>
          </div>
          <div className="p-6">
            {loadingTrend ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            ) : trend.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No attendance data yet</p>
                <p className="text-gray-300 text-xs mt-1">Mark attendance to see trends here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trend.map((day, i) => {
                  const total = (day.present || 0) + (day.absent || 0) + (day.late || 0);
                  const rate = total > 0 ? Math.round(((day.present || 0) / total) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0 font-medium">{day.date}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 w-28 flex-shrink-0 justify-end">
                        <span className="text-xs text-green-600 font-semibold">✓{day.present || 0}</span>
                        <span className="text-xs text-red-500 font-semibold">✗{day.absent || 0}</span>
                        <span className="text-xs font-bold text-gray-700">{rate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-gray-900">Recent Students</h3>
            </div>
            <a href="/admin/students" className="text-xs text-primary font-semibold hover:text-primary-dark">View All →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {loadingStudents ? (
              <div className="p-6 space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-10">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No students found</p>
              </div>
            ) : (
              students.map((student, i) => {
                const name = student.user?.name || student.name || 'Unknown';
                const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const colors = ['from-blue-400 to-blue-500', 'from-purple-400 to-purple-500', 'from-pink-400 to-pink-500', 'from-green-400 to-green-500', 'from-yellow-400 to-yellow-500'];
                return (
                  <div key={i} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 bg-gradient-to-br ${colors[i % colors.length]} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-xs font-bold text-white">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                      <p className="text-xs text-gray-500">{student.class} · {student.section} · Roll {student.rollNumber}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${student.user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {student.user?.status || 'active'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-gray-900">My Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'View All Students', path: '/admin/students', icon: Users, bg: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100' },
            { label: 'Mark Attendance', path: '/admin/attendance', icon: CheckCircle, bg: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-100' },
            { label: 'Attendance Report', path: '/admin/attendance', icon: Activity, bg: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-100' },
            { label: 'My Profile', path: '/admin/settings', icon: BookOpen, bg: 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={i}
                href={item.path}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border font-medium text-sm transition-all duration-200 text-center ${item.bg}`}
              >
                <Icon className="w-6 h-6" />
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default TeacherDashboard;