'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PriorityModeData,
  Priority,
  Goal,
  Milestone,
  Identity,
  createInitialPriorityModeData,
  createEmptyPriority,
  createEmptyGoal,
  createEmptyMilestone,
  PRIORITY_MODE_STEPS,
} from '../types/priority';

const STORAGE_KEY = 'priority_mode_data';

interface PriorityModeContextType {
  data: PriorityModeData;
  isLoaded: boolean;

  // Navigation
  setCurrentStep: (step: number) => void;
  setCurrentPriorityIndex: (index: number) => void;

  // Priority operations
  addPriority: () => void;
  updatePriority: (id: string, updates: Partial<Priority>) => void;
  removePriority: (id: string) => void;
  reorderPriorities: (priorities: Priority[]) => void;

  // Goal operations
  addGoal: (priorityId: string) => void;
  updateGoal: (priorityId: string, goalId: string, updates: Partial<Goal>) => void;
  removeGoal: (priorityId: string, goalId: string) => void;

  // Milestone operations
  addMilestone: (priorityId: string, goalId: string, period: string) => void;
  updateMilestone: (priorityId: string, goalId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  removeMilestone: (priorityId: string, goalId: string, milestoneId: string) => void;
  addTask: (priorityId: string, goalId: string, milestoneId: string, task: string) => void;
  removeTask: (priorityId: string, goalId: string, milestoneId: string, taskIndex: number) => void;

  // Identity operations
  updateIdentity: (updates: Partial<Identity>) => void;

  // Finalization
  finalize: () => void;

  // Reset
  resetAll: () => void;
}

const PriorityModeContext = createContext<PriorityModeContextType | undefined>(undefined);

// Storage helpers
const saveToStorage = (data: PriorityModeData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

const loadFromStorage = (): PriorityModeData | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const clearStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export function PriorityModeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PriorityModeData>(createInitialPriorityModeData());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setData(stored);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveToStorage({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [data, isLoaded]);

  // Helper to update data with timestamp
  const updateData = useCallback((updates: Partial<PriorityModeData>) => {
    setData(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Navigation
  const setCurrentStep = useCallback((step: number) => {
    updateData({ currentStep: step });
  }, [updateData]);

  const setCurrentPriorityIndex = useCallback((index: number) => {
    updateData({ currentPriorityIndex: index });
  }, [updateData]);

  // Priority operations
  const addPriority = useCallback(() => {
    setData(prev => {
      if (prev.priorities.length >= 10) return prev;
      const newOrder = prev.priorities.length + 1;
      return {
        ...prev,
        priorities: [...prev.priorities, createEmptyPriority(newOrder)],
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updatePriority = useCallback((id: string, updates: Partial<Priority>) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p =>
        p.id === id ? { ...p, ...updates } : p
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removePriority = useCallback((id: string) => {
    setData(prev => {
      const filtered = prev.priorities.filter(p => p.id !== id);
      // Reorder remaining priorities
      const reordered = filtered.map((p, index) => ({ ...p, order: index + 1 }));
      return {
        ...prev,
        priorities: reordered,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const reorderPriorities = useCallback((priorities: Priority[]) => {
    setData(prev => ({
      ...prev,
      priorities: priorities.map((p, index) => ({ ...p, order: index + 1 })),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Goal operations
  const addGoal = useCallback((priorityId: string) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => {
        if (p.id === priorityId && p.goals.length < 5) {
          return { ...p, goals: [...p.goals, createEmptyGoal()] };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateGoal = useCallback((priorityId: string, goalId: string, updates: Partial<Goal>) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => {
        if (p.id === priorityId) {
          return {
            ...p,
            goals: p.goals.map(g =>
              g.id === goalId ? { ...g, ...updates } : g
            ),
          };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeGoal = useCallback((priorityId: string, goalId: string) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => {
        if (p.id === priorityId) {
          return {
            ...p,
            goals: p.goals.filter(g => g.id !== goalId),
          };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Milestone operations
  const addMilestone = useCallback((priorityId: string, goalId: string, period: string) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => {
        if (p.id === priorityId) {
          return {
            ...p,
            goals: p.goals.map(g => {
              if (g.id === goalId) {
                return {
                  ...g,
                  milestones: [...g.milestones, createEmptyMilestone(period)],
                };
              }
              return g;
            }),
          };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const updateMilestone = useCallback((
    priorityId: string,
    goalId: string,
    milestoneId: string,
    updates: Partial<Milestone>
  ) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => {
        if (p.id === priorityId) {
          return {
            ...p,
            goals: p.goals.map(g => {
              if (g.id === goalId) {
                return {
                  ...g,
                  milestones: g.milestones.map(m =>
                    m.id === milestoneId ? { ...m, ...updates } : m
                  ),
                };
              }
              return g;
            }),
          };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeMilestone = useCallback((priorityId: string, goalId: string, milestoneId: string) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => {
        if (p.id === priorityId) {
          return {
            ...p,
            goals: p.goals.map(g => {
              if (g.id === goalId) {
                return {
                  ...g,
                  milestones: g.milestones.filter(m => m.id !== milestoneId),
                };
              }
              return g;
            }),
          };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addTask = useCallback((
    priorityId: string,
    goalId: string,
    milestoneId: string,
    task: string
  ) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => {
        if (p.id === priorityId) {
          return {
            ...p,
            goals: p.goals.map(g => {
              if (g.id === goalId) {
                return {
                  ...g,
                  milestones: g.milestones.map(m => {
                    if (m.id === milestoneId) {
                      return { ...m, tasks: [...m.tasks, task] };
                    }
                    return m;
                  }),
                };
              }
              return g;
            }),
          };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const removeTask = useCallback((
    priorityId: string,
    goalId: string,
    milestoneId: string,
    taskIndex: number
  ) => {
    setData(prev => ({
      ...prev,
      priorities: prev.priorities.map(p => {
        if (p.id === priorityId) {
          return {
            ...p,
            goals: p.goals.map(g => {
              if (g.id === goalId) {
                return {
                  ...g,
                  milestones: g.milestones.map(m => {
                    if (m.id === milestoneId) {
                      return {
                        ...m,
                        tasks: m.tasks.filter((_, i) => i !== taskIndex),
                      };
                    }
                    return m;
                  }),
                };
              }
              return g;
            }),
          };
        }
        return p;
      }),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Identity operations
  const updateIdentity = useCallback((updates: Partial<Identity>) => {
    setData(prev => ({
      ...prev,
      identity: { ...prev.identity, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Finalization
  const finalize = useCallback(() => {
    updateData({ finalizedAt: new Date().toISOString() });
  }, [updateData]);

  // Reset
  const resetAll = useCallback(() => {
    setData(createInitialPriorityModeData());
    clearStorage();
  }, []);

  return (
    <PriorityModeContext.Provider
      value={{
        data,
        isLoaded,
        setCurrentStep,
        setCurrentPriorityIndex,
        addPriority,
        updatePriority,
        removePriority,
        reorderPriorities,
        addGoal,
        updateGoal,
        removeGoal,
        addMilestone,
        updateMilestone,
        removeMilestone,
        addTask,
        removeTask,
        updateIdentity,
        finalize,
        resetAll,
      }}
    >
      {children}
    </PriorityModeContext.Provider>
  );
}

export function usePriorityMode() {
  const context = useContext(PriorityModeContext);
  if (!context) {
    throw new Error('usePriorityMode must be used within PriorityModeProvider');
  }
  return context;
}
