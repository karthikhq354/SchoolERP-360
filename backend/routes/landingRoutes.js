const express = require('express');
const router = express.Router();
const {
  getPricing, createPricing, updatePricing, deletePricing,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getPartners, createPartner, updatePartner, deletePartner,
  getSiteStats, createSiteStat, updateSiteStat,
} = require('../controllers/landingController');
const { protect, authorize } = require('../middleware/auth');

const ADMIN = ['admin', 'superadmin'];

router.get('/pricing',           getPricing);
router.post('/pricing',          protect, authorize(...ADMIN), createPricing);
router.put('/pricing/:id',       protect, authorize(...ADMIN), updatePricing);
router.delete('/pricing/:id',    protect, authorize(...ADMIN), deletePricing);

router.get('/testimonials',         getTestimonials);
router.post('/testimonials',        protect, authorize(...ADMIN), createTestimonial);
router.put('/testimonials/:id',     protect, authorize(...ADMIN), updateTestimonial);
router.delete('/testimonials/:id',  protect, authorize(...ADMIN), deleteTestimonial);

router.get('/partners',         getPartners);
router.post('/partners',        protect, authorize(...ADMIN), createPartner);
router.put('/partners/:id',     protect, authorize(...ADMIN), updatePartner);
router.delete('/partners/:id',  protect, authorize(...ADMIN), deletePartner);

router.get('/stats',        getSiteStats);
router.post('/stats',       protect, authorize(...ADMIN), createSiteStat);
router.put('/stats/:id',    protect, authorize(...ADMIN), updateSiteStat);

module.exports = router;