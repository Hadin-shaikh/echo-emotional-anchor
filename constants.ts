
import { VisualReminder, GroundingVideo } from './types';

export const COLORS = {
  primary: '#5B8E7D', // Sage Green
  secondary: '#EAC086', // Soft Orange/Beige
  accent: '#F4A261', // Warm Orange
  background: '#FDFBF7',
  text: '#2D3436',
  error: '#E76F51'
};

const getToday = () => new Date().toISOString().split('T')[0];

export const MOCK_REMINDERS: VisualReminder[] = [
  {
    id: '1',
    title: 'Morning Medication',
    description: 'Take one blue pill from the white bottle.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    time: '08:00 AM',
    date: getToday(),
    completed: true,
    type: 'MEDICINE'
  },
  {
    id: '2',
    title: 'Lunch with Priya',
    description: 'Priya is coming over for lunch at the dining table.',
    imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&q=80&w=400',
    time: '12:30 PM',
    date: getToday(),
    completed: false,
    type: 'MEAL'
  },
  {
    id: '3',
    title: 'Evening Walk',
    description: 'Walk in the garden for 15 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1501333157012-706509a2631a?auto=format&fit=crop&q=80&w=400',
    time: '05:00 PM',
    date: getToday(),
    completed: false,
    type: 'OTHER'
  }
];

export const MOCK_GROUNDING_VIDEOS: GroundingVideo[] = [
  {
    id: 'v1',
    title: 'Morning Reassurance',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    sender: 'Priya (Daughter)'
  }
];
