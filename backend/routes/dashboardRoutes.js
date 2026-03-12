const express = require('express');
const router = express.Router();
const { getOverview, getAttendanceTrend, getFeeCollection, getClassStrength, getRecentActivity } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const ADMIN = ['admin', 'superadmin'];

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Get school overview stats
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Overview statistics }
 */
router.get('/overview', protect, authorize(...ADMIN), getOverview);
router.get('/attendance-trend', protect, getAttendanceTrend);
router.get('/fee-collection', protect, authorize(...ADMIN), getFeeCollection);
router.get('/class-strength', protect, getClassStrength);
router.get('/recent-activity', protect, getRecentActivity);

module.exports = router;