import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Flame, Zap } from 'lucide-react';

// Card with localized particle animation
const ParticleCard: React.FC<{ title: string; desc: string; badge: string; icon: React.ReactNode; color: string }> = ({
  title,
  desc,
  badge,
  icon,
  color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vy: number;
      alpha: number;
      decay: number;
    }> = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Randomly spawn a particle
      if (Math.random() < 0.15 && particles.length < 25) {
        particles.push({
          x: Math.random() * width,
          y: height + 5,
          size: Math.random() * 2 + 1,
          vy: -(Math.random() * 0.8 + 0.3),
          alpha: Math.random() * 0.7 + 0.3,
          decay: Math.random() * 0.005 + 0.003,
        });
      }

      // Update and draw
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color]);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl p-6 glass-card overflow-hidden flex flex-col justify-between h-56 border border-zinc-200/80"
    >
      {/* Background Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Glow Effect */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${color}10`, color: color }}
          >
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{badge}</span>
        </div>
        <h3 className="font-heading font-bold text-base text-zinc-900 text-left mb-1.5">{title}</h3>
        <p className="font-sans text-xs text-zinc-500 leading-relaxed text-left">{desc}</p>
      </div>

      <div className="relative z-10 text-left border-t border-zinc-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-zinc-500">
        <span>Milestone Tier</span>
        <span className="font-bold uppercase" style={{ color: color }}>Active</span>
      </div>
    </motion.div>
  );
};

export const GamificationSection: React.FC = () => {
  const achievements = [
    {
      title: 'Event Maestro',
      desc: 'Organized and completed 5+ events with a turnout rate over 90%. Unlock special badge.',
      badge: 'Gold Tier',
      icon: <Flame size={18} />,
      color: '#8B0000',
    },
    {
      title: 'Consistency Star',
      desc: 'Achieved a perfect 100% attendance rate for a full academic semester. Earn 500 XP.',
      badge: 'Platinum Tier',
      icon: <Trophy size={18} />,
      color: '#8E8E93',
    },
    {
      title: 'Top Dev Catalyst',
      desc: 'Contributed to the codebase or organized advanced technical development hackathons.',
      badge: 'Special Edition',
      icon: <Zap size={18} />,
      color: '#8B0000',
    },
  ];

  const leaderboardMembers = [
    { name: 'Sarah Chen', role: 'ACM Club', level: 14, xp: 2450, change: 'up', rank: 1 },
    { name: 'Liam Rodriguez', role: 'Robotics Team', level: 12, xp: 2120, change: 'up', rank: 2 },
    { name: 'Aaliyah Jackson', role: 'IEEE Branch', level: 11, xp: 1980, change: 'down', rank: 3 },
    { name: 'Vikram Patel', role: 'Dev Society', level: 10, xp: 1720, change: 'same', rank: 4 },
  ];

  return (
    <section className="relative w-full py-24 bg-[#F8F9FA] overflow-hidden border-t border-zinc-200">
      {/* Glow Circles */}
      <div className="absolute top-1/2 right-0 w-[450px] h-[450px] bg-panda-maroon/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-panda-maroon/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-panda-maroon mb-3 block"
          >
            Community Rewards
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-bold text-3xl md:text-5xl text-zinc-900 tracking-tight leading-tight"
          >
            Celebrate Every Contribution.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-zinc-600 text-base md:text-lg mt-4"
          >
            Gamify participation with public milestones, badges, and contribution points to incentivize member engagement.
          </motion.p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Side: Floating Achievements Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {achievements.map((item, idx) => (
              <div 
                key={idx} 
                className={`${idx === 2 ? 'sm:col-span-2' : ''}`}
              >
                <ParticleCard 
                  title={item.title} 
                  desc={item.desc} 
                  badge={item.badge} 
                  icon={item.icon} 
                  color={item.color} 
                />
              </div>
            ))}
          </div>

          {/* Right Side: Leaderboard Panel */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-2xl glass-card p-6 border border-zinc-200 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
                <div className="text-left">
                  <h3 className="font-heading font-bold text-lg text-zinc-900">Active Ranks</h3>
                  <span className="text-[10px] text-zinc-500">Real-time contribution ledger</span>
                </div>
                <Award size={20} className="text-panda-maroon" />
              </div>

              <div className="flex flex-col gap-4">
                {leaderboardMembers.map((member, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-zinc-200/80 hover:border-panda-maroon/30 transition-all duration-300 group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading text-xs font-bold ${
                        i === 0 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                        i === 1 ? 'bg-slate-300/10 text-slate-300 border border-slate-300/20' :
                        i === 2 ? 'bg-amber-700/10 text-amber-700 border border-amber-700/20' :
                        'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      }`}>
                        {member.rank}
                      </div>
                      
                      <div className="text-left">
                        <div className="text-xs font-bold text-zinc-900 group-hover:text-panda-maroon transition-colors">{member.name}</div>
                        <div className="text-[9px] text-zinc-500">{member.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block">LVL {member.level}</span>
                        <div className="w-16 h-1 bg-zinc-200 rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full bg-gradient-to-r from-panda-maroon to-panda-gray"
                            style={{ width: `${(member.level / 15) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right shrink-0 min-w-12">
                        <span className="text-xs font-bold text-zinc-900">{member.xp}</span>
                        <span className="text-[8px] text-zinc-500 font-mono block">XP</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
