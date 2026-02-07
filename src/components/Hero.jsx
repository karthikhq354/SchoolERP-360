import React, { useState, useEffect } from 'react';
import { PlayCircle, Rocket, ChevronLeft, ChevronRight, TrendingUp, Smartphone, Shield } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [counters, setCounters] = useState({ schools: 0, students: 0, teachers: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  const slides = [
    { gradient: 'from-[#667eea] to-[#764ba2]' },
    { gradient: 'from-[#f093fb] to-[#f5576c]' },
    { gradient: 'from-[#4facfe] to-[#00f2fe]' },
  ];

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate counters
  useEffect(() => {
    if (hasAnimated) return;
    
    const targets = { schools: 500, students: 2500, teachers: 1500 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      schools: targets.schools / steps,
      students: targets.students / steps,
      teachers: targets.teachers / steps,
    };

    let current = { schools: 0, students: 0, teachers: 0 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current.schools = Math.min(current.schools + increment.schools, targets.schools);
      current.students = Math.min(current.students + increment.students, targets.students);
      current.teachers = Math.min(current.teachers + increment.teachers, targets.teachers);
      
      setCounters({
        schools: Math.floor(current.schools),
        students: Math.floor(current.students),
        teachers: Math.floor(current.teachers),
      });

      if (step >= steps) {
        clearInterval(timer);
        setHasAnimated(true);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [hasAnimated]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-10">
      {/* Background Slider */}
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              Transform Your School with{' '}
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Intelligent ERP
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed">
              Comprehensive school management solution powered by AI. Streamline operations, enhance learning, and connect stakeholders seamlessly.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-6">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-extrabold">
                  {counters.schools.toLocaleString()}
                </div>
                <div className="text-sm md:text-base text-white/90 mt-1">Schools Empowered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-extrabold">
                  {counters.students.toLocaleString()}
                </div>
                <div className="text-sm md:text-base text-white/90 mt-1">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-display font-extrabold">
                  {counters.teachers.toLocaleString()}
                </div>
                <div className="text-sm md:text-base text-white/90 mt-1">Teachers Connected</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="btn-white">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </button>
              <button className="btn-outline">
                <Rocket className="w-5 h-5" />
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Right Image with Floating Cards */}
          <div className="relative animate-fade-in-right">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
                alt="School Management Dashboard"
                className="w-full h-auto"
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute top-[10%] -right-4 md:right-0 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg animate-float">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="font-semibold text-gray-800">Real-time Analytics</span>
              </div>
            </div>

            <div className="absolute bottom-[30%] -right-4 md:right-0 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg animate-float animation-delay-200">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-primary" />
                <span className="font-semibold text-gray-800">Mobile First</span>
              </div>
            </div>

            <div className="absolute bottom-[10%] -left-4 md:left-0 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg animate-float animation-delay-400">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-semibold text-gray-800">Bank-level Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default Hero;