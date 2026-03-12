// controllers/teacherController.js - Teacher CRUD Controller
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { buildPaginationMeta, buildQueryFilter } = require('../utils/helpers');

// ─── GET /api/teachers ────────────────────────────────────────────
const getAllTeachers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, subject, sort = '-createdAt', search } = req.query;

  const filter = buildQueryFilter({ status });
  if (subject) filter.subjects = subject;

  if (search) {
    const matchingUsers = await User.find({
      $or: [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    filter.user = { $in: matchingUsers.map(u => u._id) };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Teacher.countDocuments(filter);
  const teachers = await Teacher.find(filter)
    .populate('user', 'name email phone avatar status')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: teachers,
    pagination: buildPaginationMeta(total, page, limit),
  });
});

// ─── GET /api/teachers/:id ────────────────────────────────────────
const getTeacherById = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id)
    .populate('user', 'name email phone avatar status createdAt');

  if (!teacher) return next(new AppError('Teacher not found', 404));
  res.status(200).json({ success: true, data: teacher });
});

// ─── POST /api/teachers ───────────────────────────────────────────
const createTeacher = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, subjects, classesAssigned, department, qualification, experience, ...rest } = req.body;

  if (await User.findOne({ email })) {
    return next(new AppError('Email already registered', 409));
  }

  const user = await User.create({ name, email, password: password || 'Teacher@123', phone, role: 'teacher' });
  const teacherId = await Teacher.generateTeacherId();

  const teacher = await Teacher.create({
    user: user._id,
    teacherId,
    subjects,
    classesAssigned,
    department,
    qualification,
    experience,
    ...rest,
  });

  const populated = await teacher.populate('user', 'name email phone avatar status');
  res.status(201).json({ success: true, message: 'Teacher created successfully', data: populated });
});

// ─── PUT /api/teachers/:id ────────────────────────────────────────
const updateTeacher = asyncHandler(async (req, res, next) => {
  const { name, email, phone, status, ...teacherData } = req.body;

  const teacher = await Teacher.findById(req.params.id).populate('user');
  if (!teacher) return next(new AppError('Teacher not found', 404));

  if (name || email || phone || status) {
    await User.findByIdAndUpdate(
      teacher.user._id,
      { ...(name && { name }), ...(email && { email }), ...(phone && { phone }), ...(status && { status }) },
      { new: true, runValidators: true }
    );
  }

  const updated = await Teacher.findByIdAndUpdate(req.params.id, teacherData, {
    new: true,
    runValidators: true,
  }).populate('user', 'name email phone avatar status');

  res.status(200).json({ success: true, message: 'Teacher updated', data: updated });
});

// ─── DELETE /api/teachers/:id ─────────────────────────────────────
const deleteTeacher = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return next(new AppError('Teacher not found', 404));

  await User.findByIdAndUpdate(teacher.user, { status: 'inactive' });
  teacher.status = 'inactive';
  await teacher.save();

  res.status(200).json({ success: true, message: 'Teacher deactivated successfully' });
});

// ─── GET /api/teachers/subject/:subject ───────────────────────────
const getTeachersBySubject = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({ subjects: req.params.subject, status: 'active' })
    .populate('user', 'name email phone avatar');

  res.status(200).json({ success: true, count: teachers.length, data: teachers });
});

module.exports = {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachersBySubject,
};