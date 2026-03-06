import React from "react";
import { X } from "lucide-react";

const ViewUserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-lg font-semibold">User Details</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>

            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium capitalize">{user.status}</p>
            </div>

            <div>
              <p className="text-gray-500">Class / Subject</p>
              <p className="font-medium">
                {user.class || user.subject || user.department || "-"}
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewUserModal;