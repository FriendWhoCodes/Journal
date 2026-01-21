'use client';

import { useAuth } from '@mow/auth';
import type { AuthUser } from '@mow/auth';

interface HeaderProps {
  user: AuthUser;
}

export default function Header({ user }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Time Views</h1>
          <span className="text-xs text-gray-400 hidden sm:inline">Man of Wisdom</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline">
            {user.email}
          </span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
