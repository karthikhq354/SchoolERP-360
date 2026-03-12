// controllers/dashboardController.js - Analytics & Dashboard Controller
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Fees = require('../models/Fees');
const asyncHandler = require('../utils/asyncHandler');

// ─── GET /api/dashboard/overview ─────────────────────────────────
const getOverview = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    activeStudents,
    totalTeachers,
    activeTeachers,
    totalUsers,
    activeUsers,
  ] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: 'active' }),
    Teacher.countDocuments(),
    Teacher.countDocuments({ status: 'active' }),
    User.countDocuments(),
    User.countDocuments({ status: 'active' }),
  ]);

  // Today's attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAttendance = await Attendance.aggregate([
    { $match: { date: { $gte: today, $lt: tomorrow } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const attendanceMap = {};
  todayAttendance.forEach(a => { attendanceMap[a._id] = a.count; });

  // Fee collection this month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const feeStats = await Fees.aggregate([
    { $match: { paidDate: { $gte: startOfMonth } } },
    { $group: { _id: null, collected: { $sum: '$paidAmount' } } },
  ]);

  const pendingFees = await Fees.aggregate([
    { $match: { status: { $in: ['pending', 'overdue'] } } },
    { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      students: {
        total: totalStudents,
        active: activeStudents,
      },
      teachers: {
        total: totalTeachers,
        active: activeTeachers,
      },
      todayAttendance: {
        present: attendanceMap['present'] || 0,
        absent:  attendanceMap['absent']  || 0,
        late:    attendanceMap['late']    || 0,
        total: Object.values(attendanceMap).reduce((a, b) => a + b, 0),
      },
      fees: {
        collectedThisMonth: feeStats[0]?.collected || 0,
        pendingBalance:     pendingFees[0]?.total   || 0,
      },
    },
  });
});

// ─── GET /api/dashboard/attendance-trend ─────────────────────────
// Returns last 7 days attendance trend
const getAttendanceTrend = asyncHandler(async (req, res) => {
  const days = 7;
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const trend = await Attendance.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: {
          year:  { $year: '$date' },
          month: { $month: '$date' },
          day:   { $dayOfMonth: '$date' },
        },
        present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
        absent:  { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
        late:    { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
        total:   { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    {
      $project: {
        _id: 0,
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: { $dateFromParts: { year: '$_id.year', month: '$_id.month', day: '$_id.day' } },
          },
        },
        present: 1, absent: 1, late: 1, total: 1,
      },
    },
  ]);

  res.status(200).json({ success: true, data: trend });
});

// ─── GET /api/dashboard/fee-collection ───────────────────────────
// Monthly fee collection for current academic year
const getFeeCollection = asyncHandler(async (req, res) => {
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1); // Jan 1
  const end   = new Date(year + 1, 0, 1); // Jan 1 next year

  const monthly = await Fees.aggregate([
    { $match: { paidDate: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { $month: '$paidDate' },
        collected: { $sum: '$paidAmount' },
        count:     { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        month: '$_id',
        collected: 1,
        count: 1,
      },
    },
  ]);

  res.status(200).json({ success: true, data: monthly });
});

// ─── GET /api/dashboard/class-strength ───────────────────────────
const getClassStrength = asyncHandler(async (req, res) => {
  const data = await Student.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: { class: '$class', section: '$section' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.class': 1, '_id.section': 1 } },
    {
      $project: {
        _id: 0,
        class:   '$_id.class',
        section: '$_id.section',
        count: 1,
      },
    },
  ]);

  res.status(200).json({ success: true, data });
});

// ─── GET /api/dashboard/recent-activity ──────────────────────────
const getRecentActivity = asyncHandler(async (req, res) => {
  const [recentUsers, recentFees, recentAttendance] = await Promise.all([
    User.find().sort('-createdAt').limit(5).select('name email role createdAt status'),
    Fees.find().sort('-updatedAt').limit(5)
      .populate({ path: 'student', select: 'studentId', populate: { path: 'user', select: 'name' } })
      .select('feeType amount status paidDate'),
    Attendance.find().sort('-createdAt').limit(5)
      .populate('student', 'studentId class section')
      .populate('markedBy', 'name')
      .select('status date class section'),
  ]);

  res.status(200).json({
    success: true,
    data: { recentUsers, recentFees, recentAttendance },
  });
});

module.exports = {
  getOverview,
  getAttendanceTrend,
  getFeeCollection,
  getClassStrength,
  getRecentActivity,
};