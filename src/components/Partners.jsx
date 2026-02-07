import React from 'react';
import { School, University, GraduationCap, BookOpen, Users, Award, Shield, Lock, CheckCircle, Cloud } from 'lucide-react';

const Partners = () => {
  const partners = [
    { icon: School, name: 'Delhi Public School' },
    { icon: University, name: 'Ryan International' },
    { icon: GraduationCap, name: 'Kendriya Vidyalaya' },
    { icon: BookOpen, name: 'Modern School' },
    { icon: Users, name: 'DAV Public School' },
    { icon: Award, name: 'Presidency School' },
  ];

  const badges = [
    { icon: Shield, text: 'ISO 27001 Certified' },
    { icon: Lock, text: 'SSL Encrypted' },
    { icon: CheckCircle, text: '99.9% Uptime' },
    { icon: Cloud, text: 'Cloud Hosted' },
  ];

  return (
    <section id="partners" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Trusted by Leading Institutions</h2>
          <p className="section-subtitle">
            Join hundreds of schools that trust School 360° for their management needs
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center group"
              >
                <Icon className="w-12 h-12 text-primary mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
                <span className="text-sm font-semibold text-gray-800">{partner.name}</span>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
              >
                <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="font-semibold text-sm text-gray-800">{badge.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partners;