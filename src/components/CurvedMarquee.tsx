import React from 'react';

export const CurvedMarquee: React.FC = () => {
  const text = "✦ PANDA OS ✦ STREAMLINE ATTENDANCE ✦ ENGAGE MEMBERS ✦ AUTOMATE REPORTING ✦ DYNAMIC XP STANDINGS ✦ REAL-TIME METRICS ✦ VALKYRIE WORKSPACE ✦ ";
  // Repeat the text to ensure it covers the path length during looping
  const repeatedText = `${text}${text}${text}`;

  return (
    <div className="w-full overflow-hidden py-12 bg-transparent select-none relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <svg
          viewBox="0 0 1000 240"
          className="w-full h-auto overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Curved Path definition matching the U-shape curve in the reference */}
            <path
              id="smile-curve-path"
              d="M -100,50 Q 500,210 1100,50"
              fill="none"
            />
            {/* Linear Gradient for a premium color look */}
            <linearGradient id="curvedMarqueeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B0000" />
              <stop offset="25%" stopColor="#27272A" />
              <stop offset="50%" stopColor="#18181B" />
              <stop offset="75%" stopColor="#27272A" />
              <stop offset="100%" stopColor="#8B0000" />
            </linearGradient>
          </defs>

          {/* Render Text along Path */}
          <text
            fontSize="21"
            fontWeight="900"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="6"
            fill="url(#curvedMarqueeGradient)"
            className="uppercase tracking-widest"
          >
            <textPath href="#smile-curve-path" startOffset="0%">
              {repeatedText}
              {/* Seamless looping SVG animation along the path offset */}
              <animate
                attributeName="startOffset"
                from="0%"
                to="-100%"
                dur="26s"
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
};
