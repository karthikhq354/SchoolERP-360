// controllers/studentController.js - Student CRUD Controller
const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Fees = require('../models/Fees');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { buildPaginationMeta, buildQueryFilter } = require('../utils/helpers');

// ─── GET /api/students ────────────────────────────────────────────
const getAllStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, class: cls, section, status, search, sort = '-createdAt', academicYear } = req.query;

  const filter = buildQueryFilter({ class: cls, section, status, academicYear });

  const skip = (parseInt(page) - 1) * parseInt(limit);

  let query = Student.find(filter).populate('user', 'name email phone avatar status createdAt');

  // Search by student name/email via populated user
  if (search) {
    const matchingUsers = await User.find({
      $or: [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    const userIds = matchingUsers.map(u => u._id);
    filter.$or = [
      { user: { $in: userIds } },
      { studentId: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
    ];
    query = Student.find(filter).populate('user', 'name email phone avatar status createdAt');
  }

  const total = await Student.countDocuments(filter);
  const students = await query.sort(sort).skip(skip).limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: students,
    pagination: buildPaginationMeta(total, page, limit),
  });
});

// ─── GET /api/students/:id ────────────────────────────────────────
const getStudentById = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate('user', 'name email phone avatar status createdAt');

  if (!student) return next(new AppError('Student not found', 404));

  res.status(200).json({ success: true, data: student });
});

// ─── POST /api/students ───────────────────────────────────────────
const createStudent = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, class: cls, section, rollNumber, academicYear, ...rest } = req.body;

  // Check email
  if (await User.findOne({ email })) {
    return next(new AppError('Email already registered', 409));
  }

  // Create base user
  const user = await User.create({ name, email, password: password || 'Student@123', phone, role: 'student' });

  // Generate student ID
  const studentId = await Student.generateStudentId();

  // Create student profile
  const student = await Student.create({
    user: user._id,
    studentId,
    class: cls,
    section,
    rollNumber: rollNumber || studentId,
    academicYear: academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    ...rest,
  });

  const populated = await student.populate('user', 'name email phone avatar status');

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: populated,
  });
});

// ─── PUT /api/students/:id ────────────────────────────────────────
const updateStudent = asyncHandler(async (req, res, next) => {
  const { name, email, phone, status, ...studentData } = req.body;

  const student = await Student.findById(req.params.id).populate('user');
  if (!student) return next(new AppError('Student not found', 404));

  // Update User fields if provided
  if (name || email || phone || status) {
    await User.findByIdAndUpdate(
      student.user._id,
      { ...(name && { name }), ...(email && { email }), ...(phone && { phone }), ...(status && { status }) },
      { new: true, runValidators: true }
    );
  }

  // Update Student profile
  const updated = await Student.findByIdAndUpdate(req.params.id, studentData, {
    new: true,
    runValidators: true,
  }).populate('user', 'name email phone avatar status');

  res.status(200).json({ success: true, message: 'Student updated', data: updated });
});

// ─── DELETE /api/students/:id ─────────────────────────────────────
const deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) return next(new AppError('Student not found', 404));

  // Soft delete: deactivate user
  await User.findByIdAndUpdate(student.user, { status: 'inactive' });
  student.status = 'inactive';
  await student.save();

  res.status(200).json({ success: true, message: 'Student deactivated successfully' });
});

// ─── GET /api/students/:id/attendance ─────────────────────────────
const getStudentAttendance = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) return next(new AppError('Student not found', 404));

  const { academicYear = student.academicYear, month } = req.query;
  const filter = { student: student._id, academicYear };

  if (month) {
    const year = parseInt(academicYear.split('-')[0]);
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    filter.date = {
      $gte: new Date(year, monthIndex, 1),
      $lt:  new Date(year, monthIndex + 1, 1),
    };
  }

  const records = await Attendance.find(filter).sort('-date');
  const summary = await Attendance.getAttendancePercentage(student._id, academicYear);

  res.status(200).json({
    success: true,
    data: { records, summary },
  });
});

// ─── GET /api/students/:id/fees ───────────────────────────────────
const getStudentFees = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) return next(new AppError('Student not found', 404));

  const { academicYear = student.academicYear } = req.query;
  const fees = await Fees.find({ student: student._id, academicYear }).sort('-dueDate');
  const summary = await Fees.getStudentFeeSummary(student._id, academicYear);

  res.status(200).json({
    success: true,
    data: { fees, summary },
  });
});

// ─── GET /api/students/class/:class ───────────────────────────────
const getStudentsByClass = asyncHandler(async (req, res) => {
  const { section, status = 'active' } = req.query;
  const filter = { class: req.params.class, status };
  if (section) filter.section = section;

  const students = await Student.find(filter)
    .populate('user', 'name email phone avatar')
    .sort('rollNumber');

  res.status(200).json({ success: true, count: students.length, data: students });
});

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  getStudentFees,
  getStudentsByClass,
};