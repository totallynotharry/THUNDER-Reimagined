# THUNDER Unblocked Games

A full-featured unblocked games platform with quest system, XP leaderboard, and direct messaging.

## Features

- 🎮 **Games, Apps & Tools** - Browse and play unblocked games with search functionality
- ⚡ **XP System** - Earn XP by playing games and completing quests
- 🏆 **Leaderboard** - Compete globally and climb the rankings
- 📝 **Quests** - Complete daily/weekly quests for XP rewards
- 💬 **Direct Messaging** - Real-time chat with other players
- 🔐 **Admin Panel** - Full control over games, quests, and users
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Cloudflare Pages
- **State Management**: Zustand
- **UI Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Cloudflare account

### Installation

1. Clone the repository
```bash
git clone https://github.com/totallynotharry/THUNDER-Reimagined.git
cd THUNDER-Reimagined
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Set up Supabase database

Run the SQL migrations in your Supabase dashboard:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  xp INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  url TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'games',
  rating DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create quests table
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 100,
  completed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_quests table
CREATE TABLE user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id UUID NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_user_quests_user ON user_quests(user_id);
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Admin Account Setup

1. Sign up normally through the app
2. Go to Supabase dashboard
3. In the profiles table, manually set `is_admin = true` for your user
4. The admin panel is now accessible at `/admin`

## Deployment to Cloudflare Pages

1. Push your code to GitHub
2. Connect your GitHub repo to Cloudflare Pages
3. Set build command: `npm run build`
4. Set build output directory: `.next`
5. Add environment variables in Cloudflare dashboard
6. Deploy!

## Project Structure

```
.
├── app/
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── auth/              # Authentication pages
│   ├── games/             # Games listing
│   ├── quests/            # Quests page
│   ├── leaderboard/       # Leaderboard page
│   ├── messages/          # Messaging page
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # Reusable components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please open an issue on GitHub.
