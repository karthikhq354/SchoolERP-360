const express = require('express');
const router = express.Router();
const { getAllAttendance, markAttendance, markBulkAttendance, updateAttendance, deleteAttendance, getClassAttendanceReport } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
const { markAttendanceValidator, bulkAttendanceValidator, paginationValidator } = require('../middleware/validate');

const TEACHERS_AND_ABOVE = ['teacher', 'admin', 'superadmin'];
const ADMIN = ['admin', 'superadmin'];

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get all attendance records
 *     tags: [Attendance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of attendance records }
 */
router.get('/', protect, paginationValidator, getAllAttendance);
router.get('/report/:class', protect, getClassAttendanceReport);
router.post('/', protect, authorize(...TEACHERS_AND_ABOVE), markAttendanceValidator, markAttendance);
router.post('/bulk', protect, authorize(...TEACHERS_AND_ABOVE), bulkAttendanceValidator, markBulkAttendance);
router.put('/:id', protect, authorize(...TEACHERS_AND_ABOVE), updateAttendance);
router.delete('/:id', protect, authorize(...ADMIN), deleteAttendance);

module.exports = router;