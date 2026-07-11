'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import SearchBar from '@/components/SearchBar';
import { Quest } from '@/lib/types';
import { Gift, CheckCircle, Clock, Zap } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function Quests() {
  const { user, loading } = useAuthStore();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userQuests, setUserQuests] = useState<string[]>([]);
  const [filteredQuests, setFilteredQuests] = useState<Quest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login';
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchQuests = async () => {
      const supabase = createClient();
      try {
        const { data: questsData, error: questsError } = await supabase
          .from('quests')
          .select('*')
          .order('created_at', { ascending: false });

        if (questsError) throw questsError;
        setQuests(questsData || []);

        if (user) {
          const { data: userQuestsData, error: userQuestsError } = await supabase
            .from('user_quests')
            .select('quest_id')
            .eq('user_id', user.id);

          if (userQuestsError) throw userQuestsError;
          setUserQuests(userQuestsData?.map((uq) => uq.quest_id) || []);
        }
      } catch (error) {
        console.error('Error fetching quests:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchQuests();
  }, [user]);

  useEffect(() => {
    const filtered = quests.filter(
      (quest) =>
        quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quest.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredQuests(filtered);
  }, [searchQuery, quests]);

  const completeQuest = async (questId: string) => {
    if (!user) return;

    const supabase = createClient();
    try {
      const { error } = await supabase.from('user_quests').insert([
        {
          user_id: user.id,
          quest_id: questId,
          completed_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      const quest = quests.find((q) => q.id === questId);
      if (quest) {
        await supabase.rpc('add_xp', {
          user_id: user.id,
          xp_amount: quest.xp_reward,
        });
      }

      setUserQuests([...userQuests, questId]);
      showToast('Quest completed! XP earned!', 'success');
    } catch (error) {
      console.error('Error completing quest:', error);
      showToast('Failed to complete quest', 'error');
    }
  };

  if (loading || pageLoading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Quests</h1>

        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {filteredQuests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">No quests available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuests.map((quest) => {
              const isCompleted = userQuests.includes(quest.id);
              return (
                <div key={quest.id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-thunder-500" />
                        {quest.title}
                      </h3>
                      <p className="text-dark-400 mb-4">{quest.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          {quest.xp_reward} XP
                        </span>
                        <span className="flex items-center gap-1 text-dark-400">
                          <Clock className="w-4 h-4" />
                          {quest.completed_count} completed
                        </span>
                      </div>
                    </div>
                    {isCompleted ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => completeQuest(quest.id)}
                        className="btn-primary"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}