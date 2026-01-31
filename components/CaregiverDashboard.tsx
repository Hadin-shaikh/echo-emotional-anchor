
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from '../constants';
import { VisualReminder } from '../types';
import { parseTaskFromText } from '../services/geminiService';

interface CaregiverDashboardProps {
  reminders: VisualReminder[];
  comfortStats: { time: string; level: number; fullDate: string }[];
  onAddReminder: (reminder: VisualReminder) => void;
  onDeleteReminder: (id: string) => void;
  onUpdateReminder: (id: string, updates: Partial<VisualReminder>) => void;
}

const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({ 
  reminders, 
  comfortStats,
  onAddReminder, 
  onDeleteReminder,
  onUpdateReminder 
}) => {
  const [smartInput, setSmartInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSmartAdd = async () => {
    if (!smartInput.trim()) return;
    setIsProcessing(true);
    const parsed = await parseTaskFromText(smartInput);
    if (parsed) {
      const newReminder: VisualReminder = {
        id: Math.random().toString(),
        ...parsed,
        imageUrl: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=400",
        completed: false
      };
      onAddReminder(newReminder);
      setSmartInput("");
    } else {
      alert("AI couldn't understand that request. Try specifying a time and task.");
    }
    setIsProcessing(false);
  };

  const todayCompletedCount = reminders.filter(r => r.date === new Date().toISOString().split('T')[0] && r.completed).length;
  const todayTotalCount = reminders.filter(r => r.date === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <nav className="bg-white border-b border-gray-100 px-12 py-6 sticky top-0 z-30 flex justify-between items-center shadow-sm backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-3xl bg-orange-500 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-orange-100 rotate-3">E</div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">ECHO Caregiver</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patient Linked: Dad</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest border border-orange-100">
             Remote Sync Active
          </div>
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" className="w-14 h-14 rounded-3xl border-4 border-white shadow-xl" alt="Caregiver" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-12 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: AI Scheduler & Real Stats */}
        <div className="lg:col-span-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 group hover:shadow-xl transition-all duration-500">
               <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2">Today's Progress</p>
               <div className="text-4xl font-black text-gray-800 flex items-end gap-2">
                 {todayCompletedCount} <span className="text-lg text-gray-300 font-bold mb-1">/ {todayTotalCount}</span>
               </div>
               <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                 <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${(todayCompletedCount / (todayTotalCount || 1)) * 100}%` }}></div>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all duration-500">
               <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2">Recent Comfort</p>
               <div className="text-4xl font-black text-green-500">
                 {comfortStats[comfortStats.length - 1].level}/10
               </div>
               <p className="text-xs font-bold text-gray-400 mt-2">Calculated from task completion</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-xl transition-all duration-500">
               <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2">Last Update</p>
               <div className="text-xl font-black text-gray-800 mt-2">
                 {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
               <p className="text-xs font-bold text-gray-400 mt-2">Real-time sync active</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-blue-50/50 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h2 className="text-3xl font-black text-gray-800 mb-2 flex items-center gap-4">
              <span className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">✨</span>
              Smart Assistant
            </h2>
            <p className="text-gray-400 font-medium mb-8">Schedule a task using natural language. Gemini will handle the formatting and sync it to Dad's tablet instantly.</p>
            <div className="relative group">
              <textarea 
                value={smartInput}
                onChange={(e) => setSmartInput(e.target.value)}
                placeholder="Example: 'Doctor appointment at 3pm today' or 'Remind him to drink water every 2 hours'"
                className="w-full bg-gray-50 border-2 border-transparent rounded-[2rem] p-8 text-xl focus:bg-white focus:border-blue-400 focus:ring-8 focus:ring-blue-50 outline-none transition-all resize-none h-40 shadow-inner"
              />
              <button 
                onClick={handleSmartAdd}
                disabled={isProcessing || !smartInput.trim()}
                className={`absolute bottom-6 right-6 px-10 py-4 rounded-2xl font-black shadow-2xl transition-all flex items-center gap-3 active:scale-95 ${isProcessing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 shadow-blue-200'}`}
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Create Task <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg></>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-10">
               <div>
                 <h2 className="text-3xl font-black text-gray-800">Historical Comfort</h2>
                 <p className="text-gray-400 font-bold text-sm">Comfort levels are derived from Dad's actual daily task completion rates.</p>
               </div>
               <div className="flex gap-2">
                 <div className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black">HIGH COMFORT</div>
                 <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-black">LOW ANXIETY</div>
               </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={comfortStats}>
                  <defs>
                    <linearGradient id="comfortGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4A261" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F4A261" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#A0AEC0', fontSize: 12, fontWeight: 'bold'}} dy={15} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#A0AEC0', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '15px'}}
                    itemStyle={{fontWeight: 'bold', color: '#F4A261'}}
                  />
                  <Area type="monotone" dataKey="level" stroke="#F4A261" strokeWidth={6} fill="url(#comfortGradient)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Active Schedule & Management */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-2xl font-black text-gray-900">Task Control</h2>
               <div className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">{reminders.length} Total</div>
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[850px] pr-2 no-scrollbar">
              {reminders.sort((a,b) => a.time.localeCompare(b.time)).map(rem => {
                const isToday = rem.date === new Date().toISOString().split('T')[0];
                return (
                  <div key={rem.id} className={`p-6 bg-white rounded-[2rem] border-4 transition-all group relative ${rem.completed ? 'border-green-100 bg-green-50/20' : 'border-gray-50 hover:border-orange-100 hover:shadow-xl'}`}>
                    <div className="flex gap-5 items-start">
                      <img src={rem.imageUrl} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-md group-hover:scale-110 transition-transform duration-500" alt={rem.title} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-orange-500' : 'text-gray-400'}`}>
                            {isToday ? 'TODAY' : rem.date} • {rem.time}
                          </span>
                          <button 
                            onClick={() => onDeleteReminder(rem.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                        <p className="font-black text-gray-900 text-lg leading-tight mb-2">{rem.title}</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => onUpdateReminder(rem.id, { completed: !rem.completed })}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${rem.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600'}`}
                          >
                            {rem.completed ? 'COMPLETED' : 'MARK DONE'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
               <button 
                 onClick={() => {
                   const title = prompt("Task title?");
                   if (title) {
                     onAddReminder({
                       id: Math.random().toString(),
                       title: title,
                       description: "Manually added by caregiver.",
                       imageUrl: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=400",
                       time: "12:00 PM",
                       date: new Date().toISOString().split('T')[0],
                       completed: false,
                       type: 'OTHER'
                     });
                   }
                 }}
                 className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                  New Custom Task
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard;
