// middleware/validate.js - Request Validation Middleware (express-validator)
const { body, param, query, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

// ─── Run validation and return errors ────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => `${e.path}: ${e.msg}`).join('. ');
    return next(new AppError(messages, 400));
  }
  next();
};

// ─── Auth Validators ──────────────────────────────────────────────
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student','teacher','admin','staff','superadmin']).withMessage('Invalid role'),
  validate,
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// ─── Student Validators ───────────────────────────────────────────
const createStudentValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('section').optional().isIn(['A','B','C','D','E']).withMessage('Invalid section'),
  body('rollNumber').optional(),
  body('gender').optional().isIn(['male','female','other']),
  validate,
];

const updateStudentValidator = [
  param('id').isMongoId().withMessage('Invalid student ID'),
  body('class').optional(),
  body('section').optional().isIn(['A','B','C','D','E']),
  validate,
];

// ─── Teacher Validators ───────────────────────────────────────────
const createTeacherValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('subjects').optional().isArray().withMessage('Subjects must be an array'),
  validate,
];

// ─── Attendance Validators ────────────────────────────────────────
const markAttendanceValidator = [
  body('studentId').isMongoId().withMessage('Valid student ID required'),
  body('date').isISO8601().withMessage('Valid date required (ISO 8601)'),
  body('status').isIn(['present','absent','late','excused']).withMessage('Invalid attendance status'),
  body('period').optional().isInt({ min: 1, max: 8 }),
  validate,
];

const bulkAttendanceValidator = [
  body('records').isArray({ min: 1 }).withMessage('Records must be a non-empty array'),
  body('records.*.studentId').isMongoId().withMessage('Each record needs a valid student ID'),
  body('records.*.status').isIn(['present','absent','late','excused']).withMessage('Invalid status in record'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('class').notEmpty().withMessage('Class is required'),
  validate,
];

// ─── Fee Validators ───────────────────────────────────────────────
const createFeeValidator = [
  body('student').isMongoId().withMessage('Valid student ID required'),
  body('feeType').isIn(['tuition','exam','library','sports','transport','hostel','miscellaneous']).withMessage('Invalid fee type'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('dueDate').isISO8601().withMessage('Valid due date required'),
  validate,
];

const recordPaymentValidator = [
  param('id').isMongoId().withMessage('Invalid fee ID'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Payment amount must be positive'),
  body('paymentMethod').isIn(['cash','cheque','online','upi','bank_transfer','card']).withMessage('Invalid payment method'),
  validate,
];

// ─── Pagination Validator ─────────────────────────────────────────
const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate,
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  createStudentValidator,
  updateStudentValidator,
  createTeacherValidator,
  markAttendanceValidator,
  bulkAttendanceValidator,
  createFeeValidator,
  recordPaymentValidator,
  paginationValidator,
};