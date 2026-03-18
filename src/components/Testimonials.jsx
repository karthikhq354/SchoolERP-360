import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallback = [
    { rating: 5, message: 'School 360° has completely transformed how we manage our institution.', name: 'Dr. Priya Sharma', position: 'Principal, Greenwood High School', avatar: 'https://i.pravatar.cc/100?img=1' },
    { rating: 5, message: 'The fee management module has made our accounting so much easier.', name: 'Rajesh Kumar', position: 'Administrator, Sunrise Academy', avatar: 'https://i.pravatar.cc/100?img=33' },
    { rating: 5, message: 'As a parent, I love being able to track my child\'s progress in real-time.', name: 'Anita Desai', position: 'Parent, Cambridge School', avatar: 'https://i.pravatar.cc/100?img=5' },
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/landing/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setTestimonials(data.data);
        } else {
          setTestimonials(fallback);
        }
      })
      .catch(() => setTestimonials(fallback))
      .finally(() => setLoading(false));
  }, []);

  const displayList = loading ? fallback : testimonials;
  const visibleCount = 3;

  const next = () => {
    if (currentIndex < displayList.length - visibleCount) setCurrentIndex(currentIndex + 1);
  };
  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Real experiences from real schools using School 360°</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {displayList.map((t, index) => (
                <div
                  key={t._id || index}
                  className="flex-shrink-0 bg-white rounded-2xl p-8 shadow-lg"
                  style={{ width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 24 / visibleCount}px)` }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed mb-6">"{t.message || t.text}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-600">{t.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button onClick={prev} disabled={currentIndex === 0} className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} disabled={currentIndex >= displayList.length - visibleCount} className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;