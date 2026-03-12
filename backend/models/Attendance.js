// models/Attendance.js - Attendance Record Model
const mongoose = require('mongoose');
const { ATTENDANCE_STATUS, CLASSES, SECTIONS, SUBJECTS } = require('../config/constants');

const AttendanceSchema = new mongoose.Schema(
  {
    // Who is being marked
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },

    // Who marked the attendance
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked by field is required'],
    },

    // Date of attendance
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },

    // Class context
    class: {
      type: String,
      required: true,
      enum: CLASSES,
    },
    section: {
      type: String,
      enum: SECTIONS,
    },
    subject: {
      type: String,
      enum: SUBJECTS,
    },

    // Attendance result
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      required: [true, 'Attendance status is required'],
      default: ATTENDANCE_STATUS.ABSENT,
    },

    // Additional context
    remarks: {
      type: String,
      maxlength: [200, 'Remarks cannot exceed 200 characters'],
    },

    // Shift / Period
    period: {
      type: Number,    // 1-8 periods
      min: 1,
      max: 8,
    },

    academicYear: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Compound Indexes ─────────────────────────────────────────────
// Prevent duplicate attendance records for same student/date/subject
AttendanceSchema.index(
  { student: 1, date: 1, subject: 1, period: 1 },
  { unique: true, sparse: true }
);
AttendanceSchema.index({ class: 1, section: 1, date: 1 });
AttendanceSchema.index({ student: 1, date: -1 });
AttendanceSchema.index({ academicYear: 1 });

// ─── Static: Get attendance percentage for a student ──────────────
AttendanceSchema.statics.getAttendancePercentage = async function (studentId, academicYear) {
  const result = await this.aggregate([
    { $match: { student: studentId, academicYear } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        present: {
          $sum: {
            $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        present: 1,
        percentage: {
          $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 2],
        },
      },
    },
  ]);
  return result[0] || { total: 0, present: 0, percentage: 0 };
};

module.exports = mongoose.model('Attendance', AttendanceSchema);