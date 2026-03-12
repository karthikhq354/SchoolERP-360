// controllers/adminController.js - Admin Management Controller
const Admin = require('../models/Admin');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { buildPaginationMeta } = require('../utils/helpers');

// ─── GET /api/admins ──────────────────────────────────────────────
const getAllAdmins = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status = 'active' } = req.query;
  const filter = status !== 'all' ? { status } : {};

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Admin.countDocuments(filter);
  const admins = await Admin.find(filter)
    .populate('user', 'name email phone avatar status createdAt')
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({ success: true, data: admins, pagination: buildPaginationMeta(total, page, limit) });
});

// ─── GET /api/admins/:id ──────────────────────────────────────────
const getAdminById = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id).populate('user', 'name email phone avatar status');
  if (!admin) return next(new AppError('Admin not found', 404));
  res.status(200).json({ success: true, data: admin });
});

// ─── POST /api/admins ─────────────────────────────────────────────
const createAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, permissions, department } = req.body;

  if (await User.findOne({ email })) {
    return next(new AppError('Email already registered', 409));
  }

  const user = await User.create({ name, email, password: password || 'Admin@123', phone, role: 'admin' });
  const adminId = await Admin.generateAdminId();

  const admin = await Admin.create({ user: user._id, adminId, permissions, department });
  const populated = await admin.populate('user', 'name email phone avatar status');

  res.status(201).json({ success: true, message: 'Admin created', data: populated });
});

// ─── PUT /api/admins/:id ──────────────────────────────────────────
const updateAdmin = asyncHandler(async (req, res, next) => {
  const { name, email, phone, status, ...adminData } = req.body;
  const admin = await Admin.findById(req.params.id).populate('user');
  if (!admin) return next(new AppError('Admin not found', 404));

  if (name || email || phone || status) {
    await User.findByIdAndUpdate(admin.user._id, { name, email, phone, status }, { new: true });
  }

  const updated = await Admin.findByIdAndUpdate(req.params.id, adminData, { new: true })
    .populate('user', 'name email phone avatar status');

  res.status(200).json({ success: true, message: 'Admin updated', data: updated });
});

// ─── DELETE /api/admins/:id ───────────────────────────────────────
const deleteAdmin = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) return next(new AppError('Admin not found', 404));

  await User.findByIdAndUpdate(admin.user, { status: 'inactive' });
  admin.status = 'inactive';
  await admin.save();

  res.status(200).json({ success: true, message: 'Admin deactivated' });
});

module.exports = { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin };