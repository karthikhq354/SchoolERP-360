const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    logo:     { type: String },
    website:  { type: String },
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Partner', PartnerSchema);