// models/Student.js - Student Profile Model
const mongoose = require('mongoose');
const { CLASSES, SECTIONS, STATUS } = require('../config/constants');

const StudentSchema = new mongoose.Schema(
  {
    // Link to base User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Student-specific identity
    studentId: {
      type: String,
      unique: true,
      required: true,
      // e.g. "STU-2024-0001"
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    admissionNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Academic info
    class: {
      type: String,
      required: [true, 'Class is required'],
      enum: CLASSES,
    },
    section: {
      type: String,
      enum: SECTIONS,
      default: 'A',
    },
    academicYear: {
      type: String,
      required: true,
      default: () => {
        const y = new Date().getFullYear();
        return `${y}-${y + 1}`;
      },
    },
    subjects: [{ type: String }],

    // Personal info
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'unknown'],
      default: 'unknown',
    },
    address: {
      street:  { type: String },
      city:    { type: String },
      state:   { type: String },
      pincode: { type: String },
      country: { type: String, default: 'India' },
    },

    // Parent/Guardian info
    parentInfo: {
      fatherName:  { type: String },
      motherName:  { type: String },
      guardianName:{ type: String },
      phone:       { type: String },
      email:       { type: String },
      occupation:  { type: String },
    },

    // Academics
    previousSchool: { type: String },

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

StudentSchema.index({ class: 1, section: 1 });
StudentSchema.index({ academicYear: 1 });
StudentSchema.index({ status: 1 });

// ─── Virtual: Age ─────────────────────────────────────────────────
StudentSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const diff = Date.now() - this.dateOfBirth.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

// ─── Static: Auto-generate Student ID ─────────────────────────────
StudentSchema.statics.generateStudentId = async function () {
  const count = await this.countDocuments();
  const year = new Date().getFullYear();
  return `STU-${year}-${String(count + 1).padStart(4, '0')}`;
};

module.exports = mongoose.model('Student', StudentSchema);