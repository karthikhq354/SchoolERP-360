/* eslint-env node */
const Fees = require('../models/Fees');
const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { buildPaginationMeta } = require('../utils/helpers');

// ─── GET /api/fees ────────────────────────────────────────────────
const getAllFees = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, feeType, academicYear, sort = '-dueDate' } = req.query;

  const filter = {};
  if (status)       filter.status = status;
  if (feeType)      filter.feeType = feeType;
  if (academicYear) filter.academicYear = academicYear;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Fees.countDocuments(filter);
  const fees = await Fees.find(filter)
    .populate({ path: 'student', select: 'studentId class section', populate: { path: 'user', select: 'name email' } })
    .populate('collectedBy', 'name')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: fees,
    pagination: buildPaginationMeta(total, page, limit),
  });
});

// ─── GET /api/fees/:id ────────────────────────────────────────────
const getFeeById = asyncHandler(async (req, res, next) => {
  const fee = await Fees.findById(req.params.id)
    .populate({ path: 'student', select: 'studentId class section', populate: { path: 'user', select: 'name email phone' } })
    .populate('collectedBy', 'name');

  if (!fee) return next(new AppError('Fee record not found', 404));
  res.status(200).json({ success: true, data: fee });
});

// ─── POST /api/fees ───────────────────────────────────────────────
const createFee = asyncHandler(async (req, res, next) => {
  const { student: studentId } = req.body;

  const student = await Student.findById(studentId);
  if (!student) return next(new AppError('Student not found', 404));

  // Auto-generate receipt number
  const count = await Fees.countDocuments();
  const receipt = `RCT-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

  const fee = await Fees.create({
    ...req.body,
    receipt,
    collectedBy: req.user?.id,
    academicYear: req.body.academicYear || student.academicYear,
  });

  const populated = await fee.populate({
    path: 'student',
    select: 'studentId class section',
    populate: { path: 'user', select: 'name email' },
  });

  res.status(201).json({ success: true, message: 'Fee record created', data: populated });
});

// ─── PUT /api/fees/:id ────────────────────────────────────────────
const updateFee = asyncHandler(async (req, res, next) => {
  const fee = await Fees.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate({ path: 'student', select: 'studentId class section', populate: { path: 'user', select: 'name email' } });

  if (!fee) return next(new AppError('Fee record not found', 404));
  res.status(200).json({ success: true, message: 'Fee record updated', data: fee });
});

// ─── POST /api/fees/:id/pay ───────────────────────────────────────
// Record a payment
const recordPayment = asyncHandler(async (req, res, next) => {
  const { amount, paymentMethod, transactionId, remarks } = req.body;

  const fee = await Fees.findById(req.params.id);
  if (!fee) return next(new AppError('Fee record not found', 404));

  fee.paidAmount += parseFloat(amount);
  fee.paymentMethod = paymentMethod;
  if (transactionId) fee.transactionId = transactionId;
  fee.paidDate = new Date();
  fee.collectedBy = req.user?.id;
  if (remarks) fee.remarks = remarks;

  await fee.save();

  res.status(200).json({ success: true, message: 'Payment recorded', data: fee });
});

// ─── DELETE /api/fees/:id ─────────────────────────────────────────
const deleteFee = asyncHandler(async (req, res, next) => {
  const fee = await Fees.findByIdAndDelete(req.params.id);
  if (!fee) return next(new AppError('Fee record not found', 404));

  res.status(200).json({ success: true, message: 'Fee record deleted' });
});

// ─── GET /api/fees/overdue ────────────────────────────────────────
const getOverdueFees = asyncHandler(async (req, res) => {
  await Fees.updateMany(
    { dueDate: { $lt: new Date() }, status: 'pending' },
    { $set: { status: 'overdue' } }
  );

  const fees = await Fees.find({ status: 'overdue' })
    .populate({ path: 'student', select: 'studentId class', populate: { path: 'user', select: 'name email phone' } })
    .sort('dueDate');

  res.status(200).json({ success: true, count: fees.length, data: fees });
});

// ─── GET /api/fees/summary ────────────────────────────────────────
const getFeesSummary = asyncHandler(async (req, res) => {
  const { academicYear } = req.query;
  const filter = academicYear ? { academicYear } : {};

  const summary = await Fees.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        count:       { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        paidAmount:  { $sum: '$paidAmount' },
      },
    },
  ]);

  const byType = await Fees.aggregate([
    { $match: filter },
    { $group: { _id: '$feeType', total: { $sum: '$amount' }, collected: { $sum: '$paidAmount' } } },
  ]);

  res.status(200).json({ success: true, data: { byStatus: summary, byType } });
});

module.exports = {
  getAllFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  recordPayment,
  getOverdueFees,
  getFeesSummary,
};