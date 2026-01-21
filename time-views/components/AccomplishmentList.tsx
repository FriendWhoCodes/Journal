'use client';

import { useState, useCallback } from 'react';

interface Accomplishment {
  id: string;
  content: string;
  completed: boolean;
}

interface AccomplishmentListProps {
  accomplishments: Accomplishment[];
  onAdd: (content: string) => void;
  onUpdate: (id: string, updates: Partial<Accomplishment>) => void;
  onDelete: (id: string) => void;
  color: string;
}

export default function AccomplishmentList({
  accomplishments,
  onAdd,
  onUpdate,
  onDelete,
  color,
}: AccomplishmentListProps) {
  const [newContent, setNewContent] = useState('');

  const handleAdd = useCallback(() => {
    if (newContent.trim()) {
      onAdd(newContent.trim());
      setNewContent('');
    }
  }, [newContent, onAdd]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  }, [handleAdd]);

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        Accomplishments
      </p>

      {accomplishments.length > 0 && (
        <ul className="space-y-1">
          {accomplishments.map(accomplishment => (
            <li
              key={accomplishment.id}
              className="flex items-start gap-2 group"
            >
              <button
                onClick={() => onUpdate(accomplishment.id, { completed: !accomplishment.completed })}
                className="mt-0.5 flex-shrink-0"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                    accomplishment.completed
                      ? 'border-transparent'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={accomplishment.completed ? { backgroundColor: color } : {}}
                >
                  {accomplishment.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>

              <span
                className={`flex-1 text-sm ${
                  accomplishment.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}
              >
                {accomplishment.content}
              </span>

              <button
                onClick={() => onDelete(accomplishment.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add accomplishment..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={!newContent.trim()}
          className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
