
import React, { useState, useEffect } from 'react';
import { MOCK_GROUNDING_VIDEOS, COLORS } from '../constants';
import { VisualReminder, TimeOfDay } from '../types';
import GroundingButton from './GroundingButton';
// OLD
// import { generateMorningBriefing } from "../services/geminiService";

// NEW
import { generateMorningBriefing } from "../services/services/localService";



interface SeniorAppProps {
  reminders: VisualReminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: VisualReminder) => void;
  onDeleteReminder: (id: string) => void;
}

const SeniorApp: React.FC<SeniorAppProps> = ({ reminders, onToggleReminder, onAddReminder, onDeleteReminder }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [briefing, setBriefing] = useState<string>("Loading your morning briefing...");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isImporting, setIsImporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Get current readable date
  const todayReadable = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    const fetchBriefing = async () => {
      const schedule = reminders.filter(r => r.date === selectedDate).map(r => `${r.time}: ${r.title}`);
      const text = await generateMorningBriefing("Dad", schedule);
      setBriefing(text);
    };
    fetchBriefing();
  }, [selectedDate, reminders.length]);

  const handleGoogleSync = () => {
    setIsImporting(true);
    // Simulated Google OAuth Flow
    setTimeout(() => {
      const googleEvent: VisualReminder = {
        id: Math.random().toString(),
        title: "Coffee with Uncle Bob",
        description: "Bob is stopping by to say hello.",
        imageUrl: "https://images.unsplash.com/photo-1544145945-f904253d0c7e?auto=format&fit=crop&q=80&w=400",
        time: "11:30 AM",
        date: selectedDate,
        completed: false,
        type: 'OTHER'
      };
      onAddReminder(googleEvent);
      setIsImporting(false);
    }, 1500);
  };

  const filteredReminders = reminders.filter(r => r.date === selectedDate);
  const activeVideo = MOCK_GROUNDING_VIDEOS[0];

  return (
    <div className="min-h-screen p-6 pb-40 transition-colors duration-1000 bg-[#FDFBF7]">
      <header className="mb-10 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-2" style={{ color: COLORS.text }}>
            Today's Echo
          </h1>
          <p className="text-lg font-bold text-orange-500 mb-6 uppercase tracking-widest">{todayReadable}</p>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-orange-100 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-2xl leading-relaxed text-gray-700 italic font-medium relative z-10">
              "{briefing}"
            </p>
          </div>
        </div>

        <div className="w-full md:w-72 space-y-4">
          <button 
            onClick={handleGoogleSync}
            disabled={isImporting}
            className="w-full bg-white border-2 border-gray-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            {isImporting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold text-blue-500">Connecting Google...</span>
              </div>
            ) : (
              <>
                <img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png" className="w-8 h-8 group-hover:rotate-12 transition-transform" alt="Google Calendar" />
                <span className="font-bold text-gray-700">Import Events</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full bg-orange-500 text-white p-5 rounded-[2rem] shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all font-bold text-lg active:scale-95"
          >
            + Add New Note
          </button>
        </div>
      </header>

      {/* Date Selector */}
      <div className="max-w-4xl mx-auto mb-12 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {[-2, -1, 0, 1, 2, 3, 4].map(offset => {
          const d = new Date();
          d.setDate(d.getDate() + offset);
          const dateStr = d.toISOString().split('T')[0];
          const isSelected = dateStr === selectedDate;
          const isToday = offset === 0;
          
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-shrink-0 w-24 py-4 rounded-3xl transition-all flex flex-col items-center border-4 ${isSelected ? 'bg-orange-500 border-orange-500 text-white shadow-xl scale-110 z-10' : 'bg-white border-white text-gray-400 hover:border-orange-100'}`}
            >
              <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-orange-100' : 'text-gray-300'}`}>
                {isToday ? 'TODAY' : d.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-3xl font-black">{d.getDate()}</span>
              <span className={`text-[10px] font-bold ${isSelected ? 'text-orange-200' : 'text-gray-300'}`}>
                {d.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>

      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 px-2">
          <h2 className="text-3xl font-bold text-gray-800">Your Activity List</h2>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
              {filteredReminders.filter(r => r.completed).length} / {filteredReminders.length} DONE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredReminders.map((reminder) => (
            <div 
              key={reminder.id}
              className={`
                relative group overflow-hidden rounded-[3rem] bg-white border-8 transition-all duration-500
                ${reminder.completed ? 'border-green-400 opacity-60 grayscale-[0.5]' : 'border-white shadow-2xl'}
              `}
            >
              <div onClick={() => onToggleReminder(reminder.id)} className="cursor-pointer">
                <img src={reminder.imageUrl} alt={reminder.title} className="w-full h-64 object-cover" />
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xl font-black uppercase tracking-widest text-orange-500">{reminder.time}</span>
                    {reminder.completed && (
                      <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{reminder.title}</h3>
                  <p className="text-gray-500 text-xl leading-relaxed">{reminder.description}</p>
                </div>
              </div>
              
              {/* Senior can delete their own created tasks */}
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteReminder(reminder.id); }}
                className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          ))}

          {filteredReminders.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white/50 rounded-[3rem] border-4 border-dashed border-gray-100">
               <div className="mb-6 opacity-20">
                 <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               </div>
               <p className="text-2xl font-bold text-gray-400">Nothing on the calendar today.</p>
               <p className="text-gray-400 mt-2">Time to relax and enjoy the moment.</p>
            </div>
          )}
        </div>
      </main>

      {/* Simple Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-3xl font-black text-gray-800 mb-6">Add a Note</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">What's happening?</label>
                <input 
                  type="text" 
                  id="new-task-title"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-xl outline-none focus:border-orange-500"
                  placeholder="Task Name"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">What time?</label>
                <input 
                  type="time" 
                  id="new-task-time"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-xl outline-none focus:border-orange-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const title = (document.getElementById('new-task-title') as HTMLInputElement).value;
                    const time = (document.getElementById('new-task-time') as HTMLInputElement).value;
                    if (title && time) {
                      onAddReminder({
                        id: Math.random().toString(),
                        title,
                        description: "Self-added reminder.",
                        imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=400",
                        time: time,
                        date: selectedDate,
                        completed: false,
                        type: 'OTHER'
                      });
                      setShowAddModal(false);
                    }
                  }}
                  className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-100"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-gray-900">
             <video src={activeVideo.videoUrl} autoPlay className="w-full h-full object-contain" onEnded={() => setShowVideo(false)} />
             <div className="absolute top-10 left-10 flex items-center bg-black/40 backdrop-blur-xl p-5 rounded-[2rem] border border-white/20">
               <img src={activeVideo.thumbnailUrl} className="w-20 h-20 rounded-2xl border-2 border-white mr-5" alt="Sender" />
               <div className="text-white">
                 <p className="text-sm font-bold uppercase opacity-60 tracking-widest">A Message from</p>
                 <p className="text-3xl font-black">{activeVideo.sender}</p>
               </div>
             </div>
             <button onClick={() => setShowVideo(false)} className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center text-white transition-all">
               <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="absolute bottom-12 left-0 right-0 text-center px-12">
                <p className="text-white text-4xl font-black drop-shadow-2xl leading-tight">"You are safe. You are home. Everything is okay."</p>
             </div>
          </div>
        </div>
      )}

      <GroundingButton onPress={() => setShowVideo(true)} />
    </div>
  );
};

export default SeniorApp;
