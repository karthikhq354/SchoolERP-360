import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackPlans = [
    {
      planName: 'Starter',
      description: 'Perfect for small schools',
      monthlyPrice: 4999,
      annualPrice: 47990,
      isPopular: false,
      ctaText: 'Choose Plan',
      features: [
        { text: 'Up to 500 students', included: true },
        { text: '10 user accounts', included: true },
        { text: 'Basic modules', included: true },
        { text: 'Email support', included: true },
        { text: 'Advanced analytics', included: false },
      ],
    },
    {
      planName: 'Professional',
      description: 'For growing institutions',
      monthlyPrice: 9999,
      annualPrice: 95990,
      isPopular: true,
      ctaText: 'Choose Plan',
      features: [
        { text: 'Up to 1500 students', included: true },
        { text: '50 user accounts', included: true },
        { text: 'All core modules', included: true },
        { text: 'Priority support', included: true },
        { text: 'Advanced analytics', included: true },
      ],
    },
    {
      planName: 'Enterprise',
      description: 'For large institutions',
      monthlyPrice: 19999,
      annualPrice: 191990,
      isPopular: false,
      ctaText: 'Contact Sales',
      features: [
        { text: 'Unlimited students', included: true },
        { text: 'Unlimited users', included: true },
        { text: 'All modules', included: true },
        { text: '24/7 premium support', included: true },
        { text: 'Custom integrations', included: true },
      ],
    },
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/landing/pricing')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setPlans(data.data);
        } else {
          setPlans(fallbackPlans);
        }
      })
      .catch(() => setPlans(fallbackPlans))
      .finally(() => setLoading(false));
  }, []);

  const displayPlans = loading ? fallbackPlans : plans;

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the perfect plan for your school.</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`font-semibold ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className={`font-semibold ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Annual
            <span className="ml-2 bg-gradient-to-r from-accent to-[#f5576c] text-white text-xs px-2 py-1 rounded-md">Save 20%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayPlans.map((plan, index) => (
            <div
              key={plan._id || index}
              className={`relative bg-white rounded-2xl transition-all duration-300 ${
                plan.isPopular
                  ? 'border-2 border-primary shadow-2xl scale-105'
                  : 'border-2 border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-2'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-display font-bold mb-2">{plan.planName}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <div className="text-center mb-8">
                  <div className="flex items-start justify-center">
                    <span className="text-2xl font-semibold mt-2">₹</span>
                    <span className="text-5xl font-display font-extrabold text-primary mx-1">
                      {(isAnnual ? plan.annualPrice : plan.monthlyPrice).toLocaleString()}
                    </span>
                    <span className="text-gray-600 text-lg mt-4">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {(plan.features || []).map((feature, idx) => (
                    <li key={idx} className={`flex items-center gap-3 ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <button className={plan.isPopular ? 'w-full btn-primary justify-center' : 'w-full bg-transparent border-2 border-primary text-primary px-7 py-3.5 rounded-xl font-display font-semibold hover:bg-primary hover:text-white transition-all duration-300'}>
                  {plan.ctaText || 'Choose Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;