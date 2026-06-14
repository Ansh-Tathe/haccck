import React, { useState, useEffect } from 'react';
import { checkinStore } from '../utils/checkinStore';
import type { CheckinRecord, ScannerState } from '../utils/checkinStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { 
  Users, Calendar, QrCode, BrainCircuit, ArrowLeft, Search, Bell, CircleDot, Plus, 
  CheckCircle2, TrendingUp, LogOut, Check, ShieldAlert
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: string;
  level: number;
  xp: number;
  checkedIn: boolean;
  status: 'Active' | 'Away';
  joinDate: string;
}

interface EventItem {
  id: string;
  name: string;
  date: string;
  attendees: number;
  type: string;
  coordinator: string;
}

interface InteractiveDashboardProps {
  onBack: () => void;
}

export const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'events' | 'scanner' | 'ai'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. Core States (Members & Events)
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Sarah Chen', role: 'President, ACM', level: 14, xp: 2450, checkedIn: true, status: 'Active', joinDate: '2025-09-10' },
    { id: '2', name: 'Liam Rodriguez', role: 'Lead Dev, Robotics', level: 12, xp: 2120, checkedIn: true, status: 'Active', joinDate: '2025-10-02' },
    { id: '3', name: 'Aaliyah Jackson', role: 'Coordinator, WIT', level: 11, xp: 1980, checkedIn: false, status: 'Active', joinDate: '2025-11-15' },
    { id: '4', name: 'Vikram Patel', role: 'Treasury, DevSoc', level: 10, xp: 1720, checkedIn: false, status: 'Active', joinDate: '2026-01-08' },
    { id: '5', name: 'Emily Watson', role: 'President, Fintech', level: 8, xp: 1240, checkedIn: true, status: 'Active', joinDate: '2026-01-20' },
    { id: '6', name: 'Tyler Kim', role: 'Volunteer Coordinator', level: 7, xp: 950, checkedIn: false, status: 'Away', joinDate: '2026-02-12' },
    { id: '7', name: 'Marcus Aurelius', role: 'Support Staff', level: 5, xp: 600, checkedIn: false, status: 'Away', joinDate: '2026-03-01' },
  ]);

  const [events, setEvents] = useState<EventItem[]>([
    { id: 'e1', name: 'PANDA Integration Workshop', date: 'June 18, 5:00 PM', attendees: 85, type: 'Workshop', coordinator: 'Sarah Chen' },
    { id: 'e2', name: 'Summer HackFest 2026', date: 'July 04, 9:00 AM', attendees: 340, type: 'Competition', coordinator: 'Liam Rodriguez' },
    { id: 'e3', name: 'UX/UI Design Sprint', date: 'July 15, 6:00 PM', attendees: 110, type: 'Seminar', coordinator: 'Aaliyah Jackson' },
    { id: 'e4', name: 'Cybersecurity Boot Camp', date: 'August 01, 10:00 AM', attendees: 95, type: 'Workshop', coordinator: 'Vikram Patel' },
  ]);

  const [recentLogs, setRecentLogs] = useState<string[]>([
    'Workspace activated under Valkyrie Computing.',
    'Sarah Chen updated the ACM Roster list.',
    'Summer HackFest 2026 event approved.',
  ]);

  // 2. Add Member Drawer / Form State
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Member');
  
  // 3. Add Event Form State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventType, setNewEventType] = useState('Workshop');
  const [newEventCoord, setNewEventCoord] = useState('');


  // 4b. Separate Storage Scanner System States
  const [checkins, setCheckins] = useState<CheckinRecord[]>([]);
  const [activeScanner, setActiveScanner] = useState<ScannerState | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    setCheckins(checkinStore.getCheckins());
    setActiveScanner(checkinStore.getActiveScanner());

    const unsubscribe = checkinStore.subscribe(() => {
      setCheckins(checkinStore.getCheckins());
      setActiveScanner(checkinStore.getActiveScanner());
    });

    const updateTimer = () => {
      const scanner = checkinStore.getActiveScanner();
      const diff = Math.max(0, Math.floor((scanner.expiresAt - Date.now()) / 1000));
      setTimeLeft(diff);
      
      if (diff === 0) {
        checkinStore.generateNewScanner();
      }
    };

    const syncCloud = () => {
      checkinStore.fetchCloudCheckins();
    };

    updateTimer();
    syncCloud();
    
    const interval = setInterval(updateTimer, 1000);
    const cloudInterval = setInterval(syncCloud, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
      clearInterval(cloudInterval);
    };
  }, []);

  // Sync members list with separate store records dynamically
  const updatedMembers = members.map(m => {
    const isStoreCheckedIn = checkins.some(
      c => c.name.toLowerCase() === m.name.toLowerCase() || 
           c.rollNumber.toLowerCase() === m.id.toLowerCase()
    );
    return { ...m, checkedIn: m.checkedIn || isStoreCheckedIn };
  });

  // 5. AI Insight State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('Hello! I am PANDA AI, your automated analytics strategist. Select a prompt or ask me anything to generate insight calculations.');
  const [aiTyping, setAiTyping] = useState(false);

  // Derived Stats
  const activeRate = parseFloat(((updatedMembers.filter(m => m.checkedIn).length / updatedMembers.length) * 100).toFixed(1));
  const totalXP = updatedMembers.reduce((sum, m) => sum + m.xp + (checkins.some(c => c.name.toLowerCase() === m.name.toLowerCase()) ? 150 : 0), 0);

  // Charts data computed dynamically based on checked-in rates
  const memberAcquisitionData = [
    { month: 'Jan', members: 420 },
    { month: 'Feb', members: 550 },
    { month: 'Mar', members: 710 },
    { month: 'Apr', members: 890 },
    { month: 'May', members: 1050 },
    { month: 'Jun', members: 1200 + updatedMembers.length },
  ];

  const turnoutData = events.map(e => ({
    name: e.name.length > 15 ? e.name.substring(0, 15) + '...' : e.name,
    turnout: e.attendees + (updatedMembers.filter(m => m.checkedIn).length * 4) + (checkins.length * 3) // Dynamic turnouts linked to check-in simulator and store checkins
  }));

  // Handle member creation
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newM: Member = {
      id: Date.now().toString(),
      name: newMemberName,
      role: newMemberRole,
      level: 1,
      xp: 100,
      checkedIn: false,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };

    setMembers([newM, ...members]);
    setRecentLogs([`${newMemberName} joined the club roster.`, ...recentLogs]);
    setNewMemberName('');
    setNewMemberRole('Member');
    setShowAddMember(false);
  };

  // Handle event creation
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !newEventDate.trim()) return;

    const newE: EventItem = {
      id: 'e-' + Date.now(),
      name: newEventName,
      date: newEventDate,
      attendees: Math.floor(Math.random() * 50) + 30,
      type: newEventType,
      coordinator: newEventCoord || 'Unassigned'
    };

    setEvents([newE, ...events]);
    setRecentLogs([`New event "${newEventName}" added to the schedule.`, ...recentLogs]);
    setNewEventName('');
    setNewEventDate('');
    setNewEventCoord('');
    setShowAddEvent(false);
  };


  // Trigger AI responses based on inputs
  const triggerAIResponse = (promptText: string) => {
    if (aiTyping) return;
    setAiTyping(true);
    setAiAnswer('');

    let text = '';
    if (promptText.toLowerCase().includes('attendance') || promptText.toLowerCase().includes('rate')) {
      text = `PANDA AI Analysis:\n\nOur current member check-in status sits at ${activeRate}%. Active checklists indicate that ACM and Fintech chapters maintain optimal attendance frequency, while supporting logs show room to bolster check-ins for Away tiers. Recommended adjustment: prompt Tyler Kim to run an engagement drive for inactive levels.`;
    } else if (promptText.toLowerCase().includes('member') || promptText.toLowerCase().includes('roster')) {
      text = `PANDA AI Analytics Summary:\n\nWe have a roster count of ${members.length} registered members, accumulating a combined XP pool of ${totalXP}. Sarah Chen remains the lead contributor. Dynamic trajectory models predict member growth of +15% over the next month, driven by upcoming events like "${events[1]?.name}".`;
    } else {
      text = `PANDA AI General Report:\n\nAll campus interfaces are synchronized. Overview parameters suggest turnout indexes remain healthy, and resource indicators are clear. Dynamic tickets generate scanner events in under 200ms. Keep launching check-ins to monitor engagement curves.`;
    }

    let i = 0;
    const typingInterval = setInterval(() => {
      setAiAnswer(prev => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(typingInterval);
        setAiTyping(false);
      }
    }, 15);
  };

  // Filter members list based on query
  const filteredMembers = updatedMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex flex-col font-sans relative">
      {/* Spotlight follower overlay */}
      <div className="grain-overlay" />

      {/* Main Console Frame */}
      <div className="flex flex-grow h-screen overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 border-r border-zinc-200 bg-[#F4F4F6] flex flex-col justify-between shrink-0 p-6 z-20">
          <div className="flex flex-col gap-8">
            {/* Header Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-panda-maroon to-panda-gray flex items-center justify-center font-heading text-xs font-bold text-white shadow-sm shadow-panda-maroon/20">
                  P
                </div>
                <span className="font-heading font-bold text-base tracking-wider">PANDA OS</span>
              </div>
            </div>

            {/* Back Button */}
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-panda-maroon transition-colors w-fit group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Landing Page</span>
            </button>

            {/* Navigation Menus */}
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-zinc-900 text-white shadow-sm' 
                    : 'text-zinc-650 hover:bg-zinc-200/50 hover:text-zinc-900'
                }`}
              >
                <CircleDot size={14} className={activeTab === 'overview' ? 'text-panda-maroon' : ''} />
                <span>Overview Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeTab === 'members' 
                    ? 'bg-zinc-900 text-white shadow-sm' 
                    : 'text-zinc-650 hover:bg-zinc-200/50 hover:text-zinc-900'
                }`}
              >
                <Users size={14} className={activeTab === 'members' ? 'text-panda-maroon' : ''} />
                <span>Members Roster</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeTab === 'events' 
                    ? 'bg-zinc-900 text-white shadow-sm' 
                    : 'text-zinc-650 hover:bg-zinc-200/50 hover:text-zinc-900'
                }`}
              >
                <Calendar size={14} className={activeTab === 'events' ? 'text-panda-maroon' : ''} />
                <span>Events Planner</span>
              </button>

              <button
                onClick={() => setActiveTab('scanner')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeTab === 'scanner' 
                    ? 'bg-zinc-900 text-white shadow-sm' 
                    : 'text-zinc-650 hover:bg-zinc-200/50 hover:text-zinc-900'
                }`}
              >
                <QrCode size={14} className={activeTab === 'scanner' ? 'text-panda-maroon' : ''} />
                <span>Check-in Scanner</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeTab === 'ai' 
                    ? 'bg-zinc-900 text-white shadow-sm' 
                    : 'text-zinc-650 hover:bg-zinc-200/50 hover:text-zinc-900'
                }`}
              >
                <BrainCircuit size={14} className={activeTab === 'ai' ? 'text-panda-maroon' : ''} />
                <span>AI Insight Hub</span>
              </button>
            </nav>
          </div>

          {/* Org details and Exit */}
          <div className="flex flex-col gap-4">
            <div className="p-3.5 bg-white border border-zinc-200 rounded-2xl shadow-sm text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Live Demo Environment</span>
              </div>
              <div className="text-xs font-bold text-zinc-900">Valkyrie Computing</div>
            </div>

            <button 
              onClick={onBack}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors"
            >
              <LogOut size={12} />
              <span>Exit Console</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONSOLE CONTENTS */}
        <main className="flex-grow flex flex-col overflow-hidden">
          
          {/* HEADER BAR */}
          <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between shrink-0 z-10">
            {/* Search inputs */}
            <div className="flex items-center gap-2.5 bg-zinc-100 border border-zinc-200/50 px-3.5 py-2 rounded-full text-zinc-500 text-xs w-64 md:w-80">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search roster, logs, dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-zinc-800 placeholder-zinc-400 w-full"
              />
            </div>

            {/* Profile Avatar / Notification details */}
            <div className="flex items-center gap-4">
              <div className="relative p-1.5 text-zinc-650 hover:text-zinc-900 cursor-pointer">
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-panda-maroon" />
              </div>
              <div className="h-4 w-[1px] bg-zinc-200" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-panda-maroon/10 border border-panda-maroon/20 flex items-center justify-center text-xs font-bold text-panda-maroon shadow-inner">
                  AS
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-zinc-800 leading-none">Ansh</div>
                  <span className="text-[9px] text-zinc-500 leading-none">System Admin</span>
                </div>
              </div>
            </div>
          </header>

          {/* VIEW AREA */}
          <div className="flex-grow overflow-y-auto p-8 bg-[#F8F9FA] relative">
            
            <AnimatePresence mode="wait">
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-6"
                >
                  {/* Top Stats row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm text-left relative overflow-hidden group">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Check-in Active Rate</div>
                      <div className="text-2xl font-heading font-bold text-zinc-900">{activeRate}%</div>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1.5">
                        <TrendingUp size={10} /> Live roster metrics
                      </span>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm text-left relative overflow-hidden group">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Registered Members</div>
                      <div className="text-2xl font-heading font-bold text-zinc-900">{updatedMembers.length}</div>
                      <span className="text-[10px] text-panda-maroon font-semibold flex items-center gap-0.5 mt-1.5">
                        {updatedMembers.filter(m => m.checkedIn).length} checked in today
                      </span>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm text-left relative overflow-hidden group">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Total XP Generated</div>
                      <div className="text-2xl font-heading font-bold text-zinc-900">{totalXP}</div>
                      <span className="text-[10px] text-zinc-550 font-semibold flex items-center gap-0.5 mt-1.5">
                        Gamified contributions active
                      </span>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm text-left relative overflow-hidden group">
                      <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Upcoming Events</div>
                      <div className="text-2xl font-heading font-bold text-zinc-900">{events.length}</div>
                      <span className="text-[10px] text-zinc-500 font-semibold flex items-center gap-0.5 mt-1.5">
                        Turnout tracking enabled
                      </span>
                    </div>
                  </div>

                  {/* Dashboard dynamic graphs */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Turnout acquisition line graph */}
                    <div className="lg:col-span-8 p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-4 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Member Growth Trajectory</span>
                        <span className="text-[9px] font-mono text-zinc-500">Log Period: Jan - Jun</span>
                      </div>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={memberAcquisitionData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F4" vertical={false} />
                            <XAxis dataKey="month" stroke="#A1A1AA" fontSize={10} tickLine={false} />
                            <YAxis stroke="#A1A1AA" fontSize={10} tickLine={false} />
                            <ChartTooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E4E4E7', borderRadius: '8px', fontSize: '10px' }} />
                            <Line type="monotone" dataKey="members" stroke="#8B0000" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Turnout bar charts */}
                    <div className="lg:col-span-4 p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-4 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Seminars Turnout Rates</span>
                        <span className="text-[9px] font-mono text-zinc-500">Live RSVPs + Scans</span>
                      </div>
                      <div className="h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={turnoutData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F1F4" vertical={false} />
                            <XAxis dataKey="name" stroke="#A1A1AA" fontSize={8} tickLine={false} />
                            <YAxis stroke="#A1A1AA" fontSize={10} tickLine={false} />
                            <ChartTooltip contentStyle={{ backgroundColor: '#FFF', borderColor: '#E4E4E7', borderRadius: '8px', fontSize: '10px' }} />
                            <Bar dataKey="turnout" fill="#8B0000" radius={[4, 4, 0, 0]} maxBarSize={22} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Audit Logs / Activity details */}
                  <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm text-left">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">Live System Activity Logs</h3>
                    <div className="flex flex-col gap-2.5">
                      {recentLogs.slice(0, 5).map((log, index) => (
                        <div key={index} className="flex items-center gap-3 py-2 border-b border-zinc-100 last:border-none text-xs text-zinc-650">
                          <span className="w-1.5 h-1.5 rounded-full bg-panda-maroon shrink-0" />
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MEMBERS ROSTER TAB */}
              {activeTab === 'members' && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-zinc-900">Roster Registry</h2>
                      <p className="text-xs text-zinc-500">Search member databases, XP standings, and edit status values.</p>
                    </div>
                    
                    <button
                      onClick={() => setShowAddMember(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      <Plus size={14} />
                      <span>Add Member</span>
                    </button>
                  </div>

                  {/* Add Member form drawer overlay */}
                  {showAddMember && (
                    <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-md text-left max-w-lg mx-auto w-full">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">Enter Member Details</h3>
                      <form onSubmit={handleAddMember} className="flex flex-col gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Full Name</label>
                          <input
                            type="text"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-panda-maroon transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Role / Affiliation</label>
                          <input
                            type="text"
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                            placeholder="e.g. Lead Coordinator, Member, Dev"
                            className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-panda-maroon transition-colors"
                          />
                        </div>
                        <div className="flex gap-3 mt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-panda-maroon text-white font-bold text-xs rounded-xl hover:bg-panda-maroon-light transition-colors"
                          >
                            Save Member
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddMember(false)}
                            className="px-4 py-2 border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl hover:bg-zinc-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Member Table Grid */}
                  <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-left">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] uppercase text-zinc-500 font-bold tracking-wider">
                            <th className="py-4 px-6 text-left">Name</th>
                            <th className="py-4 px-6 text-left">Role</th>
                            <th className="py-4 px-6 text-center">XP Level</th>
                            <th className="py-4 px-6 text-center">Daily Check-in</th>
                            <th className="py-4 px-6 text-center">Status</th>
                            <th className="py-4 px-6 text-right">Join Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map((member) => (
                            <tr key={member.id} className="border-b border-zinc-100 last:border-none hover:bg-zinc-50/50 transition-colors text-xs text-zinc-800">
                              <td className="py-4 px-6 font-bold">{member.name}</td>
                              <td className="py-4 px-6 text-zinc-600">{member.role}</td>
                              <td className="py-4 px-6 text-center">
                                <span className="font-semibold text-zinc-900">{member.xp} XP</span>
                                <span className="text-[10px] text-zinc-400 block">Lvl {member.level}</span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex justify-center">
                                  {member.checkedIn ? (
                                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                                      <Check size={12} strokeWidth={3} />
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold text-zinc-400 uppercase">Pending</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex justify-center">
                                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                                    member.status === 'Active' 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                      : 'bg-zinc-100 text-zinc-500'
                                  }`}>
                                    {member.status}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right font-mono text-zinc-500">{member.joinDate}</td>
                            </tr>
                          ))}
                          {filteredMembers.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-zinc-400 font-medium">
                                No matching members found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* EVENTS PLANNER TAB */}
              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-zinc-900">Event Calendars</h2>
                      <p className="text-xs text-zinc-500">Plan upcoming schedules, verify co-coordinators, and estimate turnout curves.</p>
                    </div>
                    
                    <button
                      onClick={() => setShowAddEvent(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      <Plus size={14} />
                      <span>Create Event</span>
                    </button>
                  </div>

                  {/* Add Event Form overlay */}
                  {showAddEvent && (
                    <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-md text-left max-w-lg mx-auto w-full">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4">Enter Event Parameters</h3>
                      <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Event Name</label>
                          <input
                            type="text"
                            value={newEventName}
                            onChange={(e) => setNewEventName(e.target.value)}
                            placeholder="e.g. AI Ethics Seminar"
                            className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-panda-maroon transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Date & Time</label>
                            <input
                              type="text"
                              value={newEventDate}
                              onChange={(e) => setNewEventDate(e.target.value)}
                              placeholder="e.g. June 22, 4:00 PM"
                              className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-panda-maroon transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Event Type</label>
                            <select
                              value={newEventType}
                              onChange={(e) => setNewEventType(e.target.value)}
                              className="w-full px-3 py-2 border border-zinc-200 bg-white rounded-xl text-xs outline-none focus:border-panda-maroon transition-colors"
                            >
                              <option>Workshop</option>
                              <option>Seminar</option>
                              <option>Competition</option>
                              <option>Tech Talk</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Coordinating Officer</label>
                          <input
                            type="text"
                            value={newEventCoord}
                            onChange={(e) => setNewEventCoord(e.target.value)}
                            placeholder="e.g. Sarah Chen"
                            className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-panda-maroon transition-colors"
                          />
                        </div>
                        <div className="flex gap-3 mt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-panda-maroon text-white font-bold text-xs rounded-xl hover:bg-panda-maroon-light transition-colors"
                          >
                            Save Event
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddEvent(false)}
                            className="px-4 py-2 border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl hover:bg-zinc-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Events Schedule Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {events.map((ev) => (
                      <div key={ev.id} className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col justify-between h-44 relative group">
                        <div className="absolute top-6 right-6">
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-panda-maroon/10 text-panda-maroon border border-panda-maroon/20">
                            {ev.type}
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] font-mono text-zinc-400">{ev.date}</span>
                          <h3 className="font-heading font-bold text-base text-zinc-900 mt-1.5">{ev.name}</h3>
                          <p className="text-xs text-zinc-500 mt-1">Lead: <span className="font-semibold text-zinc-800">{ev.coordinator}</span></p>
                        </div>

                        <div className="flex items-center gap-2 border-t border-zinc-100 pt-3 mt-4 text-[10px] text-zinc-500">
                          <Users size={12} className="text-zinc-400" />
                          <span>Estimated Attendees Turnout: <strong className="text-zinc-800">{ev.attendees + (members.filter(m => m.checkedIn).length * 4)} members</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CHECK-IN SCANNER SIMULATOR TAB */}
              {activeTab === 'scanner' && (
                <motion.div
                  key="scanner"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-5xl mx-auto flex flex-col gap-8 py-4 text-left"
                >
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-zinc-900">Dynamic Ticket Scanner & Registry</h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Manage temporary expirable tickets and register manual check-in records using the separate datastore system.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* LEFT PANEL: The Expirable Code Scanner Display */}
                    <div className="md:col-span-5 p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden h-[380px]">
                      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                      
                      <span className="text-[10px] font-bold uppercase tracking-wider text-panda-maroon mb-2 z-10 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-panda-maroon animate-ping" />
                        Expirable Scanner Session
                      </span>

                      {/* Animated radar circles & QR code */}
                      <div className="relative w-40 h-40 rounded-full border border-zinc-100 flex items-center justify-center mb-4 z-10">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-zinc-200 animate-spin-slow pointer-events-none" />
                        
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
                          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                            timeLeft < 30 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-zinc-150 text-zinc-655'
                          }`}>
                            Expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => checkinStore.generateNewScanner()}
                          className="text-[10px] font-bold text-panda-maroon hover:underline mt-2 cursor-pointer transition-all self-center font-sans"
                        >
                          Manual Regenerate Scanner
                        </button>
                        
                        {activeScanner && (
                          <div className="text-center mt-2 border-t border-zinc-100 pt-2 shrink-0">
                            <span className="text-[8px] text-zinc-450 font-sans uppercase font-bold tracking-wider block">Scan Portal URL (copy/click for testing)</span>
                            <a 
                              href={`${window.location.origin}/?scan=true&code=${activeScanner.codeValue}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] text-panda-maroon font-mono hover:underline break-all mt-0.5 inline-block max-w-[210px] truncate"
                            >
                              {window.location.origin}/?scan=true&code={activeScanner.codeValue}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT PANEL: Student Check-in Form */}
                    <div className="md:col-span-7 p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm h-[380px] flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 mb-1">Student Check-in Form</h3>
                        <p className="text-xs text-zinc-500 mb-4">Scan client code and submit credential inputs to register attendance.</p>
                        
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!studentName.trim() || !studentRoll.trim()) {
                              setFormError('Please fill out all form inputs.');
                              return;
                            }
                            if (!activeScanner) {
                              setFormError('No active scanner session.');
                              return;
                            }
                            const res = checkinStore.addCheckin(studentName, studentRoll, activeScanner.id);
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
                              className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-panda-maroon transition-colors"
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
                              className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs outline-none focus:border-panda-maroon transition-colors"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all mt-1 cursor-pointer"
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
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900">Separate Registry Storage Ledger</h3>
                        <p className="text-xs text-zinc-500">Live query rows fetched from local browser localStorage state.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          checkinStore.clearDatabase();
                          setRecentLogs(['Roster storage database cleared.', ...recentLogs]);
                        }}
                        className="px-3.5 py-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-655 hover:text-zinc-900 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                      >
                        Reset Local Database
                      </button>
                    </div>

                    {checkins.length === 0 ? (
                      <div className="py-10 text-center text-zinc-400 text-xs font-medium border border-dashed border-zinc-150 rounded-2xl bg-[#F8F9FA]/40">
                        No checked in entries found inside the store.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-zinc-100 text-zinc-400 uppercase font-mono text-[9px]">
                              <th className="py-2.5 text-left font-bold">Student Name</th>
                              <th className="py-2.5 text-left font-bold">Roll / ID Number</th>
                              <th className="py-2.5 text-left font-bold">Scanner Session ID</th>
                              <th className="py-2.5 text-left font-bold">Check-in Time</th>
                              <th className="py-2.5 text-right font-bold">Status</th>
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
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-250">
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
                </motion.div>
              )}

              {/* AI INSIGHT HUB TAB */}
              {activeTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-3xl mx-auto flex flex-col gap-6 text-left"
                >
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-zinc-900">PANDA AI Insight Engine</h2>
                    <p className="text-xs text-zinc-500">Query natural language models analyzing current member rates, database timelines, and engagement curves.</p>
                  </div>

                  {/* Chat logs */}
                  <div className="p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm min-h-[260px] flex flex-col justify-between gap-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial from-panda-maroon/[0.01] to-transparent pointer-events-none" />
                    
                    <div className="flex gap-4 items-start relative z-10">
                      <div className="p-3 bg-panda-maroon/5 rounded-2xl text-panda-maroon shrink-0">
                        <BrainCircuit size={20} />
                      </div>
                      <div className="flex flex-col gap-1 w-full text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-panda-maroon">PANDA AI Assistant</span>
                        <div className="text-xs text-zinc-800 leading-relaxed whitespace-pre-line font-medium font-mono">
                          {aiAnswer}
                          {aiTyping && <span className="inline-block w-1.5 h-3 ml-1 bg-zinc-900 animate-pulse" />}
                        </div>
                      </div>
                    </div>

                    {/* Pre-prompt Quick Suggestions */}
                    <div className="border-t border-zinc-100 pt-4 flex flex-wrap gap-2 relative z-10">
                      <button
                        onClick={() => triggerAIResponse('Calculate attendance rates.')}
                        disabled={aiTyping}
                        className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 text-[10px] text-zinc-700 font-bold transition-all"
                      >
                        📊 Attendance Analysis
                      </button>
                      <button
                        onClick={() => triggerAIResponse('Summarize member rosters.')}
                        disabled={aiTyping}
                        className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 text-[10px] text-zinc-700 font-bold transition-all"
                      >
                        👥 Roster Stats
                      </button>
                      <button
                        onClick={() => triggerAIResponse('Generate general performance overview.')}
                        disabled={aiTyping}
                        className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-50 text-[10px] text-zinc-700 font-bold transition-all"
                      >
                        ⚡ Platform Report
                      </button>
                    </div>
                  </div>

                  {/* Input textbox query */}
                  <div className="flex gap-3 relative z-10">
                    <input
                      type="text"
                      placeholder="Ask PANDA AI to generate customized metrics summary..."
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiQuestion.trim()) {
                          triggerAIResponse(aiQuestion);
                          setAiQuestion('');
                        }
                      }}
                      className="flex-grow px-5 py-3 border border-zinc-200 rounded-2xl text-xs bg-white text-zinc-850 outline-none focus:border-panda-maroon transition-all shadow-sm"
                    />
                    <button
                      onClick={() => {
                        if (aiQuestion.trim()) {
                          triggerAIResponse(aiQuestion);
                          setAiQuestion('');
                        }
                      }}
                      disabled={aiTyping || !aiQuestion.trim()}
                      className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold text-xs rounded-2xl shadow-sm transition-colors shrink-0"
                    >
                      <span>Query AI</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </main>
      </div>
    </div>
  );
};
