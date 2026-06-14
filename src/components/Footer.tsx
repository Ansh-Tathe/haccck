import React from 'react';
import { PandaLogo } from './PandaLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F3F4F6] border-t border-zinc-200 py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start justify-between gap-10">
        
        {/* Left column: Brand and Slogan */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <PandaLogo size={28} glow />
            <span className="font-heading font-bold text-lg tracking-wider text-zinc-900">
              PANDA
            </span>
          </div>
          <p className="font-sans text-xs text-zinc-500 max-w-xs leading-relaxed text-left">
            The intelligent performance dashboard built to streamline operations and cultivate thriving student communities on campus.
          </p>
        </div>

        {/* Middle column: Navigation links */}
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          <div className="flex flex-col items-start gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Product</span>
            <a href="#features" className="text-xs text-zinc-600 hover:text-zinc-900 hover:underline transition-colors">Features</a>
            <a href="#analytics" className="text-xs text-zinc-600 hover:text-zinc-900 hover:underline transition-colors">Analytics</a>
            <a href="#dashboard" className="text-xs text-zinc-600 hover:text-zinc-900 hover:underline transition-colors">Dashboard</a>
          </div>
          <div className="flex flex-col items-start gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Resources</span>
            <a href="#docs" className="text-xs text-zinc-600 hover:text-zinc-900 hover:underline transition-colors">Documentation</a>
            <a href="#privacy" className="text-xs text-zinc-600 hover:text-zinc-900 hover:underline transition-colors">Privacy Policy</a>
            <a href="#contact" className="text-xs text-zinc-600 hover:text-zinc-900 hover:underline transition-colors">Contact</a>
          </div>
        </div>

        {/* Right column: Social icons */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Connect</span>
          <div className="flex items-center gap-4">
            
            {/* GitHub */}
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all duration-300 shadow-sm"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
 
            {/* LinkedIn */}
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all duration-300 shadow-sm"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
 
            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all duration-300 shadow-sm"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] text-zinc-500">
          &copy; {new Date().getFullYear()} PANDA OS. All rights reserved.
        </span>
        <span className="text-[10px] font-heading font-medium tracking-widest text-panda-maroon uppercase">
          Built by Students, for Students.
        </span>
      </div>
    </footer>
  );
};
