import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureItem {
  number: string;
  title: string;
  description: string;
  details: string[];
  color: string;
}

// 1. Dynamic SVG Visualizers for each Core Capability (Minimalist & spacious design)
const Visualizer: React.FC<{ index: number }> = ({ index }) => {
  switch (index) {
    case 0: // Smart Attendance
      return (
        <motion.svg
          key="attendance"
          initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.92, rotate: 3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewBox="0 0 400 400"
          className="w-full max-w-[280px] md:max-w-[320px] h-auto mx-auto drop-shadow-xl"
        >
          {/* Outer Ring */}
          <circle cx="200" cy="200" r="160" fill="none" stroke="#E4E4E7" strokeWidth="1" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="#8B0000" strokeWidth="1.5" strokeDasharray="10 15" className="animate-spin" style={{ animationDuration: '60s' }} />

          {/* Ticket Outline */}
          <rect x="130" y="110" width="140" height="180" rx="16" fill="white" stroke="#E4E4E7" strokeWidth="1.5" />
          
          {/* Simulated QR Code Elements */}
          <g fill="#18181B" opacity="0.85">
            <rect x="150" y="130" width="30" height="30" rx="4" />
            <rect x="220" y="130" width="30" height="30" rx="4" />
            <rect x="150" y="200" width="30" height="30" rx="4" />
            {/* Inner QR patterns */}
            <rect x="195" y="140" width="10" height="40" rx="2" />
            <rect x="195" y="190" width="55" height="10" rx="2" />
            <rect x="220" y="215" width="20" height="20" rx="2" />
          </g>

          {/* Glowing check-in scanner line */}
          <motion.line
            x1="120"
            y1="110"
            x2="280"
            y2="110"
            stroke="#8B0000"
            strokeWidth="3.5"
            strokeLinecap="round"
            animate={{ y: [20, 160, 20] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
      );

    case 1: // Member Management
      return (
        <motion.svg
          key="members"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.5 }}
          viewBox="0 0 400 400"
          className="w-full max-w-[280px] md:max-w-[320px] h-auto mx-auto"
        >
          {/* Central concentric loops */}
          <circle cx="200" cy="200" r="140" fill="none" stroke="#E4E4E7" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#E4E4E7" strokeWidth="1" />

          {/* Central active member node */}
          <circle cx="200" cy="200" r="24" fill="white" stroke="#8B0000" strokeWidth="2" />
          <circle cx="200" cy="200" r="10" fill="#8B0000" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="200" cy="200" r="6" fill="#8B0000" />

          {/* Branching Roster Nodes */}
          <g>
            {/* Node 1 */}
            <line x1="200" y1="200" x2="110" y2="130" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="110" cy="130" r="14" fill="white" stroke="#8E8E93" strokeWidth="1.5" />
            <circle cx="110" cy="130" r="4" fill="#8E8E93" />
            {/* Node 2 */}
            <line x1="200" y1="200" x2="290" y2="130" stroke="#8E8E93" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="290" cy="130" r="14" fill="white" stroke="#8E8E93" strokeWidth="1.5" />
            <circle cx="290" cy="130" r="4" fill="#8E8E93" />
            {/* Node 3 */}
            <line x1="200" y1="200" x2="200" y2="310" stroke="#8B0000" strokeWidth="1.5" />
            <circle cx="200" cy="310" r="16" fill="white" stroke="#8B0000" strokeWidth="2" />
            <circle cx="200" cy="310" r="6" fill="#8B0000" className="animate-pulse" />
          </g>
        </motion.svg>
      );

    case 2: // Analytics Dashboard
      return (
        <motion.svg
          key="analytics"
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -10 }}
          transition={{ duration: 0.5 }}
          viewBox="0 0 400 400"
          className="w-full max-w-[280px] md:max-w-[320px] h-auto mx-auto"
        >
          {/* Axis Borders */}
          <line x1="80" y1="280" x2="320" y2="280" stroke="#E4E4E7" strokeWidth="1.5" />
          <line x1="80" y1="120" x2="80" y2="280" stroke="#E4E4E7" strokeWidth="1.5" />

          {/* Grid lines */}
          <line x1="80" y1="230" x2="320" y2="230" stroke="#F4F4F5" strokeWidth="1" />
          <line x1="80" y1="180" x2="320" y2="180" stroke="#F4F4F5" strokeWidth="1" />
          <line x1="80" y1="130" x2="320" y2="130" stroke="#F4F4F5" strokeWidth="1" />

          {/* Analytics line graph */}
          <motion.path
            d="M 80,240 Q 140,210 200,150 T 320,130"
            fill="none"
            stroke="#8B0000"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Pulse node targets */}
          <circle cx="200" cy="150" r="5" fill="#8B0000" />
          <circle cx="200" cy="150" r="12" fill="none" stroke="#8B0000" strokeWidth="1" className="animate-ping" style={{ animationDuration: '3s' }} />

          <circle cx="320" cy="130" r="5" fill="#8B0000" />

          {/* Dynamic bar charts behind */}
          <rect x="100" y="200" width="20" height="80" rx="3" fill="#E4E4E7" opacity="0.5" />
          <rect x="160" y="170" width="20" height="110" rx="3" fill="#8B0000" opacity="0.08" />
          <rect x="220" y="220" width="20" height="60" rx="3" fill="#E4E4E7" opacity="0.5" />
          <rect x="280" y="150" width="20" height="130" rx="3" fill="#8E8E93" opacity="0.4" />
        </motion.svg>
      );

    case 3: // Event Management
      return (
        <motion.svg
          key="events"
          initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.92, rotate: -3 }}
          transition={{ duration: 0.5 }}
          viewBox="0 0 400 400"
          className="w-full max-w-[280px] md:max-w-[320px] h-auto mx-auto"
        >
          {/* Calendar grid border outline */}
          <rect x="90" y="90" width="220" height="220" rx="20" fill="white" stroke="#E4E4E7" strokeWidth="1.5" />
          
          {/* Grid lines */}
          <line x1="90" y1="145" x2="310" y2="145" stroke="#E4E4E7" strokeWidth="1" />
          <line x1="90" y1="200" x2="310" y2="200" stroke="#E4E4E7" strokeWidth="1" />
          <line x1="90" y1="255" x2="310" y2="255" stroke="#E4E4E7" strokeWidth="1" />
          
          <line x1="145" y1="90" x2="145" y2="310" stroke="#E4E4E7" strokeWidth="1" />
          <line x1="200" y1="90" x2="200" y2="310" stroke="#E4E4E7" strokeWidth="1" />
          <line x1="255" y1="90" x2="255" y2="310" stroke="#E4E4E7" strokeWidth="1" />

          {/* Active Highlight Event Slot */}
          <rect x="202" y="147" width="51" height="51" rx="8" fill="#8B0000" opacity="0.12" />
          <rect x="212" y="157" width="31" height="31" rx="6" fill="#8B0000" className="animate-pulse" />

          {/* Floating clock pointer */}
          <circle cx="218" cy="235" r="14" fill="white" stroke="#8E8E93" strokeWidth="1.5" />
          <line x1="218" y1="235" x2="218" y2="227" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="218" y1="235" x2="225" y2="235" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>
      );

    case 4: // AI Reports
      return (
        <motion.svg
          key="ai-reports"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.5 }}
          viewBox="0 0 400 400"
          className="w-full max-w-[280px] md:max-w-[320px] h-auto mx-auto"
        >
          {/* Neural mesh network */}
          <g opacity="0.3">
            <line x1="110" y1="150" x2="200" y2="100" stroke="#8E8E93" strokeWidth="1" />
            <line x1="290" y1="150" x2="200" y2="100" stroke="#8E8E93" strokeWidth="1" />
            <line x1="110" y1="250" x2="200" y2="300" stroke="#8E8E93" strokeWidth="1" />
            <line x1="290" y1="250" x2="200" y2="300" stroke="#8E8E93" strokeWidth="1" />
            
            <line x1="110" y1="150" x2="110" y2="250" stroke="#8E8E93" strokeWidth="1" />
            <line x1="290" y1="150" x2="290" y2="250" stroke="#8E8E93" strokeWidth="1" />
            
            <line x1="110" y1="150" x2="290" y2="250" stroke="#8E8E93" strokeWidth="1" />
            <line x1="290" y1="150" x2="110" y2="250" stroke="#8E8E93" strokeWidth="1" />
          </g>

          {/* Concentric neural pathway line loops */}
          <circle cx="200" cy="200" r="90" fill="none" stroke="#8B0000" strokeWidth="1" strokeDasharray="6 8" className="animate-spin" style={{ animationDuration: '40s' }} />

          {/* Central AI node */}
          <circle cx="200" cy="200" r="32" fill="white" stroke="#8B0000" strokeWidth="2.5" />
          <circle cx="200" cy="200" r="14" fill="#8B0000" opacity="0.1" className="animate-ping" style={{ animationDuration: '4s' }} />
          
          {/* AI core symbol */}
          <polygon points="200,190 208,200 200,210 192,200" fill="#8B0000" />
          
          {/* Pulse nodes around periphery */}
          <circle cx="200" cy="100" r="6" fill="#8B0000" className="animate-pulse" />
          <circle cx="200" cy="300" r="6" fill="#8E8E93" />
          <circle cx="110" cy="150" r="5" fill="#8E8E93" />
          <circle cx="290" cy="250" r="5" fill="#8B0000" />
        </motion.svg>
      );

    case 5: // Gamification
      return (
        <motion.svg
          key="rewards"
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -15 }}
          transition={{ duration: 0.5 }}
          viewBox="0 0 400 400"
          className="w-full max-w-[280px] md:max-w-[320px] h-auto mx-auto"
        >
          {/* Concentric loops */}
          <circle cx="200" cy="180" r="110" fill="none" stroke="#E4E4E7" strokeWidth="1" />
          <circle cx="200" cy="180" r="110" fill="none" stroke="#8B0000" strokeWidth="1.5" strokeDasharray="30 40" className="animate-spin" style={{ animationDuration: '50s' }} />

          {/* Golden Shield outline */}
          <path d="M 200,100 L 255,125 V 200 C 255,245 200,270 200,270 C 200,270 145,245 145,200 V 125 Z" fill="white" stroke="#8B0000" strokeWidth="2.5" />
          
          {/* Central Star */}
          <polygon points="200,140 206,160 225,160 210,172 216,192 200,180 184,192 190,172 175,160 194,160" fill="#8B0000" className="animate-pulse" />

          {/* Floating XP numbers floating up */}
          <motion.text
            x="200"
            y="295"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Space Grotesk"
            fill="#8E8E93"
            textAnchor="middle"
            animate={{ opacity: [0, 1, 0], y: [305, 290, 290] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            +500 XP STANDING
          </motion.text>
        </motion.svg>
      );

    default:
      return null;
  }
};

