export type Mode = 'quick' | 'deep';

export interface QuickModeData {
  name: string;
  topGoals: [string, string, string];
  habitsToBuild: string[]; // Changed from string to array for checkboxes
  habitsToBreak: string[]; // Changed from string to array for checkboxes
  mainTheme: string;
  placesToVisit: string;
  booksToRead: string;
  moviesToWatch: string;
  experiencesToHave: string;
}

// Simplified category for Deep Mode - just goal and why (no habits)
export interface DeepModeCategory {
  goal: string;
  why: string;
}

export interface DeepModeData {
  name: string;
  // Panel 1: Goals & Habits (like Quick Mode)
  topGoals: [string, string, string];
  habitsToBuild: string[]; // Overall habits to build
  habitsToBreak: string[]; // Overall habits to break
  mainTheme: string;

  // Panels 2-7: Category Deep Dives (goal + why only, NO habits)
  health: DeepModeCategory;
  relationships: DeepModeCategory;
  wealth: DeepModeCategory;
  career: DeepModeCategory;
  growth: DeepModeCategory;
  impact: DeepModeCategory;

  // Panel 8: Fun
  placesToVisit: string;
  booksToRead: string;
  moviesToWatch: string;
  experiencesToHave: string;
}

export interface GoalSetterResponse {
  id: string;
  email: string;
  name: string;
  mode: Mode;
  topGoals?: string[];
  habitsToBuild?: string[];
  habitsToBreak?: string[];
  mainTheme?: string;
  deepModeData?: Record<string, DeepModeCategory>;
  placesToVisit?: string[];
  booksToRead?: string[];
  moviesToWatch?: string[];
  experiencesToHave?: string[];
  completedAt: Date;
}
