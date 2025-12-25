'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';

export default function Home() {
  const router = useRouter();
  const { name, setName, setMode } = useGoalSetter();
  const [localName, setLocalName] = useState(name || '');
  const [showModeSelection, setShowModeSelection] = useState(!!name);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName.trim()) {
      setName(localName.trim());
      setShowModeSelection(true);
    }
  };

  const handleModeSelection = (mode: 'quick' | 'deep') => {
    setMode(mode);
    router.push(mode === 'quick' ? '/quick' : '/deep');
  };

  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome, {name}! 👋
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let&apos;s plan your 2026. Choose your goal-setting journey:
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Quick Mode */}
            <div
              onClick={() => handleModeSelection('quick')}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-indigo-500"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-indigo-600">Quick Mode</h2>
                <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ~5 minutes
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                Perfect for busy people who want to get started fast.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-gray-700">Set your top 3 goals for 2026</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-gray-700">Choose 1 habit to build & 1 to break</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-gray-700">Define your theme for the year</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✓</span>
                  <span className="text-gray-700">Plan your travel, books & experiences</span>
                </li>
              </ul>

              <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors">
                Start Quick Setup →
              </button>
            </div>

            {/* Deep Mode */}
            <div
              onClick={() => handleModeSelection('deep')}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-purple-600">Deep Mode</h2>
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ~30 minutes
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                For those who want comprehensive life planning across all areas.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span className="text-gray-700">Deep dive into 6 life categories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span className="text-gray-700">Health, Career, Wealth & Relationships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span className="text-gray-700">Personal Growth & Impact goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span className="text-gray-700">Detailed habit planning for each area</span>
                </li>
              </ul>

              <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors">
                Start Deep Planning →
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              Don&apos;t worry - you can always come back and change your goals before January 1st
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Name Entry Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">2026</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Set your goals in 5 minutes
          </p>
          <p className="text-lg text-gray-500">
            and unlock <strong>1 month free</strong> access to Man of Wisdom Journal
          </p>
        </div>

        {/* Name Entry Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleNameSubmit}>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-3">
              What&apos;s your name?
            </label>
            <input
              id="name"
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              autoFocus
              required
            />
            <button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Continue →
            </button>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Trusted by 10,000+ Man of Wisdom followers</p>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">5 min</div>
              <div className="text-sm text-gray-500">Quick Setup</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Free</div>
              <div className="text-sm text-gray-500">1 Month Journal</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">Jan 1</div>
              <div className="text-sm text-gray-500">Launch Date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
