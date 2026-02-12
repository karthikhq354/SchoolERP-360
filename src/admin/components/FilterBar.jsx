// src/admin/components/FilterBar.jsx
import React from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter, 
  statusFilter, 
  setStatusFilter,
  onAddNew 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search by name, email, or phone..."
            />
          </div>
        </div>

        {/* Role Filter */}
        <div className="w-full lg:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;