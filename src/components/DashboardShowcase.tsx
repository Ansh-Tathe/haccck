import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { 
  Calendar, Users, Award, BrainCircuit, TrendingUp, Search, Bell, CircleDot
} from 'lucide-react';

// Sample data for charts
const memberGrowthData = [
  { month: 'Jan', members: 420 },
  { month: 'Feb', members: 550 },
  { month: 'Mar', members: 710 },
  { month: 'Apr', members: 890 },
  { month: 'May', members: 1050 },
  { month: 'Jun', members: 1220 },
];

const attendanceData = [
  { event: 'Hackathon', attendance: 96 },
  { event: 'AI Workshop', attendance: 92 },
  { event: 'UX Sprint', attendance: 88 },
  { event: 'Info Night', attendance: 98 },
  { event: 'Tech Talk', attendance: 94 },
];

const leaders = [
  { name: 'Sarah Chen', role: 'President, ACM', xp: 2450, rank: 1, color: '#8B0000' },
  { name: 'Liam Rodriguez', role: 'Lead Dev, Robotics', xp: 2120, rank: 2, color: '#8E8E93' },
  { name: 'Aaliyah Jackson', role: 'Coordinator, Women in STEM', xp: 1980, rank: 3, color: '#8B0000' },
];

const timelineEvents = [
  { name: 'PANDA Integration Workshop', date: 'June 18, 5:00 PM', attendees: '85 RSVP', type: 'Workshop' },
  { name: 'Summer HackFest 2026', date: 'July 04, 9:00 AM', attendees: '340 RSVP', type: 'Competition' },
];

