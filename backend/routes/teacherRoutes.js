const express = require('express');
const router = express.Router();
const { getAllTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher, getTeachersBySubject } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');
const { createTeacherValidator, paginationValidator } = require('../middleware/validate');

const ADMIN = ['admin', 'superadmin'];

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of teachers }
 */
router.get('/', protect, paginationValidator, getAllTeachers);
router.get('/subject/:subject', protect, getTeachersBySubject);
router.get('/:id', protect, getTeacherById);
router.post('/', protect, authorize(...ADMIN), createTeacherValidator, createTeacher);
router.put('/:id', protect, authorize(...ADMIN), updateTeacher);
router.delete('/:id', protect, authorize(...ADMIN), deleteTeacher);

module.exports = router;