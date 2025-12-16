# ✅ Render CLI Login Successful!

## What Just Happened

You've successfully logged into Render CLI and selected your workspace:
- **Workspace:** Ritam's workspace
- **Email:** biswasrita...
- **Workspace ID:** tea-d50pj6p5pdvs7398q3mg

## 📋 Next Steps to Deploy

### Step 1: Create Web Service in Render Dashboard

1. **Go to:** https://dashboard.render.com
2. **Click:** "New +" button (top right)
3. **Select:** "Web Service"

### Step 2: Configure the Service

Fill in these settings:

**Basic Settings:**
- **Name:** `featureme-backend`
- **Environment:** `Node`
- **Region:** `Oregon` (or closest to you)
- **Branch:** Leave empty (we're using CLI deploy)
- **Root Directory:** `backend`

**Build & Deploy:**
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm start`

**Plan:**
- **Plan:** `Starter` (free tier)

Click **"Create Web Service"**

### Step 3: Set Environment Variables

After creating the service, go to **Environment** tab and add:

**Required Variables:**

1. **NODE_ENV**
   - Value: `production`

2. **PORT**
   - Value: `10000`

3. **DATABASE_URL**
   - Value: Your PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database`
   - Get from: Your database provider (Render PostgreSQL, Neon, etc.)

4. **JWT_SECRET**
   - Value: `e6d93d475578c162dc353592c10fa28cbb41d2e6a530046cc9ef7a11e2f93be219cfc127166829586281fec92f7e8cc9452b2f59e16c21aed170e170474c027e`

5. **JWT_REFRESH_SECRET**
   - Value: `856b114e08c4cf5a00d437270c9e199f4b5bd4905c61f009ae1b87f7210347af1f8eea9b67893184715fb049ced04c92311b5f4d459fd8dcb8902f93deaae304`

6. **CLOUDINARY_CLOUD_NAME**
   - Value: Your Cloudinary cloud name
   - Get from: https://console.cloudinary.com

7. **CLOUDINARY_API_KEY**
   - Value: Your Cloudinary API key
   - Get from: Cloudinary dashboard → Settings

8. **CLOUDINARY_API_SECRET**
   - Value: Your Cloudinary API secret
   - Get from: Cloudinary dashboard → Settings

9. **FRONTEND_URL**
   - Value: Your frontend URL
   - Example: `https://your-frontend.vercel.app` or `https://your-frontend.netlify.app`

**Optional (if using Stripe):**
10. **STRIPE_SECRET_KEY** - Your Stripe secret key
11. **STRIPE_WEBHOOK_SECRET** - Your Stripe webhook secret

### Step 4: Deploy Your Code

Once the service is created and environment variables are set:

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

The CLI will:
- Show you a list of services
- Ask you to select `featureme-backend`
- Upload your code
- Trigger the build
- Deploy your backend

### Step 5: Run Database Migrations

After deployment completes:

1. Go to your service in Render dashboard
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. Wait for completion

### Step 6: Verify Deployment

1. **Get your service URL:**
   - In Render dashboard, your service URL will be shown
   - Format: `https://featureme-backend.onrender.com`

2. **Test Health Endpoint:**
   - Visit: `https://featureme-backend.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Test API:**
   - Visit: `https://featureme-backend.onrender.com/api/locations`
   - Should return locations data

## 🔄 Updating Your Deployment

When you make code changes:

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

## 📝 Useful Render CLI Commands

```bash
# List all services
render services

# View service details
render services:show featureme-backend

# View logs
render logs featureme-backend

# Deploy
render deploy

# Check status
render services:status featureme-backend
```

## ✅ Checklist

- [x] Render CLI installed
- [x] Logged into Render CLI
- [x] Workspace selected
- [ ] Web service created in dashboard
- [ ] Environment variables set (9 required)
- [ ] Code deployed via CLI
- [ ] Database migrations run
- [ ] Health endpoint tested
- [ ] API endpoint tested

## 🎉 After Deployment

Your backend will be live at:
```
https://featureme-backend.onrender.com
```

**Update your frontend** API configuration to use this URL!

---

**Next:** Go to Render dashboard and create the web service! 🚀

