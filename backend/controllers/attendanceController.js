// controllers/attendanceController.js - Attendance Controller
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { buildPaginationMeta } = require('../utils/helpers');

// ─── GET /api/attendance ──────────────────────────────────────────
const getAllAttendance = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, class: cls, section, date, status, academicYear, student } = req.query;

  const filter = {};
  if (cls)          filter.class = cls;
  if (section)      filter.section = section;
  if (status)       filter.status = status;
  if (academicYear) filter.academicYear = academicYear;
  if (student)      filter.student = student;
  if (date) {
    const d = new Date(date);
    filter.date = { $gte: new Date(d.setHours(0,0,0,0)), $lt: new Date(d.setHours(23,59,59,999)) };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Attendance.countDocuments(filter);
  const records = await Attendance.find(filter)
    .populate('student', 'studentId rollNumber class section')
    .populate('markedBy', 'name role')
    .sort('-date')
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: records,
    pagination: buildPaginationMeta(total, page, limit),
  });
});

// ─── POST /api/attendance ─────────────────────────────────────────
// Mark attendance for a single student
const markAttendance = asyncHandler(async (req, res, next) => {
  const { studentId, date, status, subject, period, remarks, class: cls, section, academicYear } = req.body;

  const student = await Student.findById(studentId);
  if (!student) return next(new AppError('Student not found', 404));

  const attendanceDate = new Date(date);

  // Upsert: update if exists, create if not
  const record = await Attendance.findOneAndUpdate(
    { student: studentId, date: { $gte: new Date(attendanceDate.setHours(0,0,0,0)), $lt: new Date(attendanceDate.setHours(23,59,59,999)) }, subject, period },
    {
      student: studentId,
      markedBy: req.user.id,
      date: new Date(date),
      status,
      subject,
      period,
      remarks,
      class: cls || student.class,
      section: section || student.section,
      academicYear: academicYear || student.academicYear,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ success: true, message: 'Attendance marked', data: record });
});

// ─── POST /api/attendance/bulk ────────────────────────────────────
// Mark attendance for entire class at once
const markBulkAttendance = asyncHandler(async (req, res) => {
  const { records, date, class: cls, section, subject, period, academicYear } = req.body;
  // records = [{ studentId, status, remarks }, ...]

  const operations = records.map((rec) => {
    const attendanceDate = new Date(date);
    return {
      updateOne: {
        filter: {
          student: rec.studentId,
          date: { $gte: new Date(attendanceDate.setHours(0,0,0,0)), $lt: new Date(attendanceDate.setHours(23,59,59,999)) },
          ...(subject && { subject }),
          ...(period && { period }),
        },
        update: {
          $set: {
            student:      rec.studentId,
            markedBy:     req.user.id,
            date:         new Date(date),
            status:       rec.status,
            class:        cls,
            section,
            subject,
            period,
            academicYear,
            remarks:      rec.remarks || '',
          },
        },
        upsert: true,
      },
    };
  });

  const result = await Attendance.bulkWrite(operations);
  res.status(201).json({
    success: true,
    message: `Attendance marked for ${records.length} students`,
    data: {
      matched:  result.matchedCount,
      modified: result.modifiedCount,
      inserted: result.upsertedCount,
    },
  });
});

// ─── PUT /api/attendance/:id ──────────────────────────────────────
const updateAttendance = asyncHandler(async (req, res, next) => {
  const record = await Attendance.findByIdAndUpdate(
    req.params.id,
    { ...req.body, markedBy: req.user.id },
    { new: true, runValidators: true }
  );
  if (!record) return next(new AppError('Attendance record not found', 404));

  res.status(200).json({ success: true, message: 'Attendance updated', data: record });
});

// ─── DELETE /api/attendance/:id ───────────────────────────────────
const deleteAttendance = asyncHandler(async (req, res, next) => {
  const record = await Attendance.findByIdAndDelete(req.params.id);
  if (!record) return next(new AppError('Attendance record not found', 404));

  res.status(200).json({ success: true, message: 'Attendance record deleted' });
});

// ─── GET /api/attendance/report/:class ───────────────────────────
// Monthly class report
const getClassAttendanceReport = asyncHandler(async (req, res) => {
  const { month, year, section, academicYear } = req.query;

  const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  const endDate   = new Date(parseInt(year), parseInt(month), 1);

  const filter = {
    class: req.params.class,
    date: { $gte: startDate, $lt: endDate },
  };
  if (section) filter.section = section;
  if (academicYear) filter.academicYear = academicYear;

  const report = await Attendance.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$student',
        total:   { $sum: 1 },
        present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } },
        absent:  { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
        late:    { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
      },
    },
    {
      $lookup: {
        from: 'students',
        localField: '_id',
        foreignField: '_id',
        as: 'student',
      },
    },
    { $unwind: '$student' },
    {
      $project: {
        studentId:  '$student.studentId',
        rollNumber: '$student.rollNumber',
        total: 1, present: 1, absent: 1, late: 1,
        percentage: { $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 2] },
      },
    },
    { $sort: { rollNumber: 1 } },
  ]);

  res.status(200).json({ success: true, count: report.length, data: report });
});

module.exports = {
  getAllAttendance,
  markAttendance,
  markBulkAttendance,
  updateAttendance,
  deleteAttendance,
  getClassAttendanceReport,
};