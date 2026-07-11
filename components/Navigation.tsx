'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold gradient-text">
            THUNDER
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link href="/games" className="text-dark-300 hover:text-white transition">
                  Games
                </Link>
                <Link href="/quests" className="text-dark-300 hover:text-white transition">
                  Quests
                </Link>
                <Link href="/leaderboard" className="text-dark-300 hover:text-white transition">
                  Leaderboard
                </Link>
                <Link href="/messages" className="text-dark-300 hover:text-white transition">
                  Messages
                </Link>
                {user.is_admin && (
                  <Link href="/admin" className="text-thunder-400 hover:text-thunder-300 transition font-semibold">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="text-dark-300 hover:text-white transition flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {user.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-dark-300 hover:text-white transition flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-dark-300 hover:text-white transition">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link href="/games" className="block px-4 py-2 text-dark-300 hover:text-white transition" onClick={() => setMenuOpen(false)}>
                  Games
                </Link>
                <Link href="/quests" className="block px-4 py-2 text-dark-300 hover:text-white transition" onClick={() => setMenuOpen(false)}>
                  Quests
                </Link>
                <Link href="/leaderboard" className="block px-4 py-2 text-dark-300 hover:text-white transition" onClick={() => setMenuOpen(false)}>
                  Leaderboard
                </Link>
                <Link href="/messages" className="block px-4 py-2 text-dark-300 hover:text-white transition" onClick={() => setMenuOpen(false)}>
                  Messages
                </Link>
                {user.is_admin && (
                  <Link href="/admin" className="block px-4 py-2 text-thunder-400 hover:text-thunder-300 transition" onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-dark-300 hover:text-white transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 text-dark-300 hover:text-white transition" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/auth/signup" className="block px-4 py-2 btn-primary text-center" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}