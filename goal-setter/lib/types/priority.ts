// Priority Mode Types
// Philosophy: Why → What → When → How → Who

export interface Milestone {
  id: string;
  period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | string; // Quarter or month
  description: string;
  tasks: string[];
}

export interface Goal {
  id: string;
  what: string;
  byWhen: string; // "Q1 2026", "March 2026", etc.
  successLooksLike: string;
  milestones: Milestone[];
}

export interface Priority {
  id: string;
  name: string;
  why: string;
  order: number; // 1-10, determines importance
  goals: Goal[];
}

export interface Identity {
  habitsToBuild: string;
  habitsToEliminate: string;
  beliefsToHold: string;
  personWhoAchieves: string;
  iAmSomeoneWho: string; // Final identity statement
}

export interface PriorityModeData {
  priorities: Priority[];
  identity: Identity;
  currentStep: number;
  currentPriorityIndex: number; // For tracking which priority we're setting goals for
  wisdomMode: boolean;
  wisdomType: WisdomType | null; // 'ai' ($29.99) or 'manual' ($99)
  createdAt: string;
  updatedAt: string;
  finalizedAt: string | null;
}

// Step definitions for progress tracking
export const PRIORITY_MODE_STEPS = {
  ONBOARDING: 0,
  PRIORITIES: 1,
  GOALS: 2,
  MILESTONES: 3,
  IDENTITY: 4,
  REVIEW: 5,
  COMPLETE: 6,
} as const;

export const PRIORITY_MODE_STEP_NAMES = [
  'Welcome',
  'Priorities',
  'Goals',
  'Milestones',
  'Identity',
  'Review',
  'Complete',
] as const;

export const TOTAL_PRIORITY_MODE_STEPS = 6; // Excluding complete

// Helper to create empty data structures
export const createEmptyPriority = (order: number): Priority => ({
  id: crypto.randomUUID(),
  name: '',
  why: '',
  order,
  goals: [],
});

export const createEmptyGoal = (): Goal => ({
  id: crypto.randomUUID(),
  what: '',
  byWhen: '',
  successLooksLike: '',
  milestones: [],
});

export const createEmptyMilestone = (period: string): Milestone => ({
  id: crypto.randomUUID(),
  period,
  description: '',
  tasks: [],
});

export const createEmptyIdentity = (): Identity => ({
  habitsToBuild: '',
  habitsToEliminate: '',
  beliefsToHold: '',
  personWhoAchieves: '',
  iAmSomeoneWho: '',
});

export const createInitialPriorityModeData = (): PriorityModeData => ({
  priorities: [createEmptyPriority(1)],
  identity: createEmptyIdentity(),
  currentStep: PRIORITY_MODE_STEPS.ONBOARDING,
  currentPriorityIndex: 0,
  wisdomMode: false,
  wisdomType: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  finalizedAt: null,
});

// Validation helpers
export const isPriorityValid = (priority: Priority): boolean => {
  return priority.name.trim().length > 0;
};

export const isGoalValid = (goal: Goal): boolean => {
  return goal.what.trim().length > 0;
};

export const canAddMorePriorities = (priorities: Priority[]): boolean => {
  return priorities.length < 10;
};

export const canAddMoreGoals = (goals: Goal[]): boolean => {
  return goals.length < 5;
};

// Wisdom Mode Types
export type WisdomType = 'ai' | 'manual';
export type WisdomFeedbackStatus = 'pending' | 'in_progress' | 'reviewed';

export interface WisdomFeedback {
  id: string;
  submissionId: string;
  priorityAnalysis: string | null;
  goalFeedback: string | null;
  suggestions: string | null;
  identityInsights: string | null;
  overallWisdom: string | null;
  status: WisdomFeedbackStatus;
  reviewedAt: string | null;
  notificationSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const WISDOM_FEEDBACK_SECTIONS = [
  { key: 'priorityAnalysis' as const, title: 'Priority Analysis', description: 'Analysis of how well their priorities are defined and ordered', icon: '🎯' },
  { key: 'goalFeedback' as const, title: 'Goal Feedback', description: 'Feedback on specific goals under each priority', icon: '📝' },
  { key: 'suggestions' as const, title: 'Suggestions', description: 'Concrete suggestions for improvement or refinement', icon: '💡' },
  { key: 'identityInsights' as const, title: 'Identity Insights', description: 'Observations about their identity transformation section', icon: '🦋' },
  { key: 'overallWisdom' as const, title: 'Overall Wisdom', description: 'High-level guidance and encouragement', icon: '🦉' },
];
