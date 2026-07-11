# Deployment Instructions for THUNDER Unblocked

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Fill in your Supabase credentials in .env.local

# Start development server
npm run dev

# Open http://localhost:3000
```

## Production Deployment

### Option 1: Cloudflare Pages (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy THUNDER Unblocked"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages → Create project → Connect Git
   - Select `totallynotharry/THUNDER-Reimagined`
   - Set build command: `npm run build`
   - Set build directory: `.next`

3. **Add Environment Variables**
   - In Cloudflare Pages project settings
   - Add all variables from `.env.example`
   - Ensure `NEXT_PUBLIC_SITE_URL=https://your-domain.pages.dev`

4. **Configure Custom Domain** (Optional)
   - In Pages project → Custom domains
   - Add your domain and follow DNS setup

### Option 2: Vercel

1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy!

### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations (see SQL section below)
3. Copy your API keys to environment variables
4. Enable "Row Level Security" on all tables (optional but recommended)

### SQL Migrations

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create user_quests table (junction table)
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

-- Create indexes for performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_user_quests_user ON user_quests(user_id);
CREATE INDEX idx_user_quests_quest ON user_quests(quest_id);

-- Enable Row Level Security (optional)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

## Admin Account Setup

1. Sign up through the app normally
2. Go to Supabase Dashboard → SQL Editor
3. Run this query to make yourself admin:
   ```sql
   UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
   ```
4. Navigate to `/admin` to access the admin panel

## Creating Initial Content

### Add Sample Games via Admin Panel

1. Login with admin account
2. Go to `/admin`
3. Click "Add Game"
4. Fill in:
   - Title: Game name
   - Description: Game description
   - Image URL: Game thumbnail
   - Game URL: Link to the game
   - Category: games/apps/tools

### Add Sample Quests via Admin Panel

1. Go to Admin Panel
2. Switch to "Quests" tab
3. Click "Add Quest"
4. Fill in:
   - Title: Quest name
   - Description: What to do
   - XP Reward: Amount of XP for completing

## Troubleshooting

### Build Fails on Cloudflare Pages

- Check Node.js version (needs 18+)
- Verify environment variables are set
- Check build logs in Cloudflare dashboard
- Ensure all dependencies are in package.json

### Database Connection Issues

- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is active
- Check network connectivity

### Auth Issues

- Verify email confirmation is enabled in Supabase
- Check email templates in Supabase Auth settings
- Ensure NEXT_PUBLIC_SITE_URL matches your domain

## Performance Optimization

- Enable caching in Cloudflare
- Use CDN for game images
- Implement pagination for leaderboard
- Add database query optimization
- Use service worker for offline support

## Security Checklist

- [ ] Enable HTTPS (automatic with Cloudflare)
- [ ] Set up CORS properly
- [ ] Enable Row Level Security in Supabase
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Regular security audits

## Support

For deployment help:
1. Check [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
2. Check [Supabase Docs](https://supabase.com/docs)
3. Check [Next.js Docs](https://nextjs.org/docs)
