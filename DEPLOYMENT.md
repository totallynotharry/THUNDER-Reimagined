# Cloudflare Pages Configuration

This project is configured to deploy to Cloudflare Pages.

## Setup Instructions

### 1. Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Pages
3. Click "Create a project"
4. Select "Connect to Git"
5. Authorize GitHub and select `totallynotharry/THUNDER-Reimagined`
6. Click "Begin setup"

### 2. Configure Build Settings

- **Framework preset**: Next.js
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (or leave blank)

### 3. Add Environment Variables

In the Cloudflare Pages project settings, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://thunder-unblocked.pages.dev
```

### 4. Deploy

Just push to the main branch! Cloudflare Pages will automatically build and deploy.

## Custom Domain

1. In Cloudflare Pages project settings
2. Go to "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain
5. Follow DNS configuration instructions

## Environment-Specific Configuration

For production/staging, you can create different build configurations:

```bash
# Preview deployments (on PRs)
npm run build

# Production deployment (on merge to main)
npm run build
```
