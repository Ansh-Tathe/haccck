import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { CalendarRange, QrCode, ScanLine, Signal, BarChart3, Brain } from 'lucide-react';

interface TimelineStep {
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  color: string;
}

// Step 01: Plan Event Visualizer
const Step01Visualizer = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-zinc-50/50">
      <div className="flex gap-2 mb-2">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            animate={{ scale: i === 2 ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
            className={`w-14 h-14 rounded-lg border flex flex-col justify-between p-1.5 ${
              i === 2 ? 'border-panda-maroon bg-white shadow-sm' : 'border-zinc-200 bg-white'
            }`}
          >
            <span className="text-[8px] text-zinc-400 font-sans font-semibold">June 1{i}</span>
            <div className={`h-2 rounded ${i === 2 ? 'bg-panda-maroon/20' : 'bg-zinc-100'}`} />
            <div className={`h-1.5 w-2/3 rounded ${i === 2 ? 'bg-panda-maroon' : 'bg-zinc-200'}`} />
          </motion.div>
        ))}
      </div>
      <span className="text-[9px] font-sans text-zinc-400">Scheduling workspace session...</span>
    </div>
  );
};

// Step 02: Secure QR Visualizer
const Step02Visualizer = () => {
  return (
    <div className="flex items-center justify-center w-full h-full p-4 bg-zinc-50/50 relative overflow-hidden">
      <div className="w-16 h-16 border border-zinc-200 rounded-lg p-1.5 bg-white relative flex flex-col justify-between shadow-xs">
        <div className="flex justify-between w-full h-3">
          <div className="w-3 h-3 bg-zinc-800 rounded-xs" />
          <div className="w-3 h-3 bg-zinc-800 rounded-xs" />
        </div>
        <div className="w-full flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border border-zinc-200 border-dashed rounded-xs flex flex-wrap p-0.5 gap-0.5">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-xs transition-colors duration-500 ${
                  (idx + Math.floor(Date.now() / 1000)) % 3 === 0 ? 'bg-zinc-800' : 'bg-transparent'
                }`} 
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between w-full h-3">
          <div className="w-3 h-3 bg-zinc-800 rounded-xs" />
          <div className="w-1.5 h-1.5 bg-zinc-800 self-end rounded-xs" />
        </div>
        <motion.div 
          animate={{ y: [0, 52, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[2px] bg-panda-maroon shadow-[0_0_8px_#8B0000]" 
        />
      </div>
      <div className="absolute right-4 text-[8px] font-mono text-zinc-450 flex flex-col gap-0.5 leading-none">
        <span>HASH: 0x8b9...</span>
        <span>LAT: 37.7749</span>
        <span>LNG: -122.4194</span>
      </div>
    </div>
  );
};

// Step 03: Check In Visualizer
const Step03Visualizer = () => {
  return (
    <div className="flex items-center justify-center w-full h-full p-4 bg-zinc-50/50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-56 p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 flex items-center gap-3"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs shrink-0 font-bold">
          ✓
        </div>
        <div className="text-left">
          <p className="text-[9px] text-emerald-850 font-bold leading-none uppercase tracking-wider">Scan Verified</p>
          <p className="text-[11px] text-zinc-900 font-sans font-semibold mt-1">Ansh C. checked in</p>
          <p className="text-[8px] text-zinc-400">Precision Latency: 142ms</p>
        </div>
      </motion.div>
    </div>
  );
};

// Step 04: Live Sync Visualizer
const Step04Visualizer = () => {
  return (
    <div className="w-full h-full p-3 bg-zinc-50/50 flex flex-col justify-start relative overflow-hidden text-left">
      <div className="text-[9px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Live Check-in Ticker</div>
      <div className="flex flex-col gap-1">
        {[
          { name: 'Sarah Chen', time: '12:23:41 PM', status: 'Attendee' },
          { name: 'Vikram Patel', time: '12:23:18 PM', status: 'Officer' },
          { name: 'Ansh C.', time: '12:22:55 PM', status: 'Member' }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1 - idx * 0.25, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex justify-between items-center bg-white border border-zinc-200/80 px-2.5 py-1.5 rounded-lg text-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-zinc-800 text-[10px]">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-zinc-450">{item.time}</span>
              <span className="text-[7px] font-bold uppercase px-1 py-0.5 rounded bg-zinc-100 text-zinc-500 scale-90">{item.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Step 05: Analytics Visualizer
const Step05Visualizer = () => {
  return (
    <div className="w-full h-full p-3 bg-zinc-50/50 flex flex-col justify-between">
      <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase">
        <span>Retention Analysis</span>
        <span className="text-panda-maroon font-bold">+28% this semester</span>
      </div>
      <div className="flex items-end justify-between h-14 px-2">
        {[30, 45, 35, 60, 50, 75, 92].map((height, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
            className={`w-3.5 rounded-t-xs relative ${
              i === 6 ? 'bg-panda-maroon shadow-xs shadow-panda-maroon/20' : 'bg-zinc-200'
            }`}
          >
            {i === 6 && (
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 left-0.5 w-1.5 h-1.5 rounded-full bg-panda-maroon border border-white" 
              />
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-[8px] text-zinc-450 px-1 font-sans">
        <span>Wk 1</span>
        <span>Wk 2</span>
        <span>Wk 3</span>
        <span>Wk 4</span>
        <span>Wk 5</span>
        <span>Wk 6</span>
        <span>Wk 7</span>
      </div>
    </div>
  );
};

// Step 06: AI Reports Visualizer
const Step06Visualizer = () => {
  return (
    <div className="w-full h-full p-4 bg-zinc-50/50 flex flex-col justify-between text-left">
      <div className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Synthesizing Monthly Insight...</div>
      <div className="space-y-1.5 flex-grow mt-1">
        <motion.div 
          animate={{ width: ['40%', '90%', '40%'] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="h-2 rounded bg-zinc-800" 
        />
        <motion.div 
          animate={{ width: ['20%', '75%', '20%'] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
          className="h-2 rounded bg-zinc-400" 
        />
        <motion.div 
          animate={{ width: ['10%', '60%', '10%'] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.4 }}
          className="h-2 rounded bg-zinc-200" 
        />
      </div>
      <div className="flex items-center justify-between text-[8px] text-zinc-500 font-sans mt-2 pt-1.5 border-t border-zinc-200/40">
        <span>PANDA_Analytics_Report.pdf</span>
        <span className="font-bold text-panda-maroon">Exporting 100%</span>
      </div>
    </div>
  );
};

export const ScrollytellingTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progression through the 250vh scroll block
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollSpring = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [radius, setRadius] = useState(135);

  // Map scroll progress (0 to 1) directly to dial rotation (0 to -300 degrees)
  const rotationAngle = useTransform(scrollSpring, [0, 1], [0, -300]);
  const counterRotationAngle = useTransform(scrollSpring, [0, 1], [0, 300]);

  // Update active index based on scroll value
  useEffect(() => {
    return scrollYProgress.onChange((val) => {
      const idx = Math.min(5, Math.max(0, Math.round(val * 5)));
      setActiveStepIndex(idx);
    });
  }, [scrollYProgress]);

  // Adjust circular dial radius responsively
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setRadius(90);
      } else {
        setRadius(135);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const steps: TimelineStep[] = [
    {
      title: '1. Plan Event',
      description: 'Define coordinators, set schedules, book venues, and allocate gamification rewards seamlessly in the builder.',
      badge: 'Step 01: Setup',
      icon: <CalendarRange size={18} />,
      color: '#8B0000', // Maroon
    },
    {
      title: '2. Generate Secure QR',
      description: 'Creates a dynamic, encrypted check-in code. Validates location fences and rotates hashes to prevent attendance spoofing.',
      badge: 'Step 02: Secure',
      icon: <QrCode size={18} />,
      color: '#4F8CFF', // Blue
    },
    {
      title: '3. Members Check In',
      description: 'Students scan with a smartphone camera. Verification processes complete instantly in less than 200 milliseconds.',
      badge: 'Step 03: Execute',
      icon: <ScanLine size={18} />,
      color: '#8B0000',
    },
    {
      title: '4. Attendance Updates Live',
      description: 'Roster statuses automatically switch to checked-in. Live tickers show current metrics to organizers in real-time.',
      badge: 'Step 04: Sync',
      icon: <Signal size={18} />,
      color: '#4F8CFF',
    },
    {
      title: '5. Analytics Are Generated',
      description: 'Calculates active rates, engagement scores, retention profiles, and increments member scoreboard ranking curves.',
      badge: 'Step 05: Analyze',
      icon: <BarChart3 size={18} />,
      color: '#8B0000',
    },
    {
      title: '6. AI Creates Reports',
      description: 'Auto-compiles monthly reports. Formats compliance profiles, growth decks, and funding logs with a single click.',
      badge: 'Step 06: Automate',
      icon: <Brain size={18} />,
      color: '#4F8CFF',
    },
  ];

  // Smooth scroll page to correct percentage location when clicking a step node
  const handleNodeClick = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollRange = container.offsetHeight - window.innerHeight;
    const targetScrollTop = container.offsetTop + (index / 5) * scrollRange;
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  };

  const activeStep = steps[activeStepIndex];

  return (
    <div ref={containerRef} className="relative h-[220vh] bg-[#F8F9FA]">
      
      {/* Sticky viewport content */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-12 lg:py-16">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-panda-maroon mb-2 block">
            Product Journey
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-zinc-900 tracking-tight leading-tight">
            How PANDA Works.
          </h2>
          <p className="font-sans text-zinc-500 text-sm md:text-base mt-2">
            Scroll down or click nodes to spin through PANDA's automated workflow.
          </p>
        </div>

        {/* Dynamic Split Gallery */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-grow">
          
          {/* Left Column: Rotating Dial (Desktop/Mobile unified) */}
          <div className="lg:col-span-6 flex justify-center items-center relative h-[240px] md:h-[280px] lg:h-[400px]">
            {/* Background glowing rings */}
            <div className="absolute w-48 h-48 lg:w-72 lg:h-72 rounded-full border border-zinc-200/50 pointer-events-none" />
            <div className="absolute w-64 h-64 lg:w-96 lg:h-96 rounded-full border border-dashed border-zinc-200/30 pointer-events-none" />
            
            {/* The main rotating circular dial */}
            <motion.div 
              style={{ rotate: rotationAngle }}
              className="w-56 h-56 lg:w-80 lg:h-80 rounded-full border border-zinc-200 bg-white/45 backdrop-blur-md shadow-sm relative flex items-center justify-center shrink-0"
            >
              {/* Central Panda Branding Core */}
              <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-zinc-900 flex flex-col items-center justify-center text-white shadow-lg pointer-events-none relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-white/10 to-transparent pointer-events-none" />
                <span className="font-heading text-xs lg:text-sm font-bold tracking-widest text-white/90">PANDA</span>
                <span className="text-[7px] lg:text-[8px] font-mono tracking-wider text-panda-maroon font-bold uppercase mt-0.5">Core OS</span>
              </div>

              {/* Distributed Nodes */}
              {steps.map((step, idx) => {
                const angle = (idx * 60 * Math.PI) / 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isActive = idx === activeStepIndex;

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleNodeClick(idx)}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      x: '-50%',
                      y: '-50%',
                      rotate: counterRotationAngle
                    }}
                    className={`absolute w-11 h-11 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs border cursor-pointer ${
                      isActive 
                        ? 'bg-white border-zinc-900 text-zinc-900 scale-110 shadow-md ring-4 ring-zinc-900/5' 
                        : 'bg-[#F8F9FA]/90 border-zinc-200 text-zinc-400 hover:border-zinc-350 hover:bg-white'
                    }`}
                  >
                    {isActive ? (
                      <span className="text-zinc-900">{step.icon}</span>
                    ) : (
                      <span className="text-zinc-400 transition-colors duration-200">{step.icon}</span>
                    )}
                    {isActive && (
                      <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-panda-maroon opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-panda-maroon"></span>
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Active Card Details (Framer Motion slide/fade-in) */}
          <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:mx-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStepIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 lg:p-8 rounded-2xl border border-zinc-200/80 bg-white shadow-sm flex flex-col gap-5 text-left relative overflow-hidden"
              >
                {/* Visual Accent Badge */}
                <div 
                  className="absolute top-0 left-0 w-2 h-full"
                  style={{ backgroundColor: activeStep.color }}
                />

                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl text-white shadow-sm shrink-0"
                    style={{ backgroundColor: activeStep.color }}
                  >
                    {activeStep.icon}
                  </div>
                  <div>
                    <span 
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${activeStep.color}15`, color: activeStep.color }}
                    >
                      {activeStep.badge}
                    </span>
                    <h3 className="font-heading font-bold text-lg md:text-xl text-zinc-900 mt-1.5 leading-tight">
                      {activeStep.title}
                    </h3>
                  </div>
                </div>

                <p className="font-sans text-xs md:text-sm text-zinc-550 leading-relaxed">
                  {activeStep.description}
                </p>

                {/* Specific Live Visualizer Mockup */}
                <div className="mt-2 w-full h-32 rounded-xl bg-[#F8F9FA] border border-zinc-200/60 overflow-hidden relative flex items-center justify-center">
                  {activeStepIndex === 0 && <Step01Visualizer />}
                  {activeStepIndex === 1 && <Step02Visualizer />}
                  {activeStepIndex === 2 && <Step03Visualizer />}
                  {activeStepIndex === 3 && <Step04Visualizer />}
                  {activeStepIndex === 4 && <Step05Visualizer />}
                  {activeStepIndex === 5 && <Step06Visualizer />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Footer/Navigation Assist Indicator */}
        <div className="text-center text-[10px] text-zinc-400 font-mono tracking-widest uppercase">
          Stage {activeStepIndex + 1} of 6 — PANDA Flow Engine
        </div>

      </div>
    </div>
  );
};
