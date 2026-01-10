'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';

export default function Home() {
  const router = useRouter();
  const { name, setName, email, setEmail, setMode } = useGoalSetter();
  const [localName, setLocalName] = useState(name || '');
  const [localEmail, setLocalEmail] = useState(email || '');
  const [showModeSelection, setShowModeSelection] = useState(!!name && !!email);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName.trim() && localEmail.trim()) {
      setName(localName.trim());
      setEmail(localEmail.trim());
      setShowModeSelection(true);
    }
  };

  const handleModeSelection = (mode: 'quick' | 'deep') => {
    setMode(mode);
    router.push(mode === 'quick' ? '/quick' : '/deep');
  };

  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome, {name}!
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Let&apos;s plan your 2026. Choose your goal-setting journey:
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Quick Mode */}
            <div
              onClick={() => handleModeSelection('quick')}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-amber-500"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Quick Mode</h2>
                <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ~5 minutes
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                Perfect for busy people who want to get started fast.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Set your top 3 goals for 2026</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Choose 1 habit to build & 1 to break</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Define your theme for the year</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Plan your travel, books & experiences</span>
                </li>
              </ul>

              <button className="w-full bg-amber-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-amber-700 transition-colors">
                Start Quick Setup →
              </button>
            </div>

            {/* Deep Mode */}
            <div
              onClick={() => handleModeSelection('deep')}
              className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-slate-500"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Deep Mode</h2>
                <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ~30 minutes
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                For those who want comprehensive life planning across all areas.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Deep dive into 6 life categories</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Health, Career, Wealth & Relationships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Personal Growth & Impact goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 text-xl">•</span>
                  <span className="text-gray-700">Detailed habit planning for each area</span>
                </li>
              </ul>

              <button className="w-full bg-slate-700 text-white py-4 rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors">
                Start Deep Planning →
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-gray-600 text-sm">
              Don&apos;t worry - you can always come back and change your goals before January 1st
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Name Entry Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-5">
            Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-amber-600">2026</span>
          </h1>
          <p className="text-xl text-gray-800 mb-3">
            Set your goals in 5 minutes
          </p>
          <p className="text-base text-gray-700">
            and unlock <strong className="text-amber-700">1 month free</strong> access to Man of Wisdom Digital Journal
          </p>
        </div>

        {/* Name & Email Entry Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
          <form onSubmit={handleNameSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block text-lg font-semibold text-gray-800 mb-2">
                What&apos;s your name?
              </label>
              <input
                id="name"
                type="text"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 text-lg text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                autoFocus
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block text-lg font-semibold text-gray-800 mb-2">
                Your email
              </label>
              <input
                id="email"
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-lg text-gray-900 placeholder-gray-500 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              By continuing, you agree to receive your goals PDF and updates about the journal launch. Unsubscribe anytime.
            </p>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-700 to-amber-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-slate-800 hover:to-amber-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              Continue →
            </button>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-10 text-center">
          <p className="text-gray-700 mb-4 font-medium text-sm">Trusted by 10,000+ Man of Wisdom followers</p>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">5 min</div>
              <div className="text-xs text-gray-600">Quick Setup</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">Free</div>
              <div className="text-xs text-gray-600">1 Month Journal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">Feb 1</div>
              <div className="text-xs text-gray-600">Launch Date</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
