import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { FeaturesSection } from './components/FeaturesSection';
import { DashboardShowcase } from './components/DashboardShowcase';
import { ScrollytellingTimeline } from './components/ScrollytellingTimeline';
import { GamificationSection } from './components/GamificationSection';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { InteractiveDashboard } from './components/InteractiveDashboard';
import { CurvedMarquee } from './components/CurvedMarquee';
import { StudentScanPortal } from './components/StudentScanPortal';
import { AttendanceSection } from './components/AttendanceSection';

function App() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard' | 'scanPortal' | 'attendance'>('landing');
  const [scanCode, setScanCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('scan') === 'true') {
      setViewMode('scanPortal');
      setScanCode(params.get('code'));
    }
  }, []);

  // 1. Lenis Smooth Scrolling Initialization
  useEffect(() => {
    // Only enable Lenis in landing page view to prevent interference with dashboard grids scroll
    if (viewMode !== 'landing') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
      infinite: false,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [viewMode]);

  // 2. Custom Spotlight Pointer follow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleLaunchDashboard = () => {
    setViewMode('dashboard');
    window.scrollTo({ top: 0 });
  };

  const handleLaunchAttendance = () => {
    setViewMode('attendance');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] text-zinc-900 selection:bg-panda-maroon/15 selection:text-panda-maroon">
      {/* Noise grain overlay for high-fidelity SaaS texture */}
      <div className="grain-overlay" />

      {/* Mouse spotlight follower */}
      <div 
        className="cursor-spotlight hidden md:block" 
        style={{ 
          left: `${mousePos.x}px`, 
          top: `${mousePos.y}px` 
        }} 
      />

      {viewMode === 'scanPortal' ? (
        <StudentScanPortal scannerId={scanCode} />
      ) : viewMode === 'dashboard' ? (
        <InteractiveDashboard onBack={() => setViewMode('landing')} />
      ) : viewMode === 'attendance' ? (
        <AttendanceSection onBack={() => setViewMode('landing')} />
      ) : (
        <>
          {/* Navigation Bar */}
          <Navbar onLaunchDashboard={handleLaunchDashboard} onLaunchAttendance={handleLaunchAttendance} />

          {/* Hero Section */}
          <Hero onLaunchDashboard={handleLaunchDashboard} />

          {/* Curved Loop Separator */}
          <CurvedMarquee />

          {/* Problem Section (Before vs After) */}
          <ProblemSection />

          {/* Features Showcase Section */}
          <FeaturesSection />

          {/* Interactive Mock Dashboard */}
          <DashboardShowcase />

          {/* Scrollytelling user timeline */}
          <ScrollytellingTimeline />

          {/* Leaderboard and Rewards milestones */}
          <GamificationSection />

          {/* Student Testimonials Carousel */}
          <Testimonials />

          {/* Action CTA with grid animations */}
          <FinalCTA onLaunchDashboard={handleLaunchDashboard} />

          {/* Page Footer */}
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
