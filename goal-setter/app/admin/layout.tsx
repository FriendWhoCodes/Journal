import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user.email)) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-lg font-bold text-gray-900">
              Admin Panel
            </Link>
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
              Submissions
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800">
              Back to App
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
