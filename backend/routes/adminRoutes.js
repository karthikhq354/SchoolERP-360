const express = require('express');
const router = express.Router();
const { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /api/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of admins }
 */
router.get('/', protect, authorize('superadmin'), getAllAdmins);
router.get('/:id', protect, authorize('superadmin', 'admin'), getAdminById);
router.post('/', protect, authorize('superadmin'), createAdmin);
router.put('/:id', protect, authorize('superadmin'), updateAdmin);
router.delete('/:id', protect, authorize('superadmin'), deleteAdmin);

module.exports = router;