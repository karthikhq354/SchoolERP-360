// models/Teacher.js - Teacher Profile Model
const mongoose = require('mongoose');
const { SUBJECTS, CLASSES, STATUS } = require('../config/constants');

const TeacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    teacherId: {
      type: String,
      unique: true,
      required: true,
      // e.g. "TCH-2024-0001"
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Professional info
    designation: {
      type: String,
      enum: ['teacher', 'senior_teacher', 'head_of_department', 'vice_principal', 'principal'],
      default: 'teacher',
    },
    department: { type: String },
    subjects: [{ type: String, enum: SUBJECTS }],
    classesAssigned: [{ type: String, enum: CLASSES }],

    // Joining info
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    qualification: { type: String },
    experience: {
      type: Number,  // in years
      default: 0,
    },

    // Personal info
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: {
      street:  { type: String },
      city:    { type: String },
      state:   { type: String },
      pincode: { type: String },
      country: { type: String, default: 'India' },
    },

    // Salary info
    salary: {
      basic:     { type: Number, default: 0 },
      allowances:{ type: Number, default: 0 },
      deductions:{ type: Number, default: 0 },
    },

    // Status
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

// ─── Indexes ──────────────────────────────────────────────────────
TeacherSchema.index({ subjects: 1 });
TeacherSchema.index({ status: 1 });

// ─── Virtual: Net Salary ──────────────────────────────────────────
TeacherSchema.virtual('netSalary').get(function () {
  return (this.salary?.basic || 0) + (this.salary?.allowances || 0) - (this.salary?.deductions || 0);
});

// ─── Static: Auto-generate Teacher ID ─────────────────────────────
TeacherSchema.statics.generateTeacherId = async function () {
  const count = await this.countDocuments();
  const year = new Date().getFullYear();
  return `TCH-${year}-${String(count + 1).padStart(4, '0')}`;
};

module.exports = mongoose.model('Teacher', TeacherSchema);