import React from 'react';

interface PandaLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const PandaLogo: React.FC<PandaLogoProps> = ({ className = '', size = 32, glow = false }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Background Glow */}
      {glow && (
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-panda-maroon to-panda-gray opacity-30 blur-md rounded-full"
          style={{ transform: 'scale(1.3)' }}
        />
      )}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-300 hover:scale-105"
      >
        {/* Ears */}
        <circle cx="28" cy="28" r="14" fill="url(#earGrad)" />
        <circle cx="28" cy="28" r="8" fill="#0A0A0A" />
        
        <circle cx="72" cy="28" r="14" fill="url(#earGrad)" />
        <circle cx="72" cy="28" r="8" fill="#0A0A0A" />
        
        {/* Head Base */}
        <rect x="18" y="24" width="64" height="58" rx="29" fill="url(#headGrad)" stroke="url(#borderGrad)" strokeWidth="1.5" />
        
        {/* Eyepatches (Modern angled tech look) */}
        <path d="M 28,45 C 28,38 40,40 40,48 C 40,56 32,58 28,52 Z" fill="#0A0A0A" opacity="0.95" />
        <path d="M 72,45 C 72,38 60,40 60,48 C 60,56 68,58 72,52 Z" fill="#0A0A0A" opacity="0.95" />

        {/* Eyes (Glowing nodes) */}
        <circle cx="35" cy="47" r="3.5" fill="#FFFFFF" />
        <circle cx="35" cy="47" r="1.5" fill="#8B0000" />
        
        <circle cx="65" cy="47" r="3.5" fill="#FFFFFF" />
        <circle cx="65" cy="47" r="1.5" fill="#8E8E93" />

        {/* Nose / Mouth area */}
        <path d="M 46,58 C 46,56 54,56 54,58 C 54,61 46,61 46,58 Z" fill="url(#noseGrad)" />
        <path d="M 48,64 Q 50,67 52,64" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        
        {/* Subtle Cheek Tech Accents */}
        <line x1="22" y1="56" x2="26" y2="56" stroke="#8B0000" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
        <line x1="74" y1="56" x2="78" y2="56" stroke="#8E8E93" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="earGrad" x1="14" y1="14" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B0000" />
            <stop offset="1" stopColor="#8E8E93" />
          </linearGradient>
          <linearGradient id="headGrad" x1="18" y1="24" x2="82" y2="82" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#F5F5F7" />
            <stop offset="1" stopColor="#E5E5EA" />
          </linearGradient>
          <linearGradient id="borderGrad" x1="18" y1="24" x2="82" y2="82" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#8B0000" stopOpacity="0.3" />
            <stop offset="1" stopColor="#8E8E93" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="noseGrad" x1="46" y1="56" x2="54" y2="61" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A0A0A" />
            <stop offset="1" stopColor="#222222" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
