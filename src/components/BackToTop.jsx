import React from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = ({ show, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
        show ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;