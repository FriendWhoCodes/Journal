export type Mode = 'quick' | 'deep';

export interface QuickModeData {
  name: string;
  topGoals: [string, string, string];
  habitToBuild: string;
  habitToBreak: string;
  mainTheme: string;
  placesToVisit: string;
  booksToRead: string;
  experiencesToHave: string;
}

export interface DeepModeCategory {
  goal: string;
  habitsBuild: string;
  habitsBreak: string;
  why: string;
}

export interface DeepModeData {
  name: string;
  health: DeepModeCategory;
  career: DeepModeCategory;
  wealth: DeepModeCategory;
  relationships: DeepModeCategory;
  growth: DeepModeCategory;
  impact: DeepModeCategory;
  placesToVisit: string;
  booksToRead: string;
  experiencesToHave: string;
}

export interface GoalSetterResponse {
  id: string;
  email: string;
  name: string;
  mode: Mode;
  topGoals?: string[];
  habitToBuild?: string;
  habitToBreak?: string;
  mainTheme?: string;
  deepModeData?: Record<string, DeepModeCategory>;
  placesToVisit?: string[];
  booksToRead?: string[];
  experiencesToHave?: string[];
  completedAt: Date;
}
