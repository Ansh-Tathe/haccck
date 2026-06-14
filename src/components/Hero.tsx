import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Users, BarChart3, Calendar, ShieldCheck } from 'lucide-react';
import LineWaves from './LineWaves';

// Sub-component for animating counters
const CounterItem: React.FC<{ value: number; suffix: string; label: string; icon: React.ReactNode }> = ({ value, suffix, label, icon }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 2000; // 2 seconds
          const startTime = performance.now();

          const updateCount = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out quad formula
            const easeProgress = progress * (2 - progress);
            setCount(Math.floor(easeProgress * (end - start) + start));

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(updateCount);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={elementRef} className="flex flex-col items-center p-6 glass-card rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-panda-maroon to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-3 bg-panda-maroon/5 rounded-xl text-panda-maroon mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="font-heading font-bold text-3xl md:text-4xl text-zinc-900 mb-1">
        {count}
        <span className="text-panda-maroon">{suffix}</span>
      </span>
      <span className="text-sm text-zinc-500 text-center font-sans">{label}</span>
    </div>
  );
};

interface HeroProps {
  onLaunchDashboard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchDashboard }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the hero section for the scrollytelling transition
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Fade out hero content as we scroll down
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#F8F9FA] pt-32 pb-16">
      {/* Background WebGL LineWaves */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-35">
        <LineWaves
          speed={0.2}
          innerLineCount={36}
          outerLineCount={40}
          warpIntensity={0.8}
          rotation={-35}
          edgeFadeWidth={0.1}
          colorCycleSpeed={0.8}
          brightness={0.8}
          color1="#8B0000"
          color2="#52525B"
          color3="#D4D4D8"
          enableMouseInteraction={true}
          mouseInfluence={1.5}
        />
      </div>


      {/* Background Radial Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-panda-maroon/[0.04] rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-panda-maroon/[0.02] rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Foreground Hero Content */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center flex-grow text-center"
      >

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-zinc-900 max-w-4xl tracking-tight leading-[1.05] mb-6"
        >
          Empowering College Clubs Through{' '}
          <span className="gradient-text">Intelligent Management.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-sans text-lg md:text-xl text-zinc-600 max-w-2xl mb-10 leading-relaxed"
        >
          Track attendance, boost engagement, automate reporting, and build stronger communities with PANDA.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 z-20"
        >
          <button
            onClick={onLaunchDashboard}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold text-sm rounded-full hover:bg-zinc-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-zinc-950/20 group cursor-pointer"
          >
            Launch Dashboard
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#demo"
            className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-zinc-50 text-zinc-850 font-bold text-sm rounded-full border border-zinc-200 hover:border-zinc-300 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
          >
            <Play size={14} fill="#27272a" className="text-zinc-800" />
            Watch Demo
          </a>
        </motion.div>
      </motion.div>

      {/* Statistics Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <CounterItem 
            value={1200} 
            suffix="+" 
            label="Members Managed" 
            icon={<Users size={20} />} 
          />
          <CounterItem 
            value={98} 
            suffix="%" 
            label="Attendance Accuracy" 
            icon={<ShieldCheck size={20} />} 
          />
          <CounterItem 
            value={250} 
            suffix="+" 
            label="Events Organized" 
            icon={<Calendar size={20} />} 
          />
          <CounterItem 
            value={3} 
            suffix="×" 
            label="Faster Reporting" 
            icon={<BarChart3 size={20} />} 
          />
        </div>
      </div>
    </div>
  );
};
