import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      rating: 5,
      text: "School 360° has completely transformed how we manage our institution. The attendance system alone has saved us countless hours. The parent app is a game-changer!",
      author: "Dr. Priya Sharma",
      position: "Principal, Greenwood High School",
      avatar: "https://i.pravatar.cc/100?img=1"
    },
    {
      rating: 5,
      text: "The fee management module has made our accounting so much easier. Online payments and automated invoicing have improved our cash flow significantly.",
      author: "Rajesh Kumar",
      position: "Administrator, Sunrise Academy",
      avatar: "https://i.pravatar.cc/100?img=33"
    },
    {
      rating: 5,
      text: "As a parent, I love being able to track my child's progress in real-time. The communication features keep me connected with teachers and the school.",
      author: "Anita Desai",
      position: "Parent, Cambridge School",
      avatar: "https://i.pravatar.cc/100?img=5"
    },
    {
      rating: 5,
      text: "The analytics dashboard gives us incredible insights. We can now make data-driven decisions to improve student outcomes. Highly recommended!",
      author: "Mohammed Ali",
      position: "Director, Al-Falah School",
      avatar: "https://i.pravatar.cc/100?img=12"
    },
    {
      rating: 5,
      text: "Managing multiple branches has never been easier. The multi-school feature is incredibly powerful and the support team is always there when we need them.",
      author: "Sunita Reddy",
      position: "Trustee, Wisdom School Group",
      avatar: "https://i.pravatar.cc/100?img=47"
    }
  ];

  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  React.useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
      setCurrentIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextTestimonial = () => {
    if (currentIndex < testimonials.length - visibleCount) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevTestimonial = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Real experiences from real schools using School 360°
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white rounded-2xl p-8 shadow-lg"
                  style={{ width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 24 / visibleCount}px)` }}
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 italic leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              disabled={currentIndex === 0}
              className={`w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              disabled={currentIndex >= testimonials.length - visibleCount}
              className={`w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;