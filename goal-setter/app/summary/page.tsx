'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGoalSetter } from '@/lib/context/GoalSetterContext';
import { useAuth } from '@mow/auth';
import { DeepModeCategory } from '@/lib/types';
import { pdf } from '@react-pdf/renderer';
import { GoalsPDF } from '@/lib/pdf/GoalsPDF';

export default function Summary() {
  const router = useRouter();
  const { name, mode, quickModeData, deepModeData } = useGoalSetter();
  const { isAuthenticated } = useAuth();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!name || !mode) {
    router.push('/');
    return null;
  }

  // Save to database on mount (once)
  useEffect(() => {
    const saveSubmission = async () => {
      if (isSaved || !isAuthenticated) return;

      try {
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            mode,
            quickModeData,
            deepModeData,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save submission');
        }

        setIsSaved(true);
        console.log('Submission saved:', data);
      } catch (error) {
        console.error('Error saving submission:', error);
        setSaveError(error instanceof Error ? error.message : 'Failed to save');
      }
    };

    saveSubmission();
  }, []); // Only run once on mount

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const blob = await pdf(
        <GoalsPDF
          name={name}
          mode={mode}
          quickModeData={quickModeData}
          deepModeData={deepModeData}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name.replace(/\s+/g, '_')}_2026_Goals.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Parse fun stuff data
  const data = mode === 'quick' ? quickModeData : deepModeData;
  const placesArray = data.placesToVisit?.split('\n').filter(p => p.trim()) || [];
  const booksArray = data.booksToRead?.split('\n').filter(b => b.trim()) || [];
  const moviesArray = data.moviesToWatch?.split('\n').filter(m => m.trim()) || [];
  const experiencesArray = data.experiencesToHave?.split('\n').filter(e => e.trim()) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Save Status Notification */}
        {saveError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">
              ⚠️ Failed to save: {saveError}
            </p>
          </div>
        )}
        {isSaved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-700">
              ✓ Your goals have been saved to the database!
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Your 2026 Blueprint
          </h1>
          <p className="text-xl text-gray-600">
            Here&apos;s everything you want to achieve this year, {name}!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Mode: <span className="font-semibold capitalize">{mode}</span>
          </p>
        </div>

        {/* Goals Summary */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          {mode === 'quick' ? (
            // Quick Mode Display
            <>
              {/* Top 3 Goals */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎯</span> TOP 3 GOALS
                </h2>
                <ul className="space-y-3">
                  {quickModeData.topGoals?.map((goal, i) => (
                    <li key={i} className="flex items-start">
                      <span className="bg-slate-100 text-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-lg text-gray-800 pt-1">{goal}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Habits */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-3xl mr-3">✅</span> HABITS TO BUILD
                  </h2>
                  <div className="bg-green-50 p-4 rounded-xl">
                    {quickModeData.habitsToBuild && quickModeData.habitsToBuild.length > 0 ? (
                      <ul className="space-y-2">
                        {quickModeData.habitsToBuild.map((habit, i) => (
                          <li key={i} className="text-lg text-gray-800 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{habit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No habits selected</p>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-3xl mr-3">❌</span> HABITS TO BREAK
                  </h2>
                  <div className="bg-red-50 p-4 rounded-xl">
                    {quickModeData.habitsToBreak && quickModeData.habitsToBreak.length > 0 ? (
                      <ul className="space-y-2">
                        {quickModeData.habitsToBreak.map((habit, i) => (
                          <li key={i} className="text-lg text-gray-800 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{habit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No habits selected</p>
                    )}
                  </div>
                </section>
              </div>

              {/* Theme */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">💡</span> THEME FOR 2026
                </h2>
                <div className="bg-gradient-to-r from-slate-50 to-amber-50 p-6 rounded-xl">
                  <p className="text-2xl font-semibold text-center text-slate-900">
                    &quot;{quickModeData.mainTheme}&quot;
                  </p>
                </div>
              </section>
            </>
          ) : (
            // Deep Mode Display
            <>
              {/* Top 3 Goals */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎯</span> TOP 3 GOALS
                </h2>
                <ul className="space-y-3">
                  {deepModeData.topGoals?.map((goal, i) => (
                    <li key={i} className="flex items-start">
                      <span className="bg-slate-100 text-slate-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3 flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-lg text-gray-800 pt-1">{goal}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Habits */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-3xl mr-3">✅</span> HABITS TO BUILD
                  </h2>
                  <div className="bg-green-50 p-4 rounded-xl">
                    {deepModeData.habitsToBuild && deepModeData.habitsToBuild.length > 0 ? (
                      <ul className="space-y-2">
                        {deepModeData.habitsToBuild.map((habit, i) => (
                          <li key={i} className="text-gray-800 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{habit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No habits selected</p>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-3xl mr-3">❌</span> HABITS TO BREAK
                  </h2>
                  <div className="bg-red-50 p-4 rounded-xl">
                    {deepModeData.habitsToBreak && deepModeData.habitsToBreak.length > 0 ? (
                      <ul className="space-y-2">
                        {deepModeData.habitsToBreak.map((habit, i) => (
                          <li key={i} className="text-gray-800 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{habit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No habits selected</p>
                    )}
                  </div>
                </section>
              </div>

              {/* Theme */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">💡</span> THEME FOR 2026
                </h2>
                <div className="bg-gradient-to-r from-slate-50 to-amber-50 p-6 rounded-xl">
                  <p className="text-2xl font-semibold text-center text-slate-900">
                    &quot;{deepModeData.mainTheme}&quot;
                  </p>
                </div>
              </section>

              {/* Category Deep Dives */}
              <section className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center border-t pt-10">
                  Category Deep Dives
                </h2>
                <div className="space-y-8">
                  {[
                    { id: 'health', name: 'Health & Fitness', icon: '💪', color: 'red' },
                    { id: 'relationships', name: 'Relationships & Family', icon: '❤️', color: 'pink' },
                    { id: 'wealth', name: 'Wealth & Finance', icon: '💰', color: 'green' },
                    { id: 'career', name: 'Career & Work', icon: '💼', color: 'blue' },
                    { id: 'growth', name: 'Personal Growth & Learning', icon: '📚', color: 'teal' },
                    { id: 'impact', name: 'Contribution & Impact', icon: '🌟', color: 'yellow' },
                  ].map((category) => {
                    const data = deepModeData[category.id as keyof typeof deepModeData];
                    // Type guard to ensure we have a DeepModeCategory object
                    const categoryData = data && typeof data === 'object' && 'goal' in data ? data : undefined;
                    if (!categoryData?.goal) return null;

                    return (
                      <section key={category.id} className="border-b pb-8 last:border-b-0">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                          <span className="text-3xl mr-3">{category.icon}</span> {category.name}
                        </h3>

                        <div className="space-y-4 ml-12">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">🎯 Goal:</h4>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{categoryData.goal}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">💡 Why This Matters:</h4>
                            <p className="text-gray-800 bg-blue-50 p-3 rounded-lg italic">{categoryData.why}</p>
                          </div>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {/* Fun (Both Modes) */}
          {(placesArray.length > 0 || booksArray.length > 0 || moviesArray.length > 0 || experiencesArray.length > 0) && (
            <section className="border-t pt-10 mt-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Fun
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {placesArray.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🌍</span> Places to Visit
                    </h3>
                    <ul className="space-y-2">
                      {placesArray.map((place, i) => (
                        <li key={i} className="text-gray-700">• {place}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {booksArray.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">📚</span> Books to Read
                    </h3>
                    <ul className="space-y-2">
                      {booksArray.map((book, i) => (
                        <li key={i} className="text-gray-700">• {book}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {moviesArray.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🎬</span> Movies/Series to Watch
                    </h3>
                    <ul className="space-y-2">
                      {moviesArray.map((movie, i) => (
                        <li key={i} className="text-gray-700">• {movie}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {experiencesArray.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">✨</span> Experiences
                    </h3>
                    <ul className="space-y-2">
                      {experiencesArray.map((exp, i) => (
                        <li key={i} className="text-gray-700">• {exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Download PDF Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <span className="animate-spin">⏳</span>
                Generating PDF...
              </>
            ) : (
              <>
                📄 Download as PDF
              </>
            )}
          </button>
          <p className="mt-3 text-sm text-gray-500">
            Save your goals as a beautiful PDF document
          </p>
        </div>

        {/* Tablet Edition Launch - January 21st */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white mb-8">
          <div className="text-center mb-6">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
              <p className="text-sm font-semibold text-white">🎉 NEW RELEASE - January 21st</p>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Man of Wisdom Journal - Tablet Edition
            </h2>
            <p className="text-xl text-emerald-100 mb-6">
              The complete printable journal for iPad & tablets - <strong>Available January 21st</strong>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Why Choose Tablet Edition?</h3>
            <ul className="space-y-3 text-emerald-50">
              <li className="flex items-start">
                <span className="text-white mr-3 text-xl flex-shrink-0">📱</span>
                <span>Designed specifically for iPad & Android tablets with GoodNotes, Notability</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-3 text-xl flex-shrink-0">✍️</span>
                <span>Fully interactive - write, draw, and customize with Apple Pencil or stylus</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-3 text-xl flex-shrink-0">🔄</span>
                <span>One-time purchase - yours forever, no subscription needed</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-3 text-xl flex-shrink-0">📊</span>
                <span>Complete goal tracking system with daily, weekly, and monthly reviews</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <a
              href="https://manofwisdom.co/tablet-journal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg transform hover:scale-105"
            >
              Pre-Order Now →
            </a>
            <p className="mt-4 text-emerald-100 text-sm">
              🎁 Early bird pricing available • Instant download on January 21st
            </p>
          </div>
        </div>

        {/* Digital Journal Launch - February 1st */}
        <div className="bg-gradient-to-r from-slate-700 to-amber-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <p className="text-sm font-semibold text-white">✨ COMING SOON - February 1st</p>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Man of Wisdom Digital Journal (SaaS)
            </h2>
            <p className="text-xl text-amber-100 mb-6">
              Track these goals daily starting <strong>February 1st</strong> with <strong>1 month FREE</strong> Pro access
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">What happens next?</h3>
            <ul className="space-y-3 text-amber-50">
              <li className="flex items-start">
                <span className="text-emerald-300 mr-3 text-xl flex-shrink-0">✓</span>
                <span>We&apos;ll email you on <strong className="text-white">February 1st</strong> when the journal launches</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-300 mr-3 text-xl flex-shrink-0">✓</span>
                <span>All your goals will be <strong className="text-white">pre-loaded</strong> in your journal</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-300 mr-3 text-xl flex-shrink-0">✓</span>
                <span>Start tracking, build habits, and achieve your 2026 vision</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-300 mr-3 text-xl flex-shrink-0">✓</span>
                <span>No credit card required for your free month</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-amber-100 text-sm">
              📧 Watch your inbox for our launch announcement • Questions? Reply to any of our emails
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 underline"
          >
            ← Go back and edit
          </button>
        </div>
      </div>
    </div>
  );
}
