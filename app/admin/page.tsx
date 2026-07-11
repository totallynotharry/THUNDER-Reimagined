'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { Game, Quest } from '@/lib/types';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { showToast } from '@/components/Toast';

type TabType = 'games' | 'quests' | 'users';

export default function AdminPanel() {
  const { user, loading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('games');
  const [games, setGames] = useState<Game[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      window.location.href = '/';
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      try {
        const [gamesRes, questsRes, usersRes] = await Promise.all([
          supabase.from('games').select('*'),
          supabase.from('quests').select('*'),
          supabase.from('profiles').select('*'),
        ]);

        setGames(gamesRes.data || []);
        setQuests(questsRes.data || []);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to load data', 'error');
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  const addGame = async () => {
    if (!formData.title || !formData.url) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const supabase = createClient();
    try {
      const { error } = await supabase.from('games').insert([formData]);
      if (error) throw error;

      setGames([...games, formData]);
      setFormData({});
      setShowAddForm(false);
      showToast('Game added successfully!', 'success');
    } catch (error) {
      console.error('Error adding game:', error);
      showToast('Failed to add game', 'error');
    }
  };

  const deleteGame = async (id: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('games').delete().eq('id', id);
      if (error) throw error;

      setGames(games.filter((g) => g.id !== id));
      showToast('Game deleted!', 'success');
    } catch (error) {
      console.error('Error deleting game:', error);
      showToast('Failed to delete game', 'error');
    }
  };

  const addQuest = async () => {
    if (!formData.title || !formData.xp_reward) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const supabase = createClient();
    try {
      const { error } = await supabase.from('quests').insert([formData]);
      if (error) throw error;

      setQuests([...quests, formData]);
      setFormData({});
      setShowAddForm(false);
      showToast('Quest added successfully!', 'success');
    } catch (error) {
      console.error('Error adding quest:', error);
      showToast('Failed to add quest', 'error');
    }
  };

  const deleteQuest = async (id: string) => {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('quests').delete().eq('id', id);
      if (error) throw error;

      setQuests(quests.filter((q) => q.id !== id));
      showToast('Quest deleted!', 'success');
    } catch (error) {
      console.error('Error deleting quest:', error);
      showToast('Failed to delete quest', 'error');
    }
  };

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isAdmin })
        .eq('id', userId);

      if (error) throw error;

      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, is_admin: !isAdmin } : u
        )
      );
      showToast('Admin status updated!', 'success');
    } catch (error) {
      console.error('Error updating admin status:', error);
      showToast('Failed to update admin status', 'error');
    }
  };

  if (loading || pageLoading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Admin Panel</h1>

        <div className="flex gap-4 mb-8 border-b border-dark-700">
          {(['games', 'quests', 'users'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-thunder-400 border-b-2 border-thunder-400'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'games' && (
          <div>
            <div className="mb-6">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Game
                </button>
              ) : (
                <div className="card p-6 space-y-4 max-w-2xl">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="Game URL"
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="input-field w-full"
                  />
                  <select
                    value={formData.category || 'games'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="games">Games</option>
                    <option value="apps">Apps</option>
                    <option value="tools">Tools</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={addGame} className="btn-primary flex-1">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({});
                      }}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {games.map((game) => (
                <div key={game.id} className="card p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold">{game.title}</h3>
                    <p className="text-sm text-dark-400">{game.description}</p>
                  </div>
                  <button
                    onClick={() => deleteGame(game.id)}
                    className="text-red-400 hover:text-red-300 transition ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quests' && (
          <div>
            <div className="mb-6">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Quest
                </button>
              ) : (
                <div className="card p-6 space-y-4 max-w-2xl">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field w-full"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field w-full"
                  />
                  <input
                    type="number"
                    placeholder="XP Reward"
                    value={formData.xp_reward || ''}
                    onChange={(e) => setFormData({ ...formData, xp_reward: parseInt(e.target.value) })}
                    className="input-field w-full"
                  />
                  <div className="flex gap-2">
                    <button onClick={addQuest} className="btn-primary flex-1">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({});
                      }}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {quests.map((quest) => (
                <div key={quest.id} className="card p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold">{quest.title}</h3>
                    <p className="text-sm text-dark-400">{quest.description}</p>
                    <p className="text-xs text-yellow-400 mt-1">{quest.xp_reward} XP</p>
                  </div>
                  <button
                    onClick={() => deleteQuest(quest.id)}
                    className="text-red-400 hover:text-red-300 transition ml-4"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="card p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{u.username}</h3>
                  <p className="text-sm text-dark-400">{u.email}</p>
                  <p className="text-xs text-yellow-400 mt-1">{u.xp} XP</p>
                </div>
                <button
                  onClick={() => toggleAdminStatus(u.id, u.is_admin)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    u.is_admin
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-dark-700 hover:bg-dark-600'
                  }`}
                >
                  {u.is_admin ? 'Admin' : 'User'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}