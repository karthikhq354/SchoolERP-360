const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    position: { type: String },
    school:   { type: String },
    message:  { type: String, required: true },
    rating:   { type: Number, min: 1, max: 5, default: 5 },
    avatar:   { type: String },
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', TestimonialSchema);