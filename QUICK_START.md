# Quick Start Guide
## VPS Hosting Platform

## 🚀 Local Development Setup

### 1. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_APP_URL=http://localhost:8080
```

### 3. Set Up Supabase Database

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the SQL from `database/schema.sql`
4. Copy your project URL and anon key to `.env`

### 4. Start Development Server

```bash
# Using Bun
bun run dev

# Or using npm
npm run dev
```

The app will be available at http://localhost:8080

## 📦 Build for Production

```bash
# Build
bun run build
# or
npm run build

# Preview production build
bun run preview
# or
npm run preview
```

Built files will be in the `dist/` directory.

## 🎯 Key Features

✅ **Authentication** - Login, Signup, Password Reset  
✅ **User Dashboard** - VPS management, billing, stats  
✅ **Admin Panel** - User management, analytics  
✅ **VPS Management** - Create, manage, monitor VPS instances  
✅ **Billing** - Subscriptions, invoices, payment methods  
✅ **Notifications** - Real-time in-app notifications  
✅ **Auto-Workflows** - Auto-approval, auto-provisioning, auto-billing  
✅ **Settings** - Profile, security, preferences  

## 📁 Project Structure

- `src/pages/` - All page components
- `src/components/` - Reusable components
- `src/lib/` - API functions and utilities
- `src/contexts/` - React contexts (Auth)
- `database/` - Database schema SQL

## 🔐 Default Routes

- `/` - Homepage
- `/vps` - VPS hosting plans
- `/login` - Login page
- `/signup` - Signup page
- `/onboarding` - Onboarding wizard
- `/dashboard` - User dashboard (protected)
- `/dashboard/settings` - Settings (protected)
- `/dashboard/billing` - Billing (protected)
- `/admin` - Admin panel (admin only)

## 🛠️ Development Tips

1. **Hot Reload** - Changes auto-reload in dev mode
2. **TypeScript** - Full type safety
3. **ESLint** - Code quality checks
4. **Tailwind** - Utility-first CSS

## 📚 Documentation

- See `PDR.md` for complete Product Definition Report
- See `IMPLEMENTATION_GUIDE.md` for implementation details

## 🐛 Troubleshooting

**Build errors?**
- Check Node.js version (18+)
- Clear `node_modules` and reinstall
- Check environment variables

**Database errors?**
- Verify Supabase connection
- Check RLS policies
- Verify schema is applied

**Authentication issues?**
- Check Supabase URL and keys
- Verify email confirmation (if enabled)
- Check browser console for errors

## 🚢 Deployment

See `PDR.md` for complete deployment guide.

Recommended platforms:
- **Vercel** (easiest)
- **Netlify**
- **Self-hosted** (nginx/Apache)

---

**Ready to build!** 🎉

