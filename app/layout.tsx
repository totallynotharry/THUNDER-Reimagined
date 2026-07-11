'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import Navigation from '@/components/Navigation';
import Toast from '@/components/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(profile || { id: session.user.id, email: session.user.email || '', username: '', xp: 0, is_admin: false });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile || { id: session.user.id, email: session.user.email || '', username: '', xp: 0, is_admin: false });
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, [setUser, setLoading]);

  if (!mounted) return null;

  return (
    <html lang="en">
      <body className="bg-dark-900 text-white">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Toast />
      </body>
    </html>
  );
}