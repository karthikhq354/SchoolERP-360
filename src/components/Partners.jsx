import React, { useEffect, useState } from 'react';
import { School, University, GraduationCap, BookOpen, Users, Award, Shield, Lock, CheckCircle, Cloud } from 'lucide-react';

const iconMap = { School, University, GraduationCap, BookOpen, Users, Award };

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackPartners = [
    { name: 'Delhi Public School' },
    { name: 'Ryan International' },
    { name: 'Kendriya Vidyalaya' },
    { name: 'Modern School' },
    { name: 'DAV Public School' },
    { name: 'Presidency School' },
  ];

  const badges = [
    { icon: Shield, text: 'ISO 27001 Certified' },
    { icon: Lock, text: 'SSL Encrypted' },
    { icon: CheckCircle, text: '99.9% Uptime' },
    { icon: Cloud, text: 'Cloud Hosted' },
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/landing/partners')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setPartners(data.data);
        } else {
          setPartners(fallbackPartners);
        }
      })
      .catch(() => setPartners(fallbackPartners))
      .finally(() => setLoading(false));
  }, []);

  const displayPartners = loading ? fallbackPartners : partners;
  const iconKeys = Object.keys(iconMap);

  return (
    <section id="partners" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">Trusted by Leading Institutions</h2>
          <p className="section-subtitle">Join hundreds of schools that trust School 360°</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {displayPartners.map((partner, index) => {
            const Icon = iconMap[iconKeys[index % iconKeys.length]];
            return (
              <div key={partner._id || index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center group">
                <Icon className="w-12 h-12 text-primary mb-3 group-hover:scale-110 transition-transform" strokeWidth={2} />
                <span className="text-sm font-semibold text-gray-800">{partner.name}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
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