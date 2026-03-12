
const mongoose = require('mongoose');
const { STATUS } = require('../config/constants');

const AdminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    adminId: {
      type: String,
      unique: true,
      required: true,
      // e.g. "ADM-2024-0001"
    },

    // Permissions
    permissions: {
      manageStudents:  { type: Boolean, default: true },
      manageTeachers:  { type: Boolean, default: true },
      manageStaff:     { type: Boolean, default: true },
      manageAttendance:{ type: Boolean, default: true },
      manageFees:      { type: Boolean, default: true },
      viewReports:     { type: Boolean, default: true },
      manageSettings:  { type: Boolean, default: false },
      superAdmin:      { type: Boolean, default: false },
    },

    department: { type: String, default: 'Administration' },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Static: Auto-generate Admin ID ──────────────────────────────
AdminSchema.statics.generateAdminId = async function () {
  const count = await this.countDocuments();
  const year = new Date().getFullYear();
  return `ADM-${year}-${String(count + 1).padStart(4, '0')}`;
};

module.exports = mongoose.model('Admin', AdminSchema);