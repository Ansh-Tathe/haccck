import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { PandaLogo } from './PandaLogo';

interface NavbarProps {
  onLaunchDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchDashboard }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Attendance', href: '#attendance' },
    { name: 'Reports', href: '#reports' },
    { name: 'Dashboard', href: '#dashboard' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F8F9FA]/75 border-b border-zinc-200/80 backdrop-blur-md py-4'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo and Name */}
        <a href="#" className="flex items-center gap-3 group">
          <PandaLogo size={34} glow={scrolled} />
          <span className="font-heading font-bold text-xl tracking-wider text-zinc-900 group-hover:text-panda-maroon transition-colors duration-200">
            PANDA
          </span>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (item.name === 'Dashboard') {
                  e.preventDefault();
                  onLaunchDashboard();
                }
              }}
              className="relative font-sans text-sm text-zinc-600 hover:text-zinc-900 transition-colors duration-200 py-1 group"
            >
              {item.name}
              {/* Micro-interaction underline */}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-panda-maroon to-panda-gray group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </nav>

        {/* Desktop Call to Action */}
        <div className="hidden md:flex items-center">
          <button
            onClick={onLaunchDashboard}
            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-full transition-all duration-200 shadow-sm shadow-zinc-950/15 cursor-pointer animate-shimmer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-800 hover:text-panda-maroon transition-colors focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden w-full bg-[#F8F9FA]/98 border-b border-zinc-200 backdrop-blur-lg overflow-hidden absolute top-full left-0 z-40"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (item.name === 'Dashboard') {
                      e.preventDefault();
                      onLaunchDashboard();
                    }
                  }}
                  className="font-heading text-lg text-zinc-800 hover:text-zinc-950 transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
              <hr className="border-zinc-200 my-2" />
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchDashboard();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition-all duration-200 cursor-pointer"
              >
                Get Started <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
