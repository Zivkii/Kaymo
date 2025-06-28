
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['hero', 'key-metrics', 'causes', 'timeline', 'impacts'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: 'key-metrics', label: 'Metrics' },
    { id: 'causes', label: 'Causes' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'impacts', label: 'Impact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#101014]/90 backdrop-blur-md border-b border-white/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer flex items-center"
            onClick={() => scrollToSection('hero')}
          >
            {/* Kaymo Logo: stylized tree */}
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <rect x="14" y="16" width="4" height="12" rx="2" fill="#5E6AD2"/>
              <path d="M16 16 Q12 10 6 16" stroke="#8ba3f2" strokeWidth="2.1" strokeLinecap="round"/>
              <path d="M16 16 Q20 10 26 16" stroke="#8ba3f2" strokeWidth="2.1" strokeLinecap="round"/>
              <ellipse cx="16" cy="9.5" rx="6" ry="4" fill="#5E6AD2"/>
            </svg>
            <span className="ml-3 text-xl font-semibold tracking-tight text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
              Kaymo
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`transition-all duration-300 px-2 py-1 ${
                  activeSection === item.id
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div>
            <motion.button
              className="flex items-center gap-2 px-5 py-2 rounded-full font-medium bg-[#5E6AD2] hover:bg-[#7d9df7] transition-colors text-white text-[15px] shadow-sm border border-white/10"
              style={{ fontFamily: 'Inter, sans-serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('impacts')}
            >
              <span>Take Action</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
