// src/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import UsersTable from './components/UsersTable';
import UserModal from './components/UserModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import FilterBar from './components/FilterBar';
import { getUsers, addUser, updateUser, deleteUser } from './data/mockData';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Load users from localStorage on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };

  // Filter users
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Add new user
  const handleAddNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Edit user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // View user
  const handleView = (user) => {
    alert(`View details for ${user.name}`);
  };

  // Delete user
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = (userId) => {
    deleteUser(userId);
    loadUsers(); // Reload from localStorage
  };

  // Save user (add or update)
  const handleSaveUser = (userData) => {
    if (selectedUser) {
      // Update existing user
      updateUser(userData);
    } else {
      // Add new user
      addUser(userData);
    }
    loadUsers(); // Reload from localStorage
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage students, teachers, and staff members</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddNew={handleAddNew}
      />

      {/* Users Table */}
      <UsersTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
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