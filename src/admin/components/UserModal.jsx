// src/admin/components/UserModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active',
    class: '',
    subject: '',
    department: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'student',
        status: 'active',
        class: '',
        subject: '',
        department: '',
        avatar: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    if (formData.role === 'student' && !formData.class) {
      newErrors.class = 'Class is required for students';
    }
    if (formData.role === 'teacher' && !formData.subject) {
      newErrors.subject = 'Subject is required for teachers';
    }
    if (formData.role === 'staff' && !formData.department) {
      newErrors.department = 'Department is required for staff';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: user?.id || Date.now(),
      joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
      avatar: formData.avatar || 'https://i.pravatar.cc/100?img=' + Math.floor(Math.random() * 50)
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-white">
                {user ? 'Edit User' : 'Add New User'}
              </h3>
              <button 
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="email@school360.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {formData.role === 'student' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class *
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.class ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="e.g., Class 10-A"
                  />
                  {errors.class && <p className="mt-1 text-sm text-red-600">{errors.class}</p>}
                </div>
              )}

              {formData.role === 'teacher' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.subject ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="e.g., Mathematics"
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>
              )}

              {formData.role === 'staff' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.department ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
                    placeholder="e.g., Administration"
                  />
                  {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                {user ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;