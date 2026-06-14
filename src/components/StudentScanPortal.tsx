import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkinStore } from '../utils/checkinStore';
import { CheckCircle2, ShieldAlert, Sparkles, QrCode } from 'lucide-react';

interface StudentScanPortalProps {
  scannerId: string | null;
}

export const StudentScanPortal: React.FC<StudentScanPortalProps> = ({ scannerId }) => {
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roll.trim()) {
      setError('Please fill in all inputs.');
      return;
    }
    if (!scannerId) {
      setError('Invalid or missing scanner session code.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate network delay to look premium
    setTimeout(async () => {
      const res = checkinStore.addCheckin(name, roll, scannerId);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
        setName('');
        setRoll('');
      } else {
        setError(res.error || 'Check-in failed.');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-panda-maroon/[0.04] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl shadow-sm p-6 relative overflow-hidden flex flex-col gap-6">
        {/* Brand bar */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center font-heading text-[10px] font-bold text-white">
              P
            </div>
            <span className="font-heading font-bold text-sm tracking-wider">PANDA OS</span>
          </div>
          <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">
            Portal Live
          </span>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-zinc-900">Scan Verified!</h2>
                <p className="text-xs text-zinc-550 mt-1 max-w-[240px] mx-auto leading-relaxed">
                  Your attendance has been successfully recorded in the dashboard databases. You can close this tab now.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5 text-left"
            >
              <div>
                <h2 className="font-heading font-bold text-lg text-zinc-900">Student Check-in</h2>
                <p className="text-xs text-zinc-555 mt-1 leading-relaxed">Submit your details to check-in to this active workspace event session.</p>
              </div>

              {/* QR session indicator */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-white border border-zinc-200 rounded-lg text-zinc-500">
                  <QrCode size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-zinc-400 uppercase leading-none font-bold">Event Code</span>
                  <span className="text-xs font-mono font-bold text-zinc-800 mt-1">{scannerId}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Full Student Name</label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-xs bg-white outline-none focus:border-panda-maroon transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Roll / ID Number</label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                    placeholder="e.g. CS2024-041"
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-xs bg-white outline-none focus:border-panda-maroon transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-sm transition-all mt-2 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Sparkles size={12} className="animate-spin text-white" />
                      <span>Verifying Security Hashes...</span>
                    </>
                  ) : (
                    <span>Register Attendance</span>
                  )}
                </button>
              </form>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold justify-center"
                >
                  <ShieldAlert size={14} />
                  <span>{error}</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider mt-6">
        Powered by PANDA Security Hashes
      </span>
    </div>
  );
};
