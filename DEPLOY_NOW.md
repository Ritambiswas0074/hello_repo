# 🚀 Deploy Your Backend NOW - Step by Step

## Your GitHub Profile
**Username:** Ritambiswas0074  
**Profile:** https://github.com/Ritambiswas0074

## ✅ What's Already Done
- ✅ Git remote configured: `https://github.com/Ritambiswas0074/fm_website.git`
- ✅ All code committed and ready
- ✅ Render configuration ready
- ✅ JWT secrets generated

## 📋 STEP-BY-STEP DEPLOYMENT

### Step 1: Create GitHub Repository (2 minutes)

1. **Go to:** https://github.com/new
2. **Repository name:** `fm_website`
3. **Description:** `FeatureMe Billboard Platform - Backend API`
4. **Visibility:** Choose Public or Private
5. **⚠️ IMPORTANT:** DO NOT check "Add a README file"
6. **Click:** "Create repository"

### Step 2: Push Code to GitHub (1 minute)

After creating the repository, run these commands:

```bash
cd /Users/ritambiswas/fm_website
git push -u origin main
```

If you get an authentication error, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys

**To use Personal Access Token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Render Deployment"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. Copy the token
7. When pushing, use the token as your password

### Step 3: Deploy on Render (10 minutes)

1. **Go to:** https://dashboard.render.com
2. **Sign up/Login:**
   - Click "Get Started for Free"
   - Choose "Sign up with GitHub" (easiest way)
   - Authorize Render
3. **Create Blueprint:**
   - Click "New +" button (top right)
   - Select "Blueprint"
4. **Connect Repository:**
   - Click "Connect account" if GitHub not connected
   - Select repository: `Ritambiswas0074/fm_website`
5. **Deploy:**
   - Render will detect `render.yaml` automatically
   - Service name will be: `featureme-backend`
   - Click "Apply" to create the service
   - Wait for deployment (takes 5-10 minutes)

### Step 4: Set Environment Variables (5 minutes)

Once deployment starts, go to your service → **Environment** tab:

**Click "Add Environment Variable" for each:**

1. **DATABASE_URL**
   - Value: Your PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database`
   - Get from: Render PostgreSQL or Neon dashboard

2. **JWT_SECRET**
   - Value: `e6d93d475578c162dc353592c10fa28cbb41d2e6a530046cc9ef7a11e2f93be219cfc127166829586281fec92f7e8cc9452b2f59e16c21aed170e170474c027e`

3. **JWT_REFRESH_SECRET**
   - Value: `856b114e08c4cf5a00d437270c9e199f4b5bd4905c61f009ae1b87f7210347af1f8eea9b67893184715fb049ced04c92311b5f4d459fd8dcb8902f93deaae304`

4. **CLOUDINARY_CLOUD_NAME**
   - Value: Your Cloudinary cloud name
   - Get from: https://console.cloudinary.com

5. **CLOUDINARY_API_KEY**
   - Value: Your Cloudinary API key
   - Get from: Cloudinary dashboard → Settings

6. **CLOUDINARY_API_SECRET**
   - Value: Your Cloudinary API secret
   - Get from: Cloudinary dashboard → Settings

7. **FRONTEND_URL**
   - Value: Your frontend URL
   - Example: `https://your-frontend.vercel.app` or `https://your-frontend.netlify.app`

**Optional (if using Stripe):**
8. **STRIPE_SECRET_KEY** - Your Stripe secret key
9. **STRIPE_WEBHOOK_SECRET** - Your Stripe webhook secret

### Step 5: Run Database Migrations (2 minutes)

After deployment completes:

1. Go to your service in Render
2. Click on service name: `featureme-backend`
3. Click **"Shell"** tab
4. Run:
   ```bash
   npx prisma migrate deploy
   ```
5. Wait for completion (should see "Applied migration...")

### Step 6: Verify Deployment (1 minute)

1. **Get your service URL:**
   - In Render dashboard, your service URL will be: `https://featureme-backend.onrender.com`
   - (Or whatever name Render assigned)

2. **Test Health Endpoint:**
   - Visit: `https://featureme-backend.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Test API:**
   - Visit: `https://featureme-backend.onrender.com/api/locations`
   - Should return locations data

## 🎯 Quick Commands

```bash
# Push to GitHub
cd /Users/ritambiswas/fm_website
git push -u origin main

# If you need to check status
git status
git remote -v
```

## 🔐 Your JWT Secrets (Save These!)

```
JWT_SECRET:
e6d93d475578c162dc353592c10fa28cbb41d2e6a530046cc9ef7a11e2f93be219cfc127166829586281fec92f7e8cc9452b2f59e16c21aed170e170474c027e

JWT_REFRESH_SECRET:
856b114e08c4cf5a00d437270c9e199f4b5bd4905c61f009ae1b87f7210347af1f8eea9b67893184715fb049ced04c92311b5f4d459fd8dcb8902f93deaae304
```

## 🆘 Troubleshooting

### GitHub Push Issues
- **Authentication Error:** Use Personal Access Token (see Step 2)
- **Repository Not Found:** Make sure you created the repo first
- **Permission Denied:** Check repository name matches exactly

### Render Deployment Issues
- **Build Fails:** Check logs in Render dashboard
- **Database Error:** Verify DATABASE_URL is correct
- **Service Crashes:** Check all environment variables are set

## ✅ Checklist

- [ ] GitHub repository created: `Ritambiswas0074/fm_website`
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Blueprint deployed
- [ ] Environment variables set (7 required)
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

**Ready to deploy!** Follow steps 1-6 above. 🚀
