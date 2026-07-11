#!/bin/bash

# Cloudflare Pages Deployment Script
# Run this locally to test the build before pushing

set -e

echo "🚀 Building THUNDER Unblocked..."
npm run build

echo "✅ Build successful!"
echo "📦 Ready for deployment to Cloudflare Pages"
echo ""
echo "To deploy:"
echo "  git push origin main"
