import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertCircle, CheckCircle2, MessageSquare, FileSpreadsheet, Clock, Sparkles, TrendingUp, Calendar, QrCode } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const isDragging = useRef(false);

  // Auto-slide to show off the interaction when scrolled into view
  useEffect(() => {
    if (isInView) {
      // Simulate slide animation from 100 to 35, then back to 50
      const timer1 = setTimeout(() => setSliderPosition(80), 300);
      const timer2 = setTimeout(() => setSliderPosition(20), 1000);
      const timer3 = setTimeout(() => setSliderPosition(50), 1800);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isInView]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  const handleStart = (clientX: number, isTouch: boolean) => {
    isDragging.current = true;
    handleMove(clientX);
    
    if (isTouch) {
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  };

  const beforeItems = [
    { text: 'Endless WhatsApp groups & notification overload', icon: <MessageSquare size={16} /> },
    { text: 'Manual, error-prone attendance sheets', icon: <FileSpreadsheet size={16} /> },
    { text: 'Spreadsheet overload & fragmented logs', icon: <FileSpreadsheet size={16} /> },
    { text: 'Missed deadlines & uncoordinated tasks', icon: <Clock size={16} /> },
    { text: 'Scattered information across multiple apps', icon: <AlertCircle size={16} /> },
  ];

  const afterItems = [
    { text: 'Real-time, automated attendance tracking', icon: <QrCode size={16} /> },
    { text: 'Centralized member management platform', icon: <CheckCircle2 size={16} /> },
    { text: 'Automated club performance reports', icon: <Sparkles size={16} /> },
    { text: 'Actionable insight dashboards', icon: <TrendingUp size={16} /> },
    { text: 'Better community engagement & connection', icon: <Calendar size={16} /> },
  ];

  return (
    <section id="features" className="relative w-full py-24 bg-[#F8F9FA] overflow-hidden border-t border-zinc-200">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-panda-maroon/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-panda-maroon mb-3"
          >
            The Transformation
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-bold text-3xl md:text-5xl text-zinc-900 tracking-tight leading-tight"
          >
            Club Management Shouldn't Be Chaotic.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-zinc-600 text-base md:text-lg mt-4"
          >
            Drag the slider to witness how PANDA converts administrative overhead into a smooth, intelligent dashboard experience.
          </motion.p>
        </div>

        {/* Interactive Slider Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-[480px] md:h-[520px] rounded-3xl overflow-hidden glass border border-zinc-200 select-none cursor-ew-resize"
          onMouseDown={(e) => handleStart(e.clientX, false)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, true)}
        >
          {/* Left Panel: Chaos (Before) */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-50 to-orange-50/70">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute top-8 left-8 z-20">
              <span className="px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
                Before PANDA
              </span>
            </div>
            
            {/* Chaos Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-md md:max-w-xl text-left">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading font-bold text-2xl md:text-4xl text-red-800 mb-6"
              >
                Scattered & Inefficient
              </motion.h3>
              <ul className="flex flex-col gap-4">
                {beforeItems.map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-center gap-3 text-zinc-650 text-sm md:text-base bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-red-200"
                  >
                    <span className="text-red-500 shrink-0">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel: Clarity (After) - Clipped by Slider Position */}
          <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-50/50 via-zinc-100/50 to-zinc-50 overflow-hidden"
            style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
          >
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute top-8 right-8 z-20">
              <span className="px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-panda-maroon text-xs font-bold uppercase tracking-wider">
                After PANDA
              </span>
            </div>

            {/* Clarity Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-end text-right px-6 md:px-16 ml-auto max-w-md md:max-w-xl">
              <motion.h3
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading font-bold text-2xl md:text-4xl text-zinc-900 mb-6"
              >
                Intelligent & Automated
              </motion.h3>
              <ul className="flex flex-col gap-4 items-end">
                {afterItems.map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    className="flex items-center gap-3 text-zinc-800 text-sm md:text-base bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-panda-maroon/15 shadow-sm flex-row-reverse"
                  >
                    <span className="text-panda-maroon shrink-0">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-panda-maroon to-panda-gray z-30"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-panda-maroon flex items-center justify-center shadow-md z-30">
              <div className="flex gap-1">
                <span className="w-1 h-3 bg-panda-maroon rounded-full" />
                <span className="w-1 h-3 bg-panda-gray rounded-full" />
              </div>
            </div>
            {/* Visual glow lines */}
            <div className="absolute inset-0 w-8 -left-4 bg-gradient-to-r from-panda-maroon/0 via-panda-maroon/5 to-panda-maroon/0 filter blur-sm pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};
