import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkinStore } from '../utils/checkinStore';
import type { CheckinRecord, ScannerState } from '../utils/checkinStore';
import { 
  QrCode, Check, CheckCircle2, ShieldAlert, ArrowLeft 
} from 'lucide-react';

interface AttendanceSectionProps {
  onBack: () => void;
}

export const AttendanceSection: React.FC<AttendanceSectionProps> = ({ onBack }) => {
  const [checkins, setCheckins] = useState<CheckinRecord[]>([]);
  const [activeScanner, setActiveScanner] = useState<ScannerState | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [recentLogs, setRecentLogs] = useState<string[]>([]);

  useEffect(() => {
    setActiveScanner(checkinStore.getActiveScanner());

    // Subscribe to in-memory cache updates (fired by Firestore real-time listener)
    const unsubscribe = checkinStore.subscribe(() => {
      setCheckins(checkinStore.getCheckins());
      setActiveScanner(checkinStore.getActiveScanner());
    });

    // Start Firestore real-time listener — ledger updates instantly on ANY device check-in
    const stopSync = checkinStore.startRealtimeSync();

    return () => {
      unsubscribe();
      stopSync();
    };
  }, []);


  return (
    <section id="attendance" className="relative w-full min-h-screen py-16 bg-[#F8F9FA] overflow-hidden">
      {/* Background gradients for premium SaaS aesthetic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-panda-maroon/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col gap-6">
        
        {/* Header Back Link */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-panda-maroon transition-colors w-fit group border-none bg-transparent cursor-pointer self-start"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Landing Page</span>
        </button>
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-panda-maroon mb-3 block">
            Live Check-In Portal
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-zinc-900 tracking-tight leading-tight">
            Seamless & Secure <span className="gradient-text">Attendance Tracking.</span>
          </h2>
          <p className="font-sans text-zinc-650 text-base md:text-lg mt-4">
            Test our dynamic, location-fenced QR scanner. Scan using a smartphone or fill out the portal simulator below to log attendance live.
          </p>
        </div>

        {/* Scanner & Form Panel */}
        <div className="max-w-5xl mx-auto flex flex-col gap-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* LEFT PANEL: The Expirable Code Scanner Display */}
            <div className="md:col-span-5 p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden h-[390px]">
              <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
              
              <span className="text-[10px] font-bold uppercase tracking-wider text-panda-maroon mb-2 z-10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-panda-maroon animate-ping" />
                Expirable Scanner Session
              </span>

              {/* Animated radar circles & QR code */}
              <div className="relative w-40 h-40 rounded-full border border-zinc-100 flex items-center justify-center mb-4 z-10">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-zinc-200/60 animate-spin-slow pointer-events-none" />
                
                <div className="w-28 h-28 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center relative overflow-hidden">
                  {activeScanner ? (
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        `${window.location.origin}/?scan=true&code=${activeScanner.codeValue}`
                      )}`}
                      alt="Active Scanner QR Code"
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <QrCode size={40} className="text-zinc-400 animate-pulse" />
                  )}
                  <motion.div
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-2 right-2 h-[2px] bg-panda-maroon shadow-md shadow-panda-maroon/40"
                  />
                </div>
              </div>

              {/* Code text & dynamic expiry timer */}
              <div className="text-center z-10 w-full flex flex-col gap-1.5">
                <span className="font-mono text-xs font-bold bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-lg text-zinc-800 tracking-wider select-all mx-auto">
                  {activeScanner?.codeValue || 'LOADING...'}
                </span>
                
                {/* Timer Countdown */}
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs font-bold font-sans px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-150">
                    Active Stable Session
                  </span>
                </div>
                

                
                {activeScanner && (
                  <div className="text-center mt-2 border-t border-zinc-100 pt-2 shrink-0">
                    <span className="text-[8px] text-zinc-450 font-sans uppercase font-bold tracking-wider block">Scan Portal URL (copy/click for testing)</span>
                    <a 
                      href={`${window.location.origin}/?scan=true&code=${activeScanner.codeValue}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] text-panda-maroon font-mono hover:underline break-all mt-0.5 inline-block max-w-[210px] truncate font-semibold"
                    >
                      {window.location.origin}/?scan=true&code={activeScanner.codeValue}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: Student Check-in Form */}
            <div className="md:col-span-7 p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm h-[390px] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 mb-1">Student Check-in Form</h3>
                <p className="text-xs text-zinc-550 mb-4">Scan client code and submit credential inputs to register attendance.</p>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!studentName.trim() || !studentRoll.trim()) {
                      setFormError('Please fill out all form inputs.');
                      return;
                    }
                    if (!activeScanner) {
                      setFormError('No active scanner session.');
                      return;
                    }
                    const res = await checkinStore.addCheckin(studentName, studentRoll, activeScanner.codeValue);
                    if (res.success) {
                      setFormError(null);
                      setFormSuccess(true);
                      setStudentName('');
                      setStudentRoll('');
                      setRecentLogs([
                        `${studentName.trim()} (${studentRoll.trim().toUpperCase()}) checked in successfully.`,
                        ...recentLogs
                      ]);
                      setTimeout(() => setFormSuccess(false), 3000);
                    } else {
                      setFormError(res.error || 'Failed to submit check-in.');
                      setTimeout(() => setFormError(null), 4000);
                    }
                  }}
                  className="flex flex-col gap-4 text-left"
                >
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Full Student Name</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none bg-white focus:border-panda-maroon transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Roll / ID Number</label>
                    <input
                      type="text"
                      required
                      value={studentRoll}
                      onChange={(e) => setStudentRoll(e.target.value)}
                      placeholder="e.g. CS2024-041"
                      className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none bg-white focus:border-panda-maroon transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all mt-1 cursor-pointer border-none"
                  >
                    Submit Scan Check-in
                  </button>
                </form>
              </div>

              {/* Success / Error notification bar */}
              <div className="h-10 mt-3">
                <AnimatePresence mode="wait">
                  {formSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold justify-center"
                    >
                      <CheckCircle2 size={14} />
                      <span>Attendance Registered Successfully! (+150 XP)</span>
                    </motion.div>
                  )}
                  
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2 p-2 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold justify-center"
                    >
                      <ShieldAlert size={14} />
                      <span>{formError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* BOTTOM PANEL: Live check-in ledger records list */}
          <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Separate Registry Storage Ledger</h3>
                <p className="text-xs text-zinc-500">Live query rows fetched from local browser localStorage state.</p>
              </div>
              
              <button
                onClick={() => {
                  checkinStore.clearDatabase();
                  setRecentLogs(['Roster storage database cleared.', ...recentLogs]);
                }}
                className="px-3.5 py-2 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-655 hover:text-zinc-900 font-bold text-[10px] rounded-xl transition-all cursor-pointer w-fit"
              >
                Reset Local Database
              </button>
            </div>

            {checkins.length === 0 ? (
              <div className="py-10 text-center text-zinc-450 text-xs font-semibold border border-dashed border-zinc-200 rounded-2xl bg-[#F8F9FA]/40">
                No checked in entries found inside the store.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-150 text-zinc-400 uppercase font-mono text-[9px] text-left">
                      <th className="py-2.5 font-bold">Student Name</th>
                      <th className="py-2.5 font-bold">Roll / ID Number</th>
                      <th className="py-2.5 font-bold">Scanner Session ID</th>
                      <th className="py-2.5 font-bold">Check-in Time</th>
                      <th className="py-2.5 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkins.map((rec) => (
                      <tr key={rec.id} className="border-b border-zinc-100 last:border-none hover:bg-zinc-50/40 transition-colors">
                        <td className="py-3 font-semibold text-zinc-800">{rec.name}</td>
                        <td className="py-3 font-mono text-zinc-500 font-semibold">{rec.rollNumber}</td>
                        <td className="py-3 font-mono text-[10px] text-zinc-450">{rec.scannerId}</td>
                        <td className="py-3 text-zinc-450">{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                            <Check size={8} /> Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
