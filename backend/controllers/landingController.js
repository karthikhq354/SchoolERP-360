const Pricing = require('../models/Pricing');
const Testimonial = require('../models/Testimonial');
const Partner = require('../models/Partner');
const SiteStats = require('../models/SiteStats');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getPricing = asyncHandler(async (req, res) => {
  const plans = await Pricing.find({ isActive: true }).sort('order');
  res.status(200).json({ success: true, data: plans });
});

const createPricing = asyncHandler(async (req, res) => {
  const plan = await Pricing.create(req.body);
  res.status(201).json({ success: true, message: 'Pricing plan created', data: plan });
});

const updatePricing = asyncHandler(async (req, res, next) => {
  const plan = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!plan) return next(new AppError('Pricing plan not found', 404));
  res.status(200).json({ success: true, message: 'Pricing plan updated', data: plan });
});

const deletePricing = asyncHandler(async (req, res, next) => {
  const plan = await Pricing.findByIdAndDelete(req.params.id);
  if (!plan) return next(new AppError('Pricing plan not found', 404));
  res.status(200).json({ success: true, message: 'Pricing plan deleted' });
});

const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort('order');
  res.status(200).json({ success: true, data: testimonials });
});

const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, message: 'Testimonial created', data: testimonial });
});

const updateTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!testimonial) return next(new AppError('Testimonial not found', 404));
  res.status(200).json({ success: true, data: testimonial });
});

const deleteTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return next(new AppError('Testimonial not found', 404));
  res.status(200).json({ success: true, message: 'Testimonial deleted' });
});

const getPartners = asyncHandler(async (req, res) => {
  const partners = await Partner.find({ isActive: true }).sort('order');
  res.status(200).json({ success: true, data: partners });
});

const createPartner = asyncHandler(async (req, res) => {
  const partner = await Partner.create(req.body);
  res.status(201).json({ success: true, message: 'Partner created', data: partner });
});

const updatePartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!partner) return next(new AppError('Partner not found', 404));
  res.status(200).json({ success: true, data: partner });
});

const deletePartner = asyncHandler(async (req, res, next) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);
  if (!partner) return next(new AppError('Partner not found', 404));
  res.status(200).json({ success: true, message: 'Partner deleted' });
});

const getSiteStats = asyncHandler(async (req, res) => {
  const stats = await SiteStats.find({ isActive: true }).sort('order');
  res.status(200).json({ success: true, data: stats });
});

const createSiteStat = asyncHandler(async (req, res) => {
  const stat = await SiteStats.create(req.body);
  res.status(201).json({ success: true, message: 'Stat created', data: stat });
});

const updateSiteStat = asyncHandler(async (req, res, next) => {
  const stat = await SiteStats.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!stat) return next(new AppError('Stat not found', 404));
  res.status(200).json({ success: true, data: stat });
});

module.exports = {
  getPricing, createPricing, updatePricing, deletePricing,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getPartners, createPartner, updatePartner, deletePartner,
  getSiteStats, createSiteStat, updateSiteStat,
};