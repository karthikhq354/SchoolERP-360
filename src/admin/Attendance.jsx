import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, Search,
  Filter, Users, Calendar, Download,
  ChevronLeft, ChevronRight, AlertCircle,
  RefreshCw, BookOpen
} from 'lucide-react';
import api from '../utils/api';

const statusConfig = {
  present: { label: 'Present', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', icon: CheckCircle },
  absent:  { label: 'Absent',  color: 'bg-red-100 text-red-600 border-red-200',   dot: 'bg-red-500',   icon: XCircle },
  late:    { label: 'Late',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', icon: Clock },
  excused: { label: 'Excused', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500',  icon: AlertCircle },
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error:   'bg-red-50 border-red-200 text-red-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg animate-fade-in-up ${colors[type]}`}>
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
};

const Attendance = () => {
  const role = localStorage.getItem('userRole');

  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [toast, setToast] = useState(null);

  const [activeTab, setActiveTab] = useState('records');

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    date: new Date().toISOString().split('T')[0],
    class: 'all',
  });

  const [bulkDate, setBulkDate] = useState(new Date().toISOString().split('T')[0]);
  const [bulkClass, setBulkClass] = useState('Class 10');
  const [bulkSection, setBulkSection] = useState('A');
  const [bulkAcYear, setBulkAcYear] = useState('2025-2026');
  const [bulkStatuses, setBulkStatuses] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const CLASSES = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12'];
  const SECTIONS = ['A','B','C','D','E'];

  const fetchRecords = async (page = 1) => {
    try {
      setLoading(true);
      let endpoint = `/attendance?page=${page}&limit=10`;
      if (filters.date)               endpoint += `&date=${filters.date}`;
      if (filters.status !== 'all')   endpoint += `&status=${filters.status}`;
      if (filters.class !== 'all')    endpoint += `&class=${encodeURIComponent(filters.class)}`;

      const data = await api.get(endpoint);
      if (data.success) {
        setRecords(data.data || []);
        setPagination({
          page,
          total:      data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1,
        });
      }
    } catch {
      showToast('Failed to load attendance records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForBulk = async () => {
    try {
      setLoadingStudents(true);
      const data = await api.get(`/students?class=${encodeURIComponent(bulkClass)}&section=${bulkSection}&status=active&limit=50`);
      if (data.success) {
        setStudents(data.data || []);
        const initial = {};
        (data.data || []).forEach(s => { initial[s._id] = 'present'; });
        setBulkStatuses(initial);
      }
    } catch {
      showToast('Failed to load students', 'error');
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => { fetchRecords(1); }, [filters.date, filters.status, filters.class]);

  useEffect(() => {
    if (activeTab === 'mark') fetchStudentsForBulk();
  }, [activeTab, bulkClass, bulkSection]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBulkStatusChange = (studentId, status) => {
    setBulkStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllAs = (status) => {
    const updated = {};
    students.forEach(s => { updated[s._id] = status; });
    setBulkStatuses(updated);
    showToast(`All students marked as ${status}`, 'info');
  };

  const submitBulkAttendance = async () => {
    if (students.length === 0) {
      showToast('No students found for this class/section', 'error');
      return;
    }

    const records = students.map(s => ({
      studentId: s._id,
      status:    bulkStatuses[s._id] || 'absent',
      remarks:   '',
    }));

    setMarking(true);
    try {
      const data = await api.post('/attendance/bulk', {
        records,
        date:         bulkDate,
        class:        bulkClass,
        section:      bulkSection,
        academicYear: bulkAcYear,
      });

      if (data.success) {
        showToast(`Attendance marked for ${students.length} students!`, 'success');
        setActiveTab('records');
        fetchRecords(1);
      } else {
        showToast(data.message || 'Failed to mark attendance', 'error');
      }
    } catch {
      showToast('Server error. Please try again.', 'error');
    } finally {
      setMarking(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      const data = await api.delete(`/attendance/${id}`);
      if (data.success) {
        showToast('Record deleted', 'success');
        fetchRecords(pagination.page);
      }
    } catch {
      showToast('Failed to delete record', 'error');
    }
  };

  const exportAttendance = () => {
    if (records.length === 0) { showToast('No records to export', 'info'); return; }
    const csv = [
      ['Date', 'Student ID', 'Student Name', 'Class', 'Section', 'Status', 'Remarks'],
      ...records.map(r => [
        r.date?.split('T')[0] || '',
        r.student?.studentId || '',
        r.student?.user?.name || '',
        r.class || '',
        r.section || '',
        r.status || '',
        r.remarks || '',
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${filters.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Attendance exported as CSV!', 'success');
  };

  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount  = records.filter(r => r.status === 'absent').length;
  const lateCount    = records.filter(r => r.status === 'late').length;

  const filteredRecords = records.filter(r => {
    if (!filters.search) return true;
    const name = r.student?.user?.name || '';
    const id   = r.student?.studentId || '';
    return name.toLowerCase().includes(filters.search.toLowerCase()) || id.includes(filters.search);
  });

  const canMark = ['admin', 'superadmin', 'teacher'].includes(role);

  return (
    <div className="space-y-6">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1">Track and manage student attendance records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportAttendance}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          {canMark && (
            <button
              onClick={() => setActiveTab('mark')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Attendance
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: pagination.total, bg: 'bg-gray-50', text: 'text-gray-900', icon: Users },
          { label: 'Present',       value: presentCount,     bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
          { label: 'Absent',        value: absentCount,      bg: 'bg-red-50',   text: 'text-red-600',   icon: XCircle },
          { label: 'Late',          value: lateCount,        bg: 'bg-yellow-50',text: 'text-yellow-700',icon: Clock },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`${card.bg} rounded-xl p-5 border border-gray-100`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{card.label}</p>
                <Icon className={`w-4 h-4 ${card.text}`} />
              </div>
              <p className={`text-3xl font-display font-bold ${card.text}`}>{loading ? '...' : card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'records', label: 'View Records', icon: BookOpen },
          ...(canMark ? [{ id: 'mark', label: 'Mark Attendance', icon: CheckCircle }] : []),
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'records' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={filters.search}
                  onChange={e => handleFilterChange('search', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={filters.date}
                  onChange={e => handleFilterChange('date', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <select
                value={filters.status}
                onChange={e => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>

              <select
                value={filters.class}
                onChange={e => handleFilterChange('class', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="all">All Classes</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">No attendance records found</p>
              <p className="text-gray-400 text-sm mt-1">Try changing the date or filters</p>
              {canMark && (
                <button
                  onClick={() => setActiveTab('mark')}
                  className="mt-4 px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Mark Attendance Now
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Student', 'Student ID', 'Class', 'Date', 'Status', 'Remarks', ...(canMark ? ['Action'] : [])].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRecords.map((record, i) => {
                      const cfg = statusConfig[record.status] || statusConfig.absent;
                      const Icon = cfg.icon;
                      const name = record.student?.user?.name || 'Unknown';
                      const initials = name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                      const colors = ['from-blue-400 to-blue-500','from-purple-400 to-purple-500','from-pink-400 to-pink-500','from-green-400 to-green-500'];
                      return (
                        <tr key={record._id || i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 bg-gradient-to-br ${colors[i % colors.length]} rounded-full flex items-center justify-center flex-shrink-0`}>
                                <span className="text-xs font-bold text-white">{initials}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">{record.student?.studentId || '—'}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{record.class} {record.section && `· ${record.section}`}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{record.date ? new Date(record.date).toLocaleDateString('en-IN') : '—'}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-500">{record.remarks || '—'}</td>
                          {canMark && (
                            <td className="px-5 py-4">
                              <button
                                onClick={() => handleDeleteRecord(record._id)}
                                className="text-red-400 hover:text-red-600 text-xs font-semibold hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchRecords(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                      onClick={() => fetchRecords(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'mark' && canMark && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Mark Bulk Attendance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Date</label>
                <input
                  type="date"
                  value={bulkDate}
                  onChange={e => setBulkDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Class</label>
                <select
                  value={bulkClass}
                  onChange={e => setBulkClass(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Section</label>
                <select
                  value={bulkSection}
                  onChange={e => setBulkSection(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Academic Year</label>
                <select
                  value={bulkAcYear}
                  onChange={e => setBulkAcYear(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                  <option value="2026-2027">2026-2027</option>
                </select>
              </div>
            </div>

            {students.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-gray-500 font-medium">Mark all as:</span>
                {['present', 'absent', 'late', 'excused'].map(s => {
                  const cfg = statusConfig[s];
                  return (
                    <button
                      key={s}
                      onClick={() => markAllAs(s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${cfg.color}`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {loadingStudents ? (
            <div className="p-8 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : students.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">No students found</p>
              <p className="text-gray-400 text-sm mt-1">Try selecting a different class or section</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-50">
                {students.map((student, i) => {
                  const name = student.user?.name || student.name || 'Unknown';
                  const initials = name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                  const colors = ['from-blue-400 to-blue-500','from-purple-400 to-purple-500','from-pink-400 to-pink-500','from-green-400 to-green-500','from-yellow-400 to-yellow-500'];
                  const currentStatus = bulkStatuses[student._id] || 'present';

                  return (
                    <div key={student._id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className={`w-9 h-9 bg-gradient-to-br ${colors[i % colors.length]} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-xs font-bold text-white">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                        <p className="text-xs text-gray-400">Roll {student.rollNumber} · {student.studentId}</p>
                      </div>
                      <div className="flex gap-2">
                        {['present', 'absent', 'late', 'excused'].map(s => {
                          const cfg = statusConfig[s];
                          const isSelected = currentStatus === s;
                          return (
                            <button
                              key={s}
                              onClick={() => handleBulkStatusChange(student._id, s)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                isSelected
                                  ? `${cfg.color} shadow-sm scale-105`
                                  : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{students.length}</span> students ·{' '}
                  <span className="text-green-600 font-semibold">{Object.values(bulkStatuses).filter(s => s === 'present').length} present</span> ·{' '}
                  <span className="text-red-500 font-semibold">{Object.values(bulkStatuses).filter(s => s === 'absent').length} absent</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab('records')}
                    className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitBulkAttendance}
                    disabled={marking}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-60"
                  >
                    {marking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {marking ? 'Saving...' : 'Submit Attendance'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;