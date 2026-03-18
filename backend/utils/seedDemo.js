const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Pricing = require('../models/Pricing');
const Testimonial = require('../models/Testimonial');
const Partner = require('../models/Partner');
const SiteStats = require('../models/SiteStats');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const demoUsers = [
    { name: 'Demo Admin',   email: 'demo.admin@school360.com',   password: 'Demo@123', role: 'admin' },
    { name: 'Demo Teacher', email: 'demo.teacher@school360.com', password: 'Demo@123', role: 'teacher' },
    { name: 'Demo Student', email: 'demo.student@school360.com', password: 'Demo@123', role: 'student' },
  ];

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      const user = await User.create(u);
      if (u.role === 'admin') {
        const adminId = await Admin.generateAdminId();
        await Admin.create({ user: user._id, adminId, permissions: { superAdmin: false } });
      } else if (u.role === 'teacher') {
        const teacherId = await Teacher.generateTeacherId();
        await Teacher.create({ user: user._id, teacherId, subjects: ['Mathematics'], department: 'Sciences' });
      } else if (u.role === 'student') {
        const studentId = await Student.generateStudentId();
        await Student.create({ user: user._id, studentId, class: 'Class 10', section: 'A', rollNumber: '001', academicYear: '2025-2026' });
      }
      console.log(`Created: ${u.email}`);
    } else {
      console.log(`Already exists: ${u.email}`);
    }
  }

  const pricingExists = await Pricing.countDocuments();
  if (pricingExists === 0) {
    await Pricing.insertMany([
      { planName: 'Starter', description: 'Perfect for small schools', monthlyPrice: 4999, annualPrice: 47990, isPopular: false, order: 1, ctaText: 'Choose Plan', features: [{ text: 'Up to 500 students', included: true }, { text: '10 user accounts', included: true }, { text: 'Basic modules', included: true }, { text: 'Advanced analytics', included: false }] },
      { planName: 'Professional', description: 'For growing institutions', monthlyPrice: 9999, annualPrice: 95990, isPopular: true, order: 2, ctaText: 'Choose Plan', features: [{ text: 'Up to 1500 students', included: true }, { text: '50 user accounts', included: true }, { text: 'All core modules', included: true }, { text: 'Advanced analytics', included: true }] },
      { planName: 'Enterprise', description: 'For large institutions', monthlyPrice: 19999, annualPrice: 191990, isPopular: false, order: 3, ctaText: 'Contact Sales', features: [{ text: 'Unlimited students', included: true }, { text: 'Unlimited users', included: true }, { text: 'All modules', included: true }, { text: '24/7 support', included: true }] },
    ]);
    console.log('Pricing plans seeded');
  }

  const testimonialsExist = await Testimonial.countDocuments();
  if (testimonialsExist === 0) {
    await Testimonial.insertMany([
      { name: 'Dr. Priya Sharma', position: 'Principal, Greenwood High School', message: 'School 360° has completely transformed how we manage our institution.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=1', order: 1 },
      { name: 'Rajesh Kumar', position: 'Administrator, Sunrise Academy', message: 'The fee management module has made our accounting so much easier.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=33', order: 2 },
      { name: 'Anita Desai', position: 'Parent, Cambridge School', message: 'As a parent, I love being able to track my child\'s progress in real-time.', rating: 5, avatar: 'https://i.pravatar.cc/100?img=5', order: 3 },
    ]);
    console.log('Testimonials seeded');
  }

  const partnersExist = await Partner.countDocuments();
  if (partnersExist === 0) {
    await Partner.insertMany([
      { name: 'Delhi Public School', order: 1 },
      { name: 'Ryan International', order: 2 },
      { name: 'Kendriya Vidyalaya', order: 3 },
      { name: 'Modern School', order: 4 },
      { name: 'DAV Public School', order: 5 },
      { name: 'Presidency School', order: 6 },
    ]);
    console.log('Partners seeded');
  }

  const statsExist = await SiteStats.countDocuments();
  if (statsExist === 0) {
    await SiteStats.insertMany([
      { label: 'Schools Empowered', value: '500', order: 1 },
      { label: 'Active Students', value: '2500', order: 2 },
      { label: 'Teachers Connected', value: '1500', order: 3 },
    ]);
    console.log('Site stats seeded');
  }

  console.log('All demo data seeded successfully');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});