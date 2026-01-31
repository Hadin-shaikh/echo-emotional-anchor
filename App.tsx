
import React, { useState, useEffect, useMemo } from 'react';
import SeniorApp from './components/SeniorApp';
import CaregiverDashboard from './components/CaregiverDashboard';
import { AppMode, VisualReminder } from './types';
import { MOCK_REMINDERS } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.SENIOR);
  const [reminders, setReminders] = useState<VisualReminder[]>(() => {
    const saved = localStorage.getItem('echo_reminders');
    const today = new Date().toISOString().split('T')[0];
    if (saved) {
      return JSON.parse(saved);
    }
    // Update mock dates to today's real date on first load
    return MOCK_REMINDERS.map(r => ({ ...r, date: today }));
  });

  useEffect(() => {
    localStorage.setItem('echo_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (reminder: VisualReminder) => {
    setReminders(prev => [...prev, reminder]);
  };

  const updateReminder = (id: string, updates: Partial<VisualReminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Calculate dynamic "Comfort Level" statistics for the last 7 days
  const comfortStats = useMemo(() => {
    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = reminders.filter(r => r.date === dateStr);
      
      let level = 5; // Default neutral level
      if (dayTasks.length > 0) {
        const completed = dayTasks.filter(r => r.completed).length;
        // Comfort Level: (completed / total) * 10
        level = Math.round((completed / dayTasks.length) * 10);
      } else {
        // If no tasks, we assume comfort is based on historical average or neutral
        level = 8; 
      }

      stats.push({
        time: d.toLocaleDateString('en-US', { weekday: 'short' }),
        level: level,
        fullDate: dateStr
      });
    }
    return stats;
  }, [reminders]);

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-[100] flex bg-white/90 backdrop-blur-md shadow-xl rounded-full p-1.5 border border-gray-200">
        <button 
          onClick={() => setMode(AppMode.SENIOR)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === AppMode.SENIOR ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
        >
          SENIOR VIEW
        </button>
        <button 
          onClick={() => setMode(AppMode.CAREGIVER)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === AppMode.CAREGIVER ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
        >
          CAREGIVER VIEW
        </button>
      </div>

      {mode === AppMode.SENIOR ? (
        <SeniorApp 
          reminders={reminders} 
          onToggleReminder={(id) => updateReminder(id, { completed: !reminders.find(r => r.id === id)?.completed })}
          onAddReminder={addReminder}
          onDeleteReminder={deleteReminder}
        />
      ) : (
        <CaregiverDashboard 
          reminders={reminders}
          comfortStats={comfortStats}
          onAddReminder={addReminder}
          onDeleteReminder={deleteReminder}
          onUpdateReminder={updateReminder}
        />
      )}

      <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
        <div className="bg-black/5 px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter text-black/20 uppercase">
          ECHO ECOSYSTEM • LIVE {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default App;
