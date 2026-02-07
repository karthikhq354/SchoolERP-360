import React from 'react';
import { CalendarCheck, Download } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
          Ready to Transform Your School?
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-white/95">
          Join thousands of schools already using School 360° to streamline their operations
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button className="btn-white">
            <CalendarCheck className="w-5 h-5" />
            Schedule a Demo
          </button>
          <button className="bg-transparent border-2 border-white text-white px-7 py-3.5 rounded-xl font-display font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Brochure
          </button>
        </div>
        
        <p className="text-sm text-white/80">
          No credit card required • 30-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTA;