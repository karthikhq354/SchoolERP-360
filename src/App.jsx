import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Landing Page Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Partners from './components/Partners';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Admin Components
import AdminLogin from './admin/Login';
import AdminLayout from './admin/Layout';
import Dashboard from './admin/Dashboard';
import UserManagement from './admin/UserManagement';
import Settings from "./admin/Settings";

// Protected Route Component for Admin
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken');
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Public Landing Page Component (Your existing design)
const LandingPage = ({ showBackToTop, scrollToTop }) => {
  return (
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
};

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page Route (Your existing page) */}
        <Route 
          path="/" 
          element={<LandingPage showBackToTop={showBackToTop} scrollToTop={scrollToTop} />} 
        />
        
        {/* Admin Login Route (Public - anyone can access) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes (Requires authentication) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Admin Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* User Management Routes */}
          <Route path="users" element={<UserManagement />} />
          <Route path="students" element={<UserManagement />} />
          <Route path="teachers" element={<UserManagement />} />
          <Route path="staff" element={<UserManagement />} />
          
          {/* Settings Route (placeholder) */}
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900">404</h1>
              <p className="text-xl text-gray-600 mt-4">Page not found</p>
              <a href="/" className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all">
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