import React, { useEffect, useRef } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

const Navbar = () => {
  const mobileMenuRef = useRef(null);
  const menuIconRef = useRef(null);
  const closeIconRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const sections = ["home", "features", "pricing", "partners", "testimonials", "contact"];

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Navbar background change
      if (scrollY > 50) {
        navRef.current.classList.add("shadow-md");
      } else {
        navRef.current.classList.remove("shadow-md");
      }

      // Active section logic
      const scrollPos = scrollY + 100;

      sections.forEach((id) => {
        const section = document.getElementById(id);
        const link = document.getElementById(`nav-${id}`);

        if (!section || !link) return;

        const top = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add("text-primary");
          link.classList.remove("text-gray-700");
          link.querySelector("span")?.classList.remove("hidden");
        } else {
          link.classList.remove("text-primary");
          link.classList.add("text-gray-700");
          link.querySelector("span")?.classList.add("hidden");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }

    // Close mobile menu
    mobileMenuRef.current.classList.add("hidden");
    menuIconRef.current.classList.remove("hidden");
    closeIconRef.current.classList.add("hidden");
  };

  const toggleMobileMenu = () => {
    mobileMenuRef.current.classList.toggle("hidden");
    menuIconRef.current.classList.toggle("hidden");
    closeIconRef.current.classList.toggle("hidden");
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection("home")}
          >
            <div className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <GraduationCap className="w-10 h-10" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-display font-extrabold text-primary">
              School 360°
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button id="nav-home" onClick={() => scrollToSection("home")} className="relative font-medium text-gray-700 hover:text-primary">
              Home
              <span className="hidden absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
            </button>

            <button id="nav-features" onClick={() => scrollToSection("features")} className="relative font-medium text-gray-700 hover:text-primary">
              Features
              <span className="hidden absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
            </button>

            <button id="nav-pricing" onClick={() => scrollToSection("pricing")} className="relative font-medium text-gray-700 hover:text-primary">
              Pricing
              <span className="hidden absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
            </button>

            <button id="nav-partners" onClick={() => scrollToSection("partners")} className="relative font-medium text-gray-700 hover:text-primary">
              Partners
              <span className="hidden absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
            </button>

            <button id="nav-testimonials" onClick={() => scrollToSection("testimonials")} className="relative font-medium text-gray-700 hover:text-primary">
              Testimonials
              <span className="hidden absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
            </button>

            <button id="nav-contact" onClick={() => scrollToSection("contact")} className="relative font-medium text-gray-700 hover:text-primary">
              Contact
              <span className="hidden absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"></span>
            </button>

            <button className="btn-primary">Get Started</button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="md:hidden text-gray-700 hover:text-primary">
            <Menu ref={menuIconRef} className="w-6 h-6" />
            <X ref={closeIconRef} className="w-6 h-6 hidden" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef} className="md:hidden bg-white border-t shadow-lg hidden">
        <div className="px-4 py-6 space-y-4">
          <button onClick={() => scrollToSection("home")} className="block w-full text-left py-2 font-medium text-gray-700 hover:text-primary">Home</button>
          <button onClick={() => scrollToSection("features")} className="block w-full text-left py-2 font-medium text-gray-700 hover:text-primary">Features</button>
          <button onClick={() => scrollToSection("pricing")} className="block w-full text-left py-2 font-medium text-gray-700 hover:text-primary">Pricing</button>
          <button onClick={() => scrollToSection("partners")} className="block w-full text-left py-2 font-medium text-gray-700 hover:text-primary">Partners</button>
          <button onClick={() => scrollToSection("testimonials")} className="block w-full text-left py-2 font-medium text-gray-700 hover:text-primary">Testimonials</button>
          <button onClick={() => scrollToSection("contact")} className="block w-full text-left py-2 font-medium text-gray-700 hover:text-primary">Contact</button>

          <button className="btn-primary w-full justify-center mt-4">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
