'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { Zap, Users, Gift, MessageSquare } from 'lucide-react';

interface Stats {
  totalGames: number;
  totalUsers: number;
  totalQuests: number;
}

export default function Home() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    totalGames: 0,
    totalUsers: 0,
    totalQuests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      try {
        const [gamesRes, usersRes, questsRes] = await Promise.all([
          supabase.from('games').select('count', { count: 'exact' }),
          supabase.from('profiles').select('count', { count: 'exact' }),
          supabase.from('quests').select('count', { count: 'exact' }),
        ]);

        setStats({
          totalGames: gamesRes.count || 0,
          totalUsers: usersRes.count || 0,
          totalQuests: questsRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 min-h-screen">
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text">
              THUNDER Unblocked
            </h1>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Play unblocked games, earn XP, complete quests, and connect with friends
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login" className="btn-primary text-lg px-8 py-3">
                  Get Started
                </Link>
                <Link href="/auth/signup" className="btn-secondary text-lg px-8 py-3">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/games" className="btn-primary text-lg px-8 py-3">
                  Play Games
                </Link>
                <Link href="/quests" className="btn-secondary text-lg px-8 py-3">
                  View Quests
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-800/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Zap className="w-8 h-8 text-thunder-500" />
              </div>
              <h3 className="text-3xl font-bold text-thunder-400 mb-2">
                {loading ? '...' : stats.totalGames}
              </h3>
              <p className="text-dark-400">Games Available</p>
            </div>
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-8 h-8 text-thunder-500" />
              </div>
              <h3 className="text-3xl font-bold text-thunder-400 mb-2">
                {loading ? '...' : stats.totalUsers}
              </h3>
              <p className="text-dark-400">Active Players</p>
            </div>
            <div className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <Gift className="w-8 h-8 text-thunder-500" />
              </div>
              <h3 className="text-3xl font-bold text-thunder-400 mb-2">
                {loading ? '...' : stats.totalQuests}
              </h3>
              <p className="text-dark-400">Quests to Complete</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <Zap className="w-12 h-12 text-thunder-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Earn XP</h3>
              <p className="text-dark-400">Play games and complete quests to earn experience points</p>
            </div>
            <div className="card p-6 text-center">
              <Gift className="w-12 h-12 text-thunder-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Quests</h3>
              <p className="text-dark-400">Complete daily and weekly quests for rewards</p>
            </div>
            <div className="card p-6 text-center">
              <Users className="w-12 h-12 text-thunder-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
              <p className="text-dark-400">Compete with friends and climb the XP rankings</p>
            </div>
            <div className="card p-6 text-center">
              <MessageSquare className="w-12 h-12 text-thunder-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Messages</h3>
              <p className="text-dark-400">Chat directly with other players</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}