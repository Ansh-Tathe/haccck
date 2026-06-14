import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  club: string;
  avatarColor: string;
  avatarText: string;
}

export const Testimonials: React.FC = () => {
  const list: TestimonialItem[] = [
    {
      quote: "PANDA completely changed how we run ACM. Roster syncs, attendance charts, and dynamic report logs are done automatically. We saved 5 hours of paperwork every single week.",
      name: "Sarah Chen",
      role: "Club President",
      club: "ACM Student Chapter",
      avatarColor: "#8B0000",
      avatarText: "SC",
    },
    {
      quote: "Our robotics workshop check-ins went from a messy spreadsheet bottleneck to a 200ms scan check. The GPS verification is genius — no more cheating or proxy scans.",
      name: "Liam Rodriguez",
      role: "Event Coordinator",
      club: "Robotics Design Lab",
      avatarColor: "#8E8E93",
      avatarText: "LR",
    },
    {
      quote: "As a student volunteer, manually marking attendance was a nightmare. PANDA lets us generate one QR code for check-in and check-out, and stats update live on the dashboard.",
      name: "Aaliyah Jackson",
      role: "Student Volunteer",
      club: "Women in Tech",
      avatarColor: "#8B0000",
      avatarText: "AJ",
    },
    {
      quote: "Deans love the AI-generated summaries PANDA exports. Funding requests that used to require massive spreadsheet audits are now validated and sent with one click.",
      name: "Emily Watson",
      role: "Club President",
      club: "Fintech Society",
      avatarColor: "#8E8E93",
      avatarText: "EW",
    },
    {
      quote: "The leaderboard gamification is a massive engagement hack! ACM members actively attend events just to level up on the scoreboard. Turnout is up 32%.",
      name: "Tyler Kim",
      role: "Event Coordinator",
      club: "Developer Syndicate",
      avatarColor: "#8B0000",
      avatarText: "TK",
    },
    {
      quote: "PANDA gives our volunteering drives true attendance integrity. Deans and sponsors trust our records completely, making grant applications a breeze.",
      name: "Marcus Aurelius",
      role: "Student Volunteer",
      club: "Social Service Union",
      avatarColor: "#8E8E93",
      avatarText: "MA",
    },
  ];

  // Duplicate the list to create a seamless looping marquee effect
  const doubleList = [...list, ...list];

  return (
    <section id="reports" className="relative w-full py-24 bg-[#F8F9FA] overflow-hidden border-t border-zinc-200">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-panda-maroon/5 rounded-full blur-[180px] pointer-events-none" />
 
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-panda-maroon mb-3 block"
          >
            Endorsements
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-bold text-3xl md:text-5xl text-zinc-900 tracking-tight leading-tight"
          >
            Loved by Students.{' '}
            <span className="gradient-text">Trusted by Deans.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-zinc-650 text-base md:text-lg mt-4"
          >
            See how student clubs are scaling turnout and removing administrative fatigue.
          </motion.p>
        </div>
      </div>

      {/* Infinite Horizontal Scroll Track */}
      <div className="relative w-full overflow-hidden flex items-center py-4 mask-edges pointer-events-auto">
        {/* Left/Right fades to cover edge limits */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8F9FA] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8F9FA] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max marquee-track hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
          {doubleList.map((item, idx) => (
            <div 
              key={idx}
              className="w-[300px] sm:w-[360px] p-6 sm:p-8 rounded-2xl glass-card border border-zinc-200 mx-4 flex flex-col justify-between shrink-0 select-none"
            >
              <p className="font-sans text-sm text-zinc-700 italic leading-relaxed text-left mb-6">
                "{item.quote}"
              </p>
              
              <div className="flex items-center gap-3.5 border-t border-zinc-200 pt-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-heading text-xs font-bold shrink-0"
                  style={{ backgroundColor: `${item.avatarColor}10`, border: `1px solid ${item.avatarColor}30`, color: item.avatarColor }}
                >
                  {item.avatarText}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-zinc-900">{item.name}</div>
                  <div className="text-[10px] text-zinc-500">{item.role} • <span className="text-zinc-750">{item.club}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
