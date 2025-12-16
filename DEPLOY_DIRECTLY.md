# 🚀 Deploy Directly to Render (No GitHub Needed)

You can deploy your backend directly from your local machine using Render CLI!

## Method 1: Deploy Existing Service (If Already Created)

If you've already created the service in Render dashboard:

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

The CLI will:
1. Show you a list of services
2. Ask you to select one
3. Upload your code
4. Trigger build and deployment

## Method 2: Create Service via CLI (New Service)

If you haven't created the service yet, you can create it via CLI:

### Step 1: Create Service

```bash
cd /Users/ritambiswas/fm_website/backend
render services:create \
  --name featureme-backend \
  --type web \
  --env node \
  --build-command "npm install && npx prisma generate && npm run build" \
  --start-command "npm start" \
  --root-dir backend
```

### Step 2: Set Environment Variables

You'll need to set environment variables in the Render dashboard:

1. Go to: https://dashboard.render.com
2. Find your service: `featureme-backend`
3. Go to **Environment** tab
4. Add these variables:

**Required:**
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `DATABASE_URL` = Your PostgreSQL connection string
- `JWT_SECRET` = `e6d93d475578c162dc353592c10fa28cbb41d2e6a530046cc9ef7a11e2f93be219cfc127166829586281fec92f7e8cc9452b2f59e16c21aed170e170474c027e`
- `JWT_REFRESH_SECRET` = `856b114e08c4cf5a00d437270c9e199f4b5bd4905c61f009ae1b87f7210347af1f8eea9b67893184715fb049ced04c92311b5f4d459fd8dcb8902f93deaae304`
- `CLOUDINARY_CLOUD_NAME` = Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` = Your Cloudinary API key
- `CLOUDINARY_API_SECRET` = Your Cloudinary API secret
- `FRONTEND_URL` = Your frontend URL

### Step 3: Deploy

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

## Method 3: Manual Service Creation + CLI Deploy (Recommended)

### Step 1: Create Service in Dashboard

1. Go to: https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Configure:
   - **Name:** `featureme-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
   - **Plan:** `Starter` (free)
4. Click "Create Web Service"

### Step 2: Set Environment Variables

In your service → **Environment** tab, add all required variables (see list above).

### Step 3: Deploy from CLI

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

Select your service when prompted.

## 🔄 Updating Your Deployment

Whenever you make changes:

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

That's it! No GitHub needed.

## 📋 Quick Commands

```bash
# List all services
render services

# Deploy to a service
render deploy

# View logs
render logs featureme-backend

# Check service status
render services:status featureme-backend
```

## ✅ After Deployment

1. **Run migrations:**
   - Go to Render dashboard → Your service → Shell tab
   - Run: `npx prisma migrate deploy`

2. **Test your API:**
   - Visit: `https://featureme-backend.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

## 🎯 Summary

**No GitHub required!** Just:
1. Create service in dashboard (or via CLI)
2. Set environment variables
3. Run `render deploy` from your backend directory
4. Done! 🚀

