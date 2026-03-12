// controllers/userController.js - User CRUD Controller
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { buildPaginationMeta, buildQueryFilter } = require('../utils/helpers');

// ─── GET /api/users ───────────────────────────────────────────────
// @access Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, status, search, sort = '-createdAt' } = req.query;

  const filter = buildQueryFilter({ role, status });

  if (search) {
    filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: users,
    pagination: buildPaginationMeta(total, page, limit),
  });
});

// ─── GET /api/users/:id ───────────────────────────────────────────
const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({ success: true, data: user });
});

// ─── POST /api/users ──────────────────────────────────────────────
// @access Admin
const createUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (await User.findOne({ email })) {
    return next(new AppError('Email already in use', 409));
  }

  const user = await User.create(req.body);
  res.status(201).json({ success: true, message: 'User created', data: user });
});

// ─── PUT /api/users/:id ───────────────────────────────────────────
const updateUser = asyncHandler(async (req, res, next) => {
  // Prevent password update via this route
  delete req.body.password;

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({ success: true, message: 'User updated', data: user });
});

// ─── DELETE /api/users/:id ────────────────────────────────────────
// @access Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));

  // Soft delete: set status to inactive
  user.status = 'inactive';
  await user.save();

  res.status(200).json({ success: true, message: 'User deactivated successfully' });
});

// ─── DELETE /api/users/:id/permanent ─────────────────────────────
// @access SuperAdmin
const permanentDeleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({ success: true, message: 'User permanently deleted' });
});

// ─── GET /api/users/stats ─────────────────────────────────────────
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count:  { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const total = await User.countDocuments();
  res.status(200).json({ success: true, data: { total, breakdown: stats } });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  permanentDeleteUser,
  getUserStats,
};