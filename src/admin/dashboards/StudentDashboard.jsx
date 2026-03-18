import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, BookOpen, Calendar,
  CheckCircle, XCircle, Clock, DollarSign,
  AlertCircle, TrendingUp, CreditCard, Hash
} from 'lucide-react';
import api from '../../utils/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [fees, setFees] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loadingFees, setLoadingFees] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(data => {
        if (data.success) {
          setProfile(data.data);
          const studentId = data.data?.profile?._id;
          if (studentId) {
            api.get(`/students/${studentId}/attendance`)
              .then(r => { if (r.success) setAttendance(r.data); })
              .catch(() => {})
              .finally(() => setLoadingAttendance(false));

            api.get(`/students/${studentId}/fees`)
              .then(r => { if (r.success) setFees(r.data); })
              .catch(() => {})
              .finally(() => setLoadingFees(false));
          } else {
            setLoadingAttendance(false);
            setLoadingFees(false);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const userName = localStorage.getItem('userName') || 'Student';
  const userEmail = localStorage.getItem('userEmail') || '';
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const attendancePct = attendance?.summary?.percentage ?? 0;
  const present = attendance?.summary?.present ?? 0;
  const total = attendance?.summary?.total ?? 0;
  const absent = total - present;

  const feeSummary = fees?.summary;
  const totalFee = feeSummary?.totalAmount ?? 0;
  const paidFee = feeSummary?.totalPaid ?? 0;
  const pendingFee = feeSummary?.balance ?? 0;

  const getAttendanceColor = (pct) => {
    if (pct >= 75) return { bar: 'from-green-400 to-green-500', text: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' };
    if (pct >= 60) return { bar: 'from-yellow-400 to-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-700' };
    return { bar: 'from-red-400 to-red-500', text: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-100 text-red-600' };
  };

  const attColors = getAttendanceColor(attendancePct);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, <span className="font-semibold text-primary">{userName}</span>!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40">
                <span className="text-xl font-bold text-white">{initials}</span>
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-white">{userName}</h2>
                <p className="text-white/80 text-sm capitalize">{localStorage.getItem('userRole') || 'student'}</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {loadingProfile ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{userEmail}</span>
                </div>
                {profile?.profile?.class && (
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{profile.profile.class} — Section {profile.profile.section}</span>
                  </div>
                )}
                {profile?.profile?.rollNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">Roll No: {profile.profile.rollNumber}</span>
                  </div>
                )}
                {profile?.profile?.studentId && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">ID: {profile.profile.studentId}</span>
                  </div>
                )}
                {profile?.user?.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">{profile.user.phone}</span>
                  </div>
                )}
                {profile?.profile?.academicYear && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">Year: {profile.profile.academicYear}</span>
                  </div>
                )}
                <div className="pt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${profile?.user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {profile?.user?.status === 'active' ? '● Active' : '● Inactive'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-gray-900">My Attendance</h3>
            </div>
            {!loadingAttendance && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${attColors.badge}`}>
                {attendancePct >= 75 ? 'Good' : attendancePct >= 60 ? 'Average' : 'Low'}
              </span>
            )}
          </div>
          <div className="p-6">
            {loadingAttendance ? (
              <div className="space-y-4">
                <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                <div className={`${attColors.bg} rounded-xl p-5 text-center mb-5`}>
                  <p className={`text-5xl font-display font-bold ${attColors.text}`}>{attendancePct}%</p>
                  <p className="text-gray-500 text-sm mt-1">Overall Attendance</p>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3 mb-5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${attColors.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${attendancePct}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center bg-green-50 rounded-xl p-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-700">{present}</p>
                    <p className="text-xs text-gray-500">Present</p>
                  </div>
                  <div className="text-center bg-red-50 rounded-xl p-3">
                    <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-red-600">{absent}</p>
                    <p className="text-xs text-gray-500">Absent</p>
                  </div>
                  <div className="text-center bg-blue-50 rounded-xl p-3">
                    <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-700">{total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>

                {attendancePct < 75 && (
                  <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">Your attendance is below 75%. Please improve attendance to avoid issues.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-gray-900">My Fees</h3>
            </div>
            {!loadingFees && pendingFee > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                Due Pending
              </span>
            )}
            {!loadingFees && pendingFee === 0 && totalFee > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                All Paid
              </span>
            )}
          </div>
          <div className="p-6">
            {loadingFees ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : totalFee === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No fee records found</p>
                <p className="text-gray-300 text-xs mt-1">Contact admin for fee details</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Total Fee</span>
                    <span className="text-lg font-display font-bold text-gray-900">₹{totalFee.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: totalFee > 0 ? `${Math.min((paidFee / totalFee) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹{paidFee.toLocaleString()} paid</span>
                    <span>{totalFee > 0 ? Math.round((paidFee / totalFee) * 100) : 0}%</span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Amount Paid</span>
                  </div>
                  <span className="text-lg font-bold text-green-700">₹{paidFee.toLocaleString()}</span>
                </div>

                <div className={`rounded-xl p-4 flex justify-between items-center ${pendingFee > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className="flex items-center gap-2">
                    {pendingFee > 0 ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {pendingFee > 0 ? 'Pending Balance' : 'No Pending'}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${pendingFee > 0 ? 'text-red-600' : 'text-green-700'}`}>
                    ₹{pendingFee.toLocaleString()}
                  </span>
                </div>

                {pendingFee > 0 && (
                  <p className="text-xs text-gray-400 text-center mt-2">
                    Please contact admin to clear pending dues
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;