import React from 'react';
import { GraduationCap, Facebook, Twitter, Linkedin, Instagram, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    'Features',
    'Pricing',
    'Testimonials',
    'About Us',
    'Blog',
    'Careers'
  ];

  const resources = [
    'Documentation',
    'Help Center',
    'Video Tutorials',
    'API Reference',
    'Privacy Policy',
    'Terms of Service'
  ];

  const socialLinks = [
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Youtube, url: '#', label: 'YouTube' }
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-10 h-10 text-primary" strokeWidth={2.5} />
              <span className="text-2xl font-display font-extrabold">School 360°</span>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              Empowering educational institutions with intelligent management solutions. Transform your school operations with our comprehensive ERP platform.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-display font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>123 Education Street<br />Chennai, Tamil Nadu 600001</span>
              </li>
              <li className="flex gap-3 text-white/70">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>+91 98765 43210<br />+91 98765 43211</span>
              </li>
              <li className="flex gap-3 text-white/70">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>info@school360.com<br />support@school360.com</span>
              </li>
              <li className="flex gap-3 text-white/70">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            © 2026 School 360°. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;