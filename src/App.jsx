import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Partners from './components/Partners';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

import AdminLogin from './admin/Login';
import AdminLayout from './admin/Layout';
import Dashboard from './admin/Dashboard';
import UserManagement from './admin/UserManagement';
import Settings from './admin/Settings';
import Attendance from './admin/Attendance';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('adminToken');
  const role = localStorage.getItem('userRole');

  if (!token) return <Navigate to="/admin/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

const LandingPage = ({ showBackToTop, scrollToTop }) => (
  <div className="relative">
    <Navbar />
    <Hero />
    <Features />
    <Pricing />
    <Partners />
    <Testimonials />
    <CTA />
    <Footer />
    <BackToTop show={showBackToTop} onClick={scrollToTop} />
  </div>
);

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage showBackToTop={showBackToTop} scrollToTop={scrollToTop} />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users"    element={<ProtectedRoute allowedRoles={['admin','superadmin']}><UserManagement /></ProtectedRoute>} />
          <Route path="students" element={<ProtectedRoute allowedRoles={['admin','superadmin','teacher']}><UserManagement /></ProtectedRoute>} />
          <Route path="teachers" element={<ProtectedRoute allowedRoles={['admin','superadmin']}><UserManagement /></ProtectedRoute>} />
          <Route path="staff"    element={<ProtectedRoute allowedRoles={['admin','superadmin']}><UserManagement /></ProtectedRoute>} />
          <Route path="attendance" element={<ProtectedRoute allowedRoles={['admin','superadmin','teacher']}><Attendance /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900">404</h1>
              <p className="text-xl text-gray-600 mt-4">Page not found</p>
              <a href="/" className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg">
                Go Back Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;