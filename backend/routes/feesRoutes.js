const express = require('express');
const router = express.Router();
const { getAllFees, getFeeById, createFee, updateFee, deleteFee, recordPayment, getOverdueFees, getFeesSummary } = require('../controllers/feesController');
const { protect, authorize } = require('../middleware/auth');
const { createFeeValidator, recordPaymentValidator, paginationValidator } = require('../middleware/validate');

const ADMIN = ['admin', 'superadmin'];

/**
 * @swagger
 * /api/fees:
 *   get:
 *     summary: Get all fee records
 *     tags: [Fees]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of fee records }
 */
router.get('/', protect, paginationValidator, getAllFees);
router.get('/overdue', protect, authorize(...ADMIN), getOverdueFees);
router.get('/summary', protect, authorize(...ADMIN), getFeesSummary);
router.get('/:id', protect, getFeeById);
router.post('/', protect, authorize(...ADMIN), createFeeValidator, createFee);
router.post('/:id/pay', protect, authorize(...ADMIN), recordPaymentValidator, recordPayment);
router.put('/:id', protect, authorize(...ADMIN), updateFee);
router.delete('/:id', protect, authorize(...ADMIN), deleteFee);

module.exports = router;