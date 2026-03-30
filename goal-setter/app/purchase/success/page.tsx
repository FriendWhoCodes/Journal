'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@mow/auth';

const PERMALINK_TO_PRODUCT: Record<string, { product: string; wisdomType: string | null; label: string }> = {
  [process.env.NEXT_PUBLIC_GUMROAD_PRIORITY_MODE_URL?.split('/l/')[1] || 'priority-mode']: {
    product: 'priority_mode',
    wisdomType: null,
    label: 'Priority Mode',
  },
  [process.env.NEXT_PUBLIC_GUMROAD_AI_WISDOM_URL?.split('/l/')[1] || 'ai-wisdom']: {
    product: 'priority_ai_wisdom',
    wisdomType: 'ai',
    label: 'AI Wisdom',
  },
  [process.env.NEXT_PUBLIC_GUMROAD_PERSONAL_WISDOM_URL?.split('/l/')[1] || 'personal-wisdom']: {
    product: 'priority_personal_wisdom',
    wisdomType: 'manual',
    label: 'Personal Wisdom',
  },
};

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Try to determine product from URL or default to AI wisdom
  const permalink = searchParams.get('product_permalink');
  const productInfo = (permalink && PERMALINK_TO_PRODUCT[permalink])
    || Object.values(PERMALINK_TO_PRODUCT)[0];

  useEffect(() => {
    if (!user) return;

    const checkAccess = async () => {
      try {
        const res = await fetch(`/api/payments/access?product=${productInfo.product}`);
        const data = await res.json();
        if (data.hasAccess) {
          setHasAccess(true);
          setChecking(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // Keep polling
      }
    };

    // Check immediately, then poll every 2s
    checkAccess();
    intervalRef.current = setInterval(checkAccess, 2000);

    // Timeout after 30s
    const timeout = setTimeout(() => {
      setChecking(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(timeout);
    };
  }, [user, productInfo.product]);

  const handleContinue = () => {
    if (productInfo.wisdomType) {
      router.push(`/priority?wisdom=true&type=${productInfo.wisdomType}`);
    } else {
      router.push('/priority');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {hasAccess ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-5xl mb-4">&#10003;</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Purchase Complete!
            </h1>
            <p className="text-gray-600 mb-6">
              Your {productInfo.label} access is ready. Let&apos;s build your blueprint.
            </p>
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
            >
              Continue to Priority Mode
            </button>
          </div>
        ) : checking ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-spin text-4xl mb-4 inline-block border-4 border-indigo-200 border-t-indigo-600 rounded-full w-12 h-12" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Your Purchase...
            </h1>
            <p className="text-gray-600">
              This usually takes just a few seconds. Please don&apos;t close this page.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-4xl mb-4">&#9203;</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Almost There!
            </h1>
            <p className="text-gray-600 mb-4">
              Your purchase is confirmed but access is still being set up. This can take a minute.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Try refreshing this page in a moment. If the issue persists, please contact{' '}
              <a href="mailto:security@manofwisdom.co" className="text-indigo-600 hover:underline">
                support
              </a>.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
