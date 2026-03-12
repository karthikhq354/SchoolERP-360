const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, getStudentAttendance, getStudentFees, getStudentsByClass } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const { createStudentValidator, updateStudentValidator, paginationValidator } = require('../middleware/validate');

const ADMIN = ['admin', 'superadmin'];

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of students }
 */
router.get('/', protect, paginationValidator, getAllStudents);
router.get('/class/:class', protect, getStudentsByClass);
router.get('/:id', protect, getStudentById);
router.get('/:id/attendance', protect, getStudentAttendance);
router.get('/:id/fees', protect, getStudentFees);
router.post('/', protect, authorize(...ADMIN), createStudentValidator, createStudent);
router.put('/:id', protect, authorize(...ADMIN), updateStudentValidator, updateStudent);
router.delete('/:id', protect, authorize(...ADMIN), deleteStudent);

module.exports = router;