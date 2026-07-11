'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import SearchBar from '@/components/SearchBar';
import { UserProfile } from '@/lib/types';
import { Trophy, Crown, Zap } from 'lucide-react';

export default function Leaderboard() {
  const { loading } = useAuthStore();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('xp', { ascending: false });

        if (error) throw error;
        setProfiles(
          data?.map((profile, index) => ({
            ...profile,
            rank: index + 1,
          })) || []
        );
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const filtered = profiles.filter(
      (profile) =>
        profile.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProfiles(filtered);
  }, [searchQuery, profiles]);

  if (loading || pageLoading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">Loading...</div>;
  }

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-orange-400';
      default:
        return 'text-dark-400';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text flex items-center gap-3">
          <Trophy className="w-8 h-8" />
          Leaderboard
        </h1>

        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">No players found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProfiles.map((profile) => (
              <div key={profile.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`text-2xl font-bold w-12 text-center ${getMedalColor(profile.rank)}`}>
                    {profile.rank <= 3 ? (
                      <Crown className="w-6 h-6 mx-auto" />
                    ) : (
                      `#${profile.rank}`
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{profile.username}</h3>
                    <p className="text-dark-400 text-sm">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-yellow-400 font-bold">
                  <Zap className="w-5 h-5" />
                  <span className="text-xl">{profile.xp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}