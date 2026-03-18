const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema(
  {
    planName:    { type: String, required: true, trim: true },
    description: { type: String },
    monthlyPrice:{ type: Number, required: true },
    annualPrice: { type: Number, required: true },
    features:    [{ text: String, included: { type: Boolean, default: true } }],
    isPopular:   { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
    ctaText:     { type: String, default: 'Choose Plan' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pricing', PricingSchema);