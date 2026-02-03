'use client';

import { PriorityModeProvider } from '@/lib/context/PriorityModeContext';

export default function PriorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PriorityModeProvider>
      {children}
    </PriorityModeProvider>
  );
}
