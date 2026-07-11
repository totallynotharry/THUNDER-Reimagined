export interface UserProfile {
  id: string;
  email: string;
  username: string;
  xp: number;
  is_admin: boolean;
  avatar_url?: string;
  bio?: string;
  rank?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  image_url: string;
  url: string;
  category: 'games' | 'apps' | 'tools';
  rating: number;
  created_at: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  completed_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  completed_at: string;
}
