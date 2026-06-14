import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onLaunchDashboard: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onLaunchDashboard }) => {
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
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse coordinates for repulsion
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Initialize particles
    const initParticles = () => {
      particles.length = 0;
      const count = Math.min(60, Math.floor((width * height) / 15000));
      for (let i = 0; i < count; i++) {
        const isMaroon = Math.random() > 0.5;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.6 + 0.2,
          color: isMaroon ? '#8B0000' : '#8E8E93',
        });
      }
    };
    initParticles();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle moving grid lines
      ctx.strokeStyle = 'rgba(24, 24, 27, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      const gridShift = (Date.now() * 0.01) % gridSize;

      // Vertical lines
      for (let x = gridShift; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Horizontal lines
      for (let y = gridShift; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interaction with mouse (repulsion)
        if (mouse.x > 0 && mouse.y > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 3;
            p.y += Math.sin(angle) * force * 3;
          }
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="relative w-full py-32 bg-[#F8F9FA] overflow-hidden flex items-center justify-center border-t border-zinc-200">
      {/* Background Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Radial Glow highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-panda-maroon/[0.04] rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-panda-maroon/[0.02] rounded-full blur-[180px] pointer-events-none z-0" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Glow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200/85 shadow-sm text-xs font-bold text-panda-maroon mb-8 uppercase tracking-widest"
        >
          <Sparkles size={12} className="animate-pulse" />
          Ready to scale?
        </motion.div>

        {/* Large Typography Statement */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-heading font-bold text-4xl md:text-6xl text-zinc-900 tracking-tight leading-tight mb-8 max-w-2xl mx-auto"
        >
          Lead Smarter.{' '}
          <span className="gradient-text">Build Stronger Communities.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-sans text-zinc-600 text-base md:text-lg max-w-xl mx-auto mb-12"
        >
          Join hundreds of club presidents and student volunteers who have removed manual spreadsheets from their daily management routine.
        </motion.p>

        {/* Action Call buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onLaunchDashboard}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white font-bold text-sm rounded-full hover:bg-zinc-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-zinc-900/20 group w-full sm:w-auto justify-center cursor-pointer"
          >
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#analytics"
            className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-zinc-50 text-zinc-850 font-bold text-sm rounded-full border border-zinc-200 transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center shadow-sm"
          >
            Explore Dashboard
          </a>
        </motion.div>
      </div>
    </section>
  );
};
