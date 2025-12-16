# 📝 Manual Render Setup (No GitHub Required)

## Step-by-Step Guide

### Step 1: Create Render Account

1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign up with email (no GitHub needed)

### Step 2: Create Web Service

1. Go to: https://dashboard.render.com
2. Click "New +" button (top right)
3. Select "Web Service"

### Step 3: Configure Service

**Service Settings:**
- **Name:** `featureme-backend`
- **Environment:** `Node`
- **Region:** `Oregon` (or closest to you)
- **Branch:** Leave empty (we'll deploy manually)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm start`
- **Plan:** `Starter` (free tier)

Click "Create Web Service"

### Step 4: Set Environment Variables

Go to your service → **Environment** tab → Add these:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `JWT_SECRET` | `e6d93d475578c162dc353592c10fa28cbb41d2e6a530046cc9ef7a11e2f93be219cfc127166829586281fec92f7e8cc9452b2f59e16c21aed170e170474c027e` |
| `JWT_REFRESH_SECRET` | `856b114e08c4cf5a00d437270c9e199f4b5bd4905c61f009ae1b87f7210347af1f8eea9b67893184715fb049ced04c92311b5f4d459fd8dcb8902f93deaae304` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `FRONTEND_URL` | Your frontend URL |

### Step 5: Install Render CLI

```bash
# Option 1: npm
npm install -g render-cli

# Option 2: Homebrew (macOS)
brew tap render-oss/tap
brew install render
```

### Step 6: Login to Render

```bash
render login
```

This opens a browser for authentication.

### Step 7: Deploy Your Code

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

**Note:** You'll need to specify your service ID. Render CLI will guide you.

### Step 8: Run Database Migrations

After deployment:

1. Go to your service in Render dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

### Step 9: Verify Deployment

Visit: `https://featureme-backend.onrender.com/health`

Should return: `{"status":"ok","timestamp":"..."}`

## 🔄 Updating Your Deployment

When you make changes:

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

## ⚠️ Important Notes

- **Manual deploy** means you need to run `render deploy` for each update
- **No automatic deployments** (unlike GitHub integration)
- **Service must be created in dashboard first** before using CLI
- **Free tier** spins down after 15 minutes of inactivity

## 🎯 Alternative: Use GitLab (Easier)

If you want automatic deployments but don't want GitHub:

1. **Sign up:** https://gitlab.com (free)
2. **Create repo:** https://gitlab.com/projects/new
3. **Push code:**
   ```bash
   git remote set-url origin https://gitlab.com/Ritambiswas0074/fm_website.git
   git push -u origin main
   ```
4. **Connect to Render:** Same as GitHub (automatic deployments)

## ✅ Summary

**Option 1: Render CLI (Manual)**
- ✅ No GitHub needed
- ✅ Direct deployment
- ❌ Manual updates required

**Option 2: GitLab (Automatic)**
- ✅ No GitHub needed
- ✅ Automatic deployments
- ✅ Free and easy

**Recommendation:** Use GitLab for automatic deployments, or Render CLI for manual control.