export const DashboardShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  // Parallax offsets
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  // AI insights typing animation mock
  const [insightText, setInsightText] = useState('');
  const fullInsight = "AI Insight: Attendance surged by 12% following the introduction of dynamic QR checkpoints. Recommended action: schedule the ACM Tech Talk for mid-week slot to optimize turnout based on historic engagement curves.";

  useEffect(() => {
    if (isInView) {
      let index = 0;
      const interval = setInterval(() => {
        setInsightText((prev) => prev + fullInsight.charAt(index));
        index++;
        if (index >= fullInsight.length) {
          clearInterval(interval);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section id="analytics" className="relative w-full py-24 bg-[#F8F9FA] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-panda-maroon/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-panda-maroon mb-3 block"
          >
            Command Center
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-bold text-3xl md:text-5xl text-zinc-900 tracking-tight leading-tight"
          >
            The Dashboard of the{' '}
            <span className="gradient-text">Next Generation.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-zinc-650 text-base md:text-lg mt-4"
          >
            Unify and automate member rosters, event metrics, and real-time leadership analytics in a gorgeous dashboard.
          </motion.p>
        </div>

        {/* Dashboard Preview Wrapper with Mouse Parallax */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-5xl mx-auto rounded-3xl p-3 md:p-6 bg-white/60 border border-zinc-200 backdrop-blur-xl transition-all duration-300 shadow-2xl shadow-panda-maroon/5"
        >
          {/* Parallaxing Background Glow */}
          <div
            style={{
              transform: `translate(${coords.x * -25}px, ${coords.y * -25}px)`,
              transition: isHovered ? 'none' : 'transform 0.5s ease-out',
            }}
            className="absolute inset-0 bg-gradient-to-tr from-panda-maroon/5 to-panda-gray/5 blur-xl rounded-3xl opacity-50 -z-10"
          />

          {/* Interactive Dashboard Frame */}
          <motion.div
            style={{
              transform: `translate(${coords.x * 12}px, ${coords.y * 12}px)`,
              transition: isHovered ? 'none' : 'transform 0.5s ease-out',
            }}
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row h-auto md:h-[650px] shadow-2xl"
          >
            {/* 1. Sidebar Nav */}
            <div className="w-full md:w-56 border-r border-white/5 bg-[#0F0F0F] p-5 flex flex-col justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-panda-maroon to-panda-gray flex items-center justify-center font-heading text-xs font-bold text-white">
                    P
                  </div>
                  <span className="font-heading font-bold text-sm text-white tracking-wider">PANDA OS</span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg text-white text-xs font-semibold">
                    <CircleDot size={14} className="text-panda-maroon" />
                    <span>Overview</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white rounded-lg text-xs font-medium transition-colors">
                    <Users size={14} />
                    <span>Members</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white rounded-lg text-xs font-medium transition-colors">
                    <Calendar size={14} />
                    <span>Events</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white rounded-lg text-xs font-medium transition-colors">
                    <Award size={14} />
                    <span>Gamification</span>
                  </div>
                </div>
              </div>

              {/* Bottom Organization Details */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 mt-8 md:mt-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] text-white/60 font-semibold uppercase">Workspace Live</span>
                </div>
                <div className="text-xs font-bold text-white truncate">Valkyrie Computing</div>
              </div>
            </div>

            {/* 2. Main Dashboard Section */}
            <div className="flex-grow flex flex-col overflow-y-auto">
              
              {/* Header Bar */}
              <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 gap-4">
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/50 text-xs w-48 md:w-64">
                  <Search size={12} />
                  <span className="truncate">Search commands, logs...</span>
                </div>
                <div className="flex items-center gap-4 text-white/70">
                  <Bell size={15} className="hover:text-white cursor-pointer" />
                  <div className="h-4 w-[1px] bg-white/10" />
                  <div className="w-7 h-7 rounded-full bg-panda-maroon/20 border border-panda-maroon/40 flex items-center justify-center text-[10px] font-bold text-panda-maroon">
                    AS
                  </div>
                </div>
              </div>

              {/* Dashboard Content Container */}
              <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                
                {/* Stats Cards Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-white/5 bg-[#0F0F0F] relative overflow-hidden group">
                    <div className="text-[10px] uppercase font-bold text-white/40 mb-1">Active Rate</div>
                    <div className="text-lg md:text-xl font-heading font-bold text-white">88.4%</div>
                    <span className="text-[9px] text-green-400 font-semibold flex items-center gap-0.5 mt-1">
                      +4.2% <TrendingUp size={8} />
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-[#0F0F0F] relative overflow-hidden group">
                    <div className="text-[10px] uppercase font-bold text-white/40 mb-1">Total RSVP</div>
                    <div className="text-lg md:text-xl font-heading font-bold text-white">1,480</div>
                    <span className="text-[9px] text-panda-maroon font-semibold flex items-center gap-0.5 mt-1">
                      12 upcoming
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-[#0F0F0F] relative overflow-hidden group">
                    <div className="text-[10px] uppercase font-bold text-white/40 mb-1">AI Reports</div>
                    <div className="text-lg md:text-xl font-heading font-bold text-white">18</div>
                    <span className="text-[9px] text-panda-gray font-semibold flex items-center gap-0.5 mt-1">
                      Generated
                    </span>
                  </div>
                </div>

                {/* AI generated insights bar (Typing mockup) */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-panda-maroon/10 to-panda-gray/10 border border-panda-maroon/20 flex items-start gap-3 relative overflow-hidden">
                  <BrainCircuit size={18} className="text-panda-maroon shrink-0 mt-0.5" />
                  <div className="text-xs font-sans text-white/80 leading-relaxed font-medium">
                    {insightText}
                    <span className="inline-block w-1.5 h-3 ml-1 bg-white animate-pulse" />
                  </div>
                </div>

                {/* Grid charts and Leaderboards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left Chart column */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Line Chart card */}
                    <div className="p-5 rounded-xl border border-white/5 bg-[#0F0F0F] flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white tracking-wide">Member Acquisition</span>
                        <span className="text-[10px] text-white/40 font-mono">Last 6 Months</span>
                      </div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={memberGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="month" stroke="#555" fontSize={10} tickLine={false} />
                            <YAxis stroke="#555" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }} />
                            <Line type="monotone" dataKey="members" stroke="#8B0000" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bar Chart card */}
                    <div className="p-5 rounded-xl border border-white/5 bg-[#0F0F0F] flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white tracking-wide">Event Turnout Rates (%)</span>
                        <span className="text-[10px] text-white/40 font-mono">Top Seminars</span>
                      </div>
                      <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={attendanceData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="event" stroke="#555" fontSize={9} tickLine={false} />
                            <YAxis stroke="#555" fontSize={10} tickLine={false} domain={[60, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }} />
                            <Bar dataKey="attendance" fill="#8E8E93" radius={[4, 4, 0, 0]} maxBarSize={28} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar columns */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Leaderboard Card */}
                    <div className="p-5 rounded-xl border border-white/5 bg-[#0F0F0F]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-white tracking-wide">Top Contributors</span>
                        <Award size={14} className="text-panda-maroon" />
                      </div>
                      <div className="flex flex-col gap-3">
                        {leaders.map((leader, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{ backgroundColor: `${leader.color}15`, border: `1px solid ${leader.color}30`, color: leader.color }}
                              >
                                #{leader.rank}
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-bold text-white truncate max-w-32">{leader.name}</div>
                                <div className="text-[9px] text-white/40 truncate max-w-32">{leader.role}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-white">{leader.xp}</span>
                              <span className="text-[8px] text-white/40 font-mono block">XP</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Card */}
                    <div className="p-5 rounded-xl border border-white/5 bg-[#0F0F0F]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-white tracking-wide">Timeline</span>
                        <Calendar size={14} className="text-panda-maroon" />
                      </div>
                      <div className="flex flex-col gap-3.5">
                        {timelineEvents.map((ev, i) => (
                          <div key={i} className="border-l-2 border-panda-maroon/30 pl-3 text-left">
                            <div className="text-xs font-bold text-white truncate">{ev.name}</div>
                            <div className="text-[9px] text-white/50 font-mono mt-0.5">{ev.date}</div>
                            <div className="inline-block px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] text-panda-maroon font-semibold mt-1">
                              {ev.type}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};
