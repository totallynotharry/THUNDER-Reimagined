'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import SearchBar from '@/components/SearchBar';
import { Game } from '@/lib/types';
import { Zap, Play } from 'lucide-react';
import Link from 'next/link';

export default function Games() {
  const { user, loading } = useAuthStore();
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'games' | 'apps' | 'tools'>('all');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login';
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchGames = async () => {
      const supabase = createClient();
      try {
        let query = supabase.from('games').select('*');
        
        if (category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (error) throw error;
        setGames(data || []);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchGames();
  }, [category]);

  useEffect(() => {
    const filtered = games.filter(
      (game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchQuery, games]);

  if (loading || pageLoading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Games & Apps</h1>

        <div className="mb-8 space-y-4">
          <SearchBar onSearch={setSearchQuery} />
          <div className="flex gap-2 flex-wrap justify-center">
            {(['all', 'games', 'apps', 'tools'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg transition-colors ${category === cat ? 'bg-thunder-600 text-white' : 'bg-dark-800 text-dark-300 hover:text-white'}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">No games found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <div className="card overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="relative pb-[75%] bg-dark-800 overflow-hidden">
                    <img
                      src={game.image_url}
                      alt={game.title}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{game.title}</h3>
                    <p className="text-dark-400 text-sm mb-4 flex-1 line-clamp-2">{game.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-thunder-600 px-3 py-1 rounded-full">{game.category}</span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm">{game.rating}</span>
                      </div>
                    </div>
                    <button className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Play
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}