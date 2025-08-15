// Shared types for Firebase Functions

export interface Poem {
  inputWord: string;
  mood: string;
  lines: string[];
  createdAt: Date;
  usedAI: boolean;
  fallbackMessage?: string;
}

export interface DailyUsage {
  date: string; // YYYY-MM-DD format
  count: number;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageStats {
  current: number;
  limit: number;
  remaining: number;
  resetTime: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  category: string;
  title: string;
  content: string;
  isPrivate: boolean;
  status: 'pending' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

export type MoodType = 'funny' | 'warm' | 'creative' | 'poetic';