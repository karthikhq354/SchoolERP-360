// src/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import UsersTable from './components/UsersTable';
import UserModal from './components/UserModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ViewUserModal from './components/ViewUserModal';   // NEW
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

  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // NEW

  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
  };

  // Filtering
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
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

  // Add
  const handleAddNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // View (UPDATED)
  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Delete
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = (userId) => {
    deleteUser(userId);
    loadUsers();
  };

  // Save
  const handleSaveUser = (userData) => {
    if (selectedUser) {
      updateUser(userData);
    } else {
      addUser(userData);
    }
    loadUsers();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          User Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage students, teachers, and staff members
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddNew={handleAddNew}
      />

      {/* Table */}
      <UsersTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Add / Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      {/* View Modal (NEW) */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedUser}
      />

      {/* Delete Modal */}
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