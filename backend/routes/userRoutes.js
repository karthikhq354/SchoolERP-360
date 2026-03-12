const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, permanentDeleteUser, getUserStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { paginationValidator } = require('../middleware/validate');

const ADMIN = ['admin', 'superadmin'];

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of users }
 */
router.get('/', protect, authorize(...ADMIN), paginationValidator, getAllUsers);
router.get('/stats', protect, authorize(...ADMIN), getUserStats);
router.get('/:id', protect, authorize(...ADMIN), getUserById);
router.post('/', protect, authorize(...ADMIN), createUser);
router.put('/:id', protect, authorize(...ADMIN), updateUser);
router.delete('/:id', protect, authorize(...ADMIN), deleteUser);
router.delete('/:id/permanent', protect, authorize('superadmin'), permanentDeleteUser);

module.exports = router;