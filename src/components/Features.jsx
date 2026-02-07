import React from 'react';
import { 
  UserCheck, 
  IndianRupee, 
  GraduationCap, 
  MessageCircle, 
  Bus, 
  Book, 
  Calendar, 
  BarChart3, 
  Smartphone,
  Check
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: UserCheck,
      gradient: 'from-[#667eea] to-[#764ba2]',
      title: 'Smart Attendance',
      description: 'AI-powered facial recognition and biometric attendance system with real-time notifications to parents',
      points: [
        'Face recognition technology',
        'Automated notifications',
        'Attendance analytics'
      ]
    },
    {
      icon: IndianRupee,
      gradient: 'from-[#f093fb] to-[#f5576c]',
      title: 'Fee Management',
      description: 'Comprehensive fee collection with online payments, invoicing, and automated reminders',
      points: [
        'Online payment gateway',
        'Auto-invoice generation',
        'Payment tracking'
      ]
    },
    {
      icon: GraduationCap,
      gradient: 'from-[#4facfe] to-[#00f2fe]',
      title: 'Academic Management',
      description: 'Complete student lifecycle management from admission to alumni tracking',
      points: [
        'Admission processing',
        'Exam & results',
        'Progress reports'
      ]
    },
    {
      icon: MessageCircle,
      gradient: 'from-[#fa709a] to-[#fee140]',
      title: 'Communication Hub',
      description: 'Instant messaging, notifications, and updates for seamless communication',
      points: [
        'SMS & Email alerts',
        'Notice board',
        'Parent-teacher chat'
      ]
    },
    {
      icon: Bus,
      gradient: 'from-[#30cfd0] to-[#330867]',
      title: 'Transport Tracking',
      description: 'Real-time GPS tracking of school buses with route optimization and safety alerts',
      points: [
        'Live GPS tracking',
        'Route management',
        'Parent notifications'
      ]
    },
    {
      icon: Book,
      gradient: 'from-[#a8edea] to-[#fed6e3]',
      title: 'Library System',
      description: 'Digital library management with barcode scanning and online catalog',
      points: [
        'Barcode integration',
        'Online catalog',
        'Issue tracking'
      ]
    },
    {
      icon: Calendar,
      gradient: 'from-[#ff9a9e] to-[#fecfef]',
      title: 'Timetable & Scheduling',
      description: 'Automated timetable generation with conflict detection and optimization',
      points: [
        'Auto-generation',
        'Conflict resolution',
        'Teacher allocation'
      ]
    },
    {
      icon: BarChart3,
      gradient: 'from-[#ffecd2] to-[#fcb69f]',
      title: 'Analytics & Reports',
      description: 'Comprehensive insights and analytics for data-driven decision making',
      points: [
        'Custom dashboards',
        'Performance metrics',
        'Export reports'
      ]
    },
    {
      icon: Smartphone,
      gradient: 'from-[#fddb92] to-[#d1fdff]',
      title: 'Mobile Apps',
      description: 'Native mobile apps for students, parents, and teachers on iOS and Android',
      points: [
        'iOS & Android apps',
        'Offline access',
        'Push notifications'
      ]
    }
  ];

  const additionalFeatures = [
    'HR & Payroll',
    'Inventory Management',
    'Hostel Management',
    'Online Classes',
    'Certificate Generation',
    'Multi-School Management'
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Powerful Features for Modern Education</h2>
          <p className="section-subtitle">
            Everything you need to run your school efficiently, all in one platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Additional Features Banner */}
        <div className="gradient-bg-1 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-display font-bold mb-6">
            And 40+ More Powerful Modules
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {additionalFeatures.map((feature, index) => (
              <span
                key={index}
                className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Check className="w-4 h-4 inline mr-1" />
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;