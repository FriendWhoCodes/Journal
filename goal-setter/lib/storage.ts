import { QuickModeData, DeepModeData, Mode } from './types';

const STORAGE_KEY = 'goal_setter_data';

export interface StorageData {
  mode?: Mode;
  name?: string;
  currentStep?: number;
  quickMode?: Partial<QuickModeData>;
  deepMode?: Partial<DeepModeData>;
  email?: string;
}

export const storage = {
  save: (data: StorageData) => {
    if (typeof window !== 'undefined') {
      const existing = storage.load();
      const updated = { ...existing, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  },

  load: (): StorageData => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    }
    return {};
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  saveProgress: (step: number, data: any) => {
    storage.save({ currentStep: step, ...data });
  }
};
