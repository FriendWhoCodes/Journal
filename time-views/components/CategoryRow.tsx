'use client';

import { useState, useCallback } from 'react';
import { type Category, CATEGORY_COLORS } from '@/lib/utils';
import HourInput from './HourInput';
import AccomplishmentList from './AccomplishmentList';

interface Accomplishment {
  id: string;
  content: string;
  completed: boolean;
}

interface CategoryRowProps {
  category: Category;
  year: number;
  week: number;
  hours: number;
  notes: string;
  accomplishments: Accomplishment[];
  onUpdate: (updates: {
    hours?: number;
    notes?: string;
    accomplishments?: Accomplishment[];
  }) => void;
}

export default function CategoryRow({
  category,
  year,
  week,
  hours,
  notes,
  accomplishments,
  onUpdate,
}: CategoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const color = CATEGORY_COLORS[category];

  const saveEntry = useCallback(async (newHours: number, newNotes?: string) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          week,
          category,
          hours: newHours,
          notes: newNotes ?? notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      onUpdate({ hours: newHours, notes: newNotes ?? notes });
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [year, week, category, notes, onUpdate]);

  const handleHoursChange = useCallback((newHours: number) => {
    saveEntry(newHours);
  }, [saveEntry]);

  const addAccomplishment = useCallback(async (content: string) => {
    try {
      const response = await fetch('/api/entries/accomplishments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          week,
          category,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add accomplishment');
      }

      const { accomplishment } = await response.json();
      onUpdate({
        accomplishments: [...accomplishments, accomplishment],
      });
    } catch (error) {
      console.error('Add accomplishment error:', error);
    }
  }, [year, week, category, accomplishments, onUpdate]);

  const updateAccomplishment = useCallback(async (id: string, updates: Partial<Accomplishment>) => {
    try {
      const response = await fetch('/api/entries/accomplishments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update accomplishment');
      }

      onUpdate({
        accomplishments: accomplishments.map(a =>
          a.id === id ? { ...a, ...updates } : a
        ),
      });
    } catch (error) {
      console.error('Update accomplishment error:', error);
    }
  }, [accomplishments, onUpdate]);

  const deleteAccomplishment = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/entries/accomplishments?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete accomplishment');
      }

      onUpdate({
        accomplishments: accomplishments.filter(a => a.id !== id),
      });
    } catch (error) {
      console.error('Delete accomplishment error:', error);
    }
  }, [accomplishments, onUpdate]);

  return (
    <div className="border-l-4" style={{ borderColor: color }}>
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-medium text-gray-900">{category}</span>
          {accomplishments.length > 0 && (
            <span className="text-xs text-gray-400">
              {accomplishments.filter(a => a.completed).length}/{accomplishments.length} done
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <HourInput
            value={hours}
            onChange={handleHoursChange}
            disabled={isSaving}
          />
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 bg-gray-50">
          <AccomplishmentList
            accomplishments={accomplishments}
            onAdd={addAccomplishment}
            onUpdate={updateAccomplishment}
            onDelete={deleteAccomplishment}
            color={color}
          />
        </div>
      )}
    </div>
  );
}
