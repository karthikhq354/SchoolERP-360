// controllers/authController.js - Authentication Controller
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// ─── Helper: Send token response ──────────────────────────────────
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      accessToken,
      refreshToken,
      user: {
        id:     user._id,
        name:   user.name,
        email:  user.email,
        role:   user.role,
        status: user.status,
        avatar: user.avatar,
      },
    },
  });
};

// ─── @route   POST /api/auth/register ─────────────────────────────
// ─── @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  // Create base user
  const user = await User.create({ name, email, password, role, phone });

  // Create role-specific profile
  if (role === 'student') {
    const studentId = await Student.generateStudentId();
    await Student.create({
      user: user._id,
      studentId,
      class:  req.body.class  || 'Class 1',
      section:req.body.section || 'A',
      rollNumber: req.body.rollNumber || studentId,
      academicYear: req.body.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    });
  } else if (role === 'teacher') {
    const teacherId = await Teacher.generateTeacherId();
    await Teacher.create({
      user:     user._id,
      teacherId,
      subjects: req.body.subjects || [],
    });
  } else if (role === 'admin' || role === 'superadmin') {
    const adminId = await Admin.generateAdminId();
    await Admin.create({
      user:    user._id,
      adminId,
      permissions: { superAdmin: role === 'superadmin' },
    });
  }

  logger.info(`New user registered: ${email} [${role}]`);
  sendTokenResponse(user, 201, res, 'Registration successful');
});

// ─── @route   POST /api/auth/login ────────────────────────────────
// ─── @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Get user including password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if account is active
  if (user.status !== 'active') {
    return next(new AppError('Your account has been suspended. Contact admin.', 403));
  }

  logger.info(`User logged in: ${email}`);
  sendTokenResponse(user, 200, res, 'Login successful');
});

// ─── @route   POST /api/auth/refresh-token ────────────────────────
// ─── @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: token } = req.body;
  if (!token) return next(new AppError('Refresh token required', 400));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return next(new AppError('Invalid or expired refresh token', 401));
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    return next(new AppError('Refresh token is no longer valid', 401));
  }

  sendTokenResponse(user, 200, res, 'Token refreshed');
});

// ─── @route   POST /api/auth/logout ──────────────────────────────
// ─── @access  Private
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// ─── @route   GET /api/auth/me ────────────────────────────────────
// ─── @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  let profile = null;
  if (user.role === 'student') {
    profile = await Student.findOne({ user: user._id });
  } else if (user.role === 'teacher') {
    profile = await Teacher.findOne({ user: user._id });
  } else if (['admin', 'superadmin'].includes(user.role)) {
    profile = await Admin.findOne({ user: user._id });
  }

  res.status(200).json({
    success: true,
    data: { user, profile },
  });
});

// ─── @route   PUT /api/auth/change-password ──────────────────────
// ─── @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 400));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password changed successfully');
});

module.exports = { register, login, refreshToken, logout, getMe, changePassword };