export const FeaturesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const featuresList: FeatureItem[] = [
    {
      number: '01',
      title: 'Smart Attendance',
      description: 'QR-based event check-ins. Eliminate sheets and spreadsheets, logging entries in milliseconds.',
      details: ['Dynamic QR Code rotation', 'GPS validation protection', 'Offline scan sync mode'],
      color: '#8B0000',
    },
    {
      number: '02',
      title: 'Member Management',
      description: 'Track overall student participation, engagement milestones, and contribution scores.',
      details: ['Custom member fields', 'Role allocation trees', 'Active status calculations'],
      color: '#8E8E93',
    },
    {
      number: '03',
      title: 'Analytics Dashboard',
      description: 'Real-time interactive insights into your student club health and resource allocations.',
      details: ['Turnout rate charts', 'Retention correlation tables', 'Peak activity mapping'],
      color: '#8B0000',
    },
    {
      number: '04',
      title: 'Event Management',
      description: 'Plan, organize, assign tasks, and monitor events and schedules from a single workspace.',
      details: ['Co-coordinator channels', 'Google Calendar webhooks', 'Post-event feedback forms'],
      color: '#8E8E93',
    },
    {
      number: '05',
      title: 'AI Reports',
      description: 'Automatically generate monthly summaries, activity decks, and funding proposal insights.',
      details: ['Natural Language Summaries', 'PDF report exports', 'Grant application assists'],
      color: '#8B0000',
    },
    {
      number: '06',
      title: 'Gamification',
      description: 'Engage members through public leaderboards, milestone achievements, and badge systems.',
      details: ['XP reward rules', 'Top organizer badges', 'Contribution score tiers'],
      color: '#8E8E93',
    },
  ];

  return (
    <section className="relative w-full py-28 bg-[#F8F9FA] overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-panda-maroon/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-panda-maroon/[0.01] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Title Section (Premium spacing & negative space) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl text-left">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-panda-maroon mb-3 block"
            >
              Core Capabilities
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-bold text-3xl md:text-5xl text-zinc-900 tracking-tight leading-tight"
            >
              Engineered to Drive{' '}
              <span className="gradient-text">Performance and Growth.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-zinc-650 text-base max-w-sm text-left leading-relaxed"
          >
            Everything your college community needs to scale, automated and simplified into a singular premium dashboard workspace.
          </motion.p>
        </div>

        {/* Minimalist Split Showcase Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
          
          {/* Left Side: Animated Abstract Visualizer (Occupies beautiful negative space) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center min-h-[380px] md:min-h-[440px] rounded-3xl bg-zinc-50 border border-zinc-200/50 shadow-sm relative overflow-hidden group py-10">
            {/* Grid overlay for depth */}
            <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-white via-transparent to-transparent opacity-80 pointer-events-none" />

            <div className="relative z-10 w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <Visualizer index={activeIndex} />
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Vertical Accordion Typography Menu */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {featuresList.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`py-6 border-b border-zinc-200/60 text-left transition-all duration-350 cursor-pointer ${
                    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Minimal index number */}
                    <span className={`font-heading font-bold text-sm leading-none mt-1.5 transition-colors duration-300 ${
                      isActive ? 'text-panda-maroon' : 'text-zinc-400'
                    }`}>
                      {item.number}
                    </span>

                    <div className="flex-grow">
                      {/* Interactive Headline */}
                      <h3 className={`font-heading font-bold text-xl md:text-2xl transition-colors duration-300 ${
                        isActive ? 'text-zinc-900' : 'text-zinc-700'
                      }`}>
                        {item.title}
                      </h3>

                      {/* Expandable Body */}
                      <motion.div
                        initial={false}
                        animate={isActive ? { height: 'auto', opacity: 1, marginTop: 12 } : { height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p className="font-sans text-sm text-zinc-650 leading-relaxed max-w-lg mb-4">
                          {item.description}
                        </p>
                        
                        {/* Detail bullets using minimal dot nodes */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                          {item.details.map((detail, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-zinc-500 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-panda-maroon" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
