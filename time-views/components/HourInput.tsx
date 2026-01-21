'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface HourInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function HourInput({ value, onChange, disabled }: HourInputProps) {
  const [localValue, setLocalValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString());
    }
  }, [value, isFocused]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Debounce the save
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const parsed = parseFloat(newValue);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 168) {
        onChange(parsed);
      }
    }, 500);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseFloat(localValue);
    if (isNaN(parsed) || parsed < 0) {
      setLocalValue('0');
      onChange(0);
    } else if (parsed > 168) {
      setLocalValue('168');
      onChange(168);
    } else {
      setLocalValue(parsed.toString());
      onChange(parsed);
    }
  }, [localValue, onChange]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center gap-1" onClick={handleClick}>
      <input
        ref={inputRef}
        type="number"
        value={localValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        disabled={disabled}
        min="0"
        max="168"
        step="0.5"
        className="w-16 px-2 py-1 text-right text-sm border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-gray-100"
      />
      <span className="text-sm text-gray-500">h</span>
    </div>
  );
}
