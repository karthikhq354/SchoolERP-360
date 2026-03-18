const mongoose = require('mongoose');

const SiteStatsSchema = new mongoose.Schema(
  {
    label:   { type: String, required: true },
    value:   { type: String, required: true },
    icon:    { type: String },
    order:   { type: Number, default: 0 },
    isActive:{ type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteStats', SiteStatsSchema);