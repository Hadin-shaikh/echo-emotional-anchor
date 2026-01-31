
export enum AppMode {
  SENIOR = 'SENIOR',
  CAREGIVER = 'CAREGIVER'
}

export enum TimeOfDay {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING'
}

export interface VisualReminder {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  type: 'MEDICINE' | 'MEAL' | 'APPOINTMENT' | 'OTHER';
}

export interface GroundingVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  sender: string;
}

export interface AnxietyData {
  time: string;
  level: number;
}

export interface Briefing {
  text: string;
  audioUrl?: string;
}
