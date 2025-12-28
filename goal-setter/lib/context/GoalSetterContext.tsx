'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Mode, QuickModeData, DeepModeData } from '../types';
import { storage, StorageData } from '../storage';

interface GoalSetterContextType {
  mode: Mode | null;
  name: string;
  currentStep: number;
  quickModeData: Partial<QuickModeData>;
  deepModeData: Partial<DeepModeData>;
  email: string;
  setMode: (mode: Mode) => void;
  setName: (name: string) => void;
  setCurrentStep: (step: number) => void;
  updateQuickModeData: (data: Partial<QuickModeData>) => void;
  updateDeepModeData: (data: Partial<DeepModeData>) => void;
  setEmail: (email: string) => void;
  resetAll: () => void;
}

const GoalSetterContext = createContext<GoalSetterContextType | undefined>(undefined);

export function GoalSetterProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode | null>(null);
  const [name, setNameState] = useState('');
  const [currentStep, setCurrentStepState] = useState(0);
  const [quickModeData, setQuickModeData] = useState<Partial<QuickModeData>>({});
  const [deepModeData, setDeepModeData] = useState<Partial<DeepModeData>>({});
  const [email, setEmailState] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = storage.load();
    if (stored.mode) setModeState(stored.mode);
    if (stored.name) setNameState(stored.name);
    if (stored.currentStep) setCurrentStepState(stored.currentStep);
    if (stored.quickMode) setQuickModeData(stored.quickMode);
    if (stored.deepMode) setDeepModeData(stored.deepMode);
    if (stored.email) setEmailState(stored.email);
  }, []);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    storage.save({ mode: newMode });
  };

  const setName = (newName: string) => {
    setNameState(newName);
    storage.save({ name: newName });
  };

  const setCurrentStep = (step: number) => {
    setCurrentStepState(step);
    storage.save({ currentStep: step });
  };

  const updateQuickModeData = (data: Partial<QuickModeData>) => {
    setQuickModeData(prev => {
      const updated = { ...prev, ...data };
      storage.save({ quickMode: updated });
      return updated;
    });
  };

  const updateDeepModeData = (data: Partial<DeepModeData>) => {
    setDeepModeData(prev => {
      const updated = { ...prev, ...data };
      storage.save({ deepMode: updated });
      return updated;
    });
  };

  const setEmail = (newEmail: string) => {
    setEmailState(newEmail);
    storage.save({ email: newEmail });
  };

  const resetAll = () => {
    setModeState(null);
    setNameState('');
    setCurrentStepState(0);
    setQuickModeData({});
    setDeepModeData({});
    setEmailState('');
    storage.clear();
  };

  return (
    <GoalSetterContext.Provider
      value={{
        mode,
        name,
        currentStep,
        quickModeData,
        deepModeData,
        email,
        setMode,
        setName,
        setCurrentStep,
        updateQuickModeData,
        updateDeepModeData,
        setEmail,
        resetAll,
      }}
    >
      {children}
    </GoalSetterContext.Provider>
  );
}

export function useGoalSetter() {
  const context = useContext(GoalSetterContext);
  if (!context) {
    throw new Error('useGoalSetter must be used within GoalSetterProvider');
  }
  return context;
}
