'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { Message } from '@/lib/types';
import { Send, MessageSquare } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function Messages() {
  const { user, loading } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/login';
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, email')
          .neq('id', user?.id);

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setPageLoading(false);
      }
    };

    if (user) fetchUsers();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedUserId) return;

    const supabase = createClient();
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel(`messages-${user.id}-${selectedUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, selectedUserId]);

  const sendMessage = async () => {
    if (!user || !selectedUserId || !newMessage.trim()) return;

    const supabase = createClient();
    try {
      const { error } = await supabase.from('messages').insert([
        {
          sender_id: user.id,
          receiver_id: selectedUserId,
          content: newMessage,
          read: false,
        },
      ]);

      if (error) throw error;
      setNewMessage('');
      showToast('Message sent!', 'success');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    }
  };

  if (loading || pageLoading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text flex items-center gap-3">
          <MessageSquare className="w-8 h-8" />
          Messages
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <div className="card p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Users</h2>
            {users.length === 0 ? (
              <p className="text-dark-400">No users found</p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUserId(u.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedUserId === u.id
                        ? 'bg-thunder-600 text-white'
                        : 'bg-dark-700 hover:bg-dark-600'
                    }`}
                  >
                    <p className="font-semibold">{u.username}</p>
                    <p className="text-xs text-dark-400">{u.email}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 card p-4 flex flex-col">
            {!selectedUserId ? (
              <div className="flex-1 flex items-center justify-center text-dark-400">
                <p>Select a user to start messaging</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_id === user?.id
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                          msg.sender_id === user?.id
                            ? 'bg-thunder-600'
                            : 'bg-dark-700'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-dark-400 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') sendMessage();
                    }}
                    placeholder="Type a message..."
                    className="input-field flex-1"
                  />
                  <button
                    onClick={sendMessage}
                    className="btn-primary px-4"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}