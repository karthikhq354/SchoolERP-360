// src/admin/components/DeleteConfirmModal.jsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, user, onConfirm }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-display font-bold text-gray-900">
                Delete User
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{user.name}</span>? 
                This action cannot be undone.
              </p>
              
              {/* User Info */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(user.id);
                onClose();
              }}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;