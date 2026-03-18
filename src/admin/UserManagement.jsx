import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import UsersTable from './components/UsersTable';
import UserModal from './components/UserModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ViewUserModal from './components/ViewUserModal';
import FilterBar from './components/FilterBar';
import api from '../utils/api';

const UserManagement = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const getRoleFromPath = () => {
    const path = location.pathname;
    if (path.includes('students')) return 'student';
    if (path.includes('teachers')) return 'teacher';
    if (path.includes('staff')) return 'staff';
    return 'all';
  };

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const pathRole = getRoleFromPath();
      let endpoint = '/users';
      if (pathRole === 'student') endpoint = '/students';
      else if (pathRole === 'teacher') endpoint = '/teachers';

      const data = await api.get(endpoint);

      if (data.success) {
        const normalized = (data.data || []).map(item => {
          const user = item.user || {};
          return {
            id: item._id,
            _id: item._id,
            name: user.name || item.name || '',
            email: user.email || item.email || '',
            phone: user.phone || item.phone || '',
            avatar: user.avatar || item.avatar || '',
            role: user.role || pathRole,
            status: user.status || item.status || 'active',
            joinDate: user.createdAt || item.createdAt || '',
            class: item.class || '',
            section: item.section || '',
            subject: item.subjects ? item.subjects[0] : '',
            department: item.department || '',
            studentId: item.studentId || '',
            teacherId: item.teacherId || '',
          };
        });
        setUsers(normalized);
      } else {
        setError(data.message || 'Failed to load users');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      );
    }
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (userId) => {
    try {
      const data = await api.delete(`/users/${userId}`);
      if (data.success) {
        loadUsers();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      const pathRole = getRoleFromPath();

      if (selectedUser) {
        await api.put(`/users/${selectedUser._id}`, userData);
      } else {
        const body = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password || 'School@123',
          role: userData.role || pathRole,
          class: userData.class,
          section: userData.section,
          rollNumber: userData.rollNumber,
          subjects: userData.subjects ? [userData.subjects] : [],
          department: userData.department,
        };
        await api.post('/auth/register', body);
      }
      loadUsers();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('students')) return 'Student Management';
    if (path.includes('teachers')) return 'Teacher Management';
    if (path.includes('staff')) return 'Staff Management';
    return 'User Management';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-gray-600 mt-1">Manage students, teachers, and staff members</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={loadUsers} className="text-red-600 font-semibold text-sm hover:underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading from database...</p>
          </div>
        </div>
      ) : (
        <>
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onAddNew={handleAddNew}
          />

          <UsersTable
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedUser}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={userToDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UserManagement;