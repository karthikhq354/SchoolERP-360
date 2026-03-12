// models/Fees.js - Fee Record Model
const mongoose = require('mongoose');
const { FEE_STATUS, FEE_TYPES } = require('../config/constants');

const FeesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required'],
    },

    // Fee details
    feeType: {
      type: String,
      enum: Object.values(FEE_TYPES),
      required: [true, 'Fee type is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      enum: [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December',
      ],
    },

    // Amounts
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lateFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Due date & payment info
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    paidDate: {
      type: Date,
    },

    // Status
    status: {
      type: String,
      enum: Object.values(FEE_STATUS),
      default: FEE_STATUS.PENDING,
    },

    // Payment method
    paymentMethod: {
      type: String,
      enum: ['cash', 'cheque', 'online', 'upi', 'bank_transfer', 'card'],
    },
    transactionId: {
      type: String,
      sparse: true,
    },

    // Who collected
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    receipt: {
      type: String, // receipt number
      unique: true,
      sparse: true,
    },

    remarks: { type: String },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
FeesSchema.index({ student: 1, academicYear: 1 });
FeesSchema.index({ status: 1 });
FeesSchema.index({ dueDate: 1 });
FeesSchema.index({ feeType: 1 });

// ─── Virtuals ─────────────────────────────────────────────────────
FeesSchema.virtual('totalDue').get(function () {
  return this.amount - this.discount + this.lateFee;
});

FeesSchema.virtual('balance').get(function () {
  return this.totalDue - this.paidAmount;
});

// ─── Pre-save: Auto-update status ─────────────────────────────────
FeesSchema.pre('save', function (next) {
  const balance = this.amount - this.discount + this.lateFee - this.paidAmount;
  if (balance <= 0) {
    this.status = FEE_STATUS.PAID;
  } else if (this.paidAmount > 0) {
    this.status = FEE_STATUS.PARTIAL;
  } else if (new Date() > this.dueDate && this.status === FEE_STATUS.PENDING) {
    this.status = FEE_STATUS.OVERDUE;
  }
  next();
});

// ─── Static: Fee summary for a student ───────────────────────────
FeesSchema.statics.getStudentFeeSummary = async function (studentId, academicYear) {
  const result = await this.aggregate([
    { $match: { student: studentId, academicYear } },
    {
      $group: {
        _id: null,
        totalAmount:  { $sum: '$amount' },
        totalPaid:    { $sum: '$paidAmount' },
        totalDiscount:{ $sum: '$discount' },
        totalLateFee: { $sum: '$lateFee' },
        count:        { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalAmount: 1,
        totalPaid: 1,
        totalDiscount: 1,
        totalLateFee: 1,
        count: 1,
        balance: { $subtract: [
          { $add: ['$totalAmount', '$totalLateFee'] },
          { $add: ['$totalPaid', '$totalDiscount'] },
        ]},
      },
    },
  ]);
  return result[0] || { totalAmount: 0, totalPaid: 0, totalDiscount: 0, totalLateFee: 0, count: 0, balance: 0 };
};

module.exports = mongoose.model('Fees', FeesSchema);