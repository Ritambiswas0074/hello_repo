# 🚀 FeatureMe Backend Deployment Checklist

## ✅ What's Already Done

- ✅ Render configuration file (`render.yaml`) created
- ✅ Package.json updated with postinstall script
- ✅ Deployment documentation created
- ✅ Git repository initialized
- ✅ Helper scripts created

## 📋 What You Need to Do

### Step 1: Push to GitHub

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name it (e.g., `fm_website` or `featureme-backend`)
   - Don't initialize with README
   - Click "Create repository"

2. **Connect and push your code:**
   ```bash
   cd /Users/ritambiswas/fm_website
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up (you can use GitHub to sign in)
3. Verify your email if required

### Step 3: Deploy on Render

1. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com
   - Click "New +" button
   - Select "Blueprint"

2. **Connect GitHub:**
   - Click "Connect account" if not already connected
   - Authorize Render to access your repositories
   - Select your repository (`fm_website` or your repo name)

3. **Render will detect `render.yaml`:**
   - It should automatically detect the configuration
   - Review the settings
   - Click "Apply" to create the service

### Step 4: Set Environment Variables

Go to your service → **Environment** tab and add these variables:

#### 🔴 Required Variables:

1. **DATABASE_URL**
   - Your PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database`
   - If using Render PostgreSQL: Copy from your database dashboard
   - If using Neon/other: Get from your database provider

2. **JWT_SECRET**
   - Generate by running: `node generate-secrets.js`
   - Copy the JWT_SECRET value

3. **JWT_REFRESH_SECRET**
   - From the same `generate-secrets.js` output
   - Copy the JWT_REFRESH_SECRET value

4. **CLOUDINARY_CLOUD_NAME**
   - From your Cloudinary dashboard
   - Example: `your-cloud-name`

5. **CLOUDINARY_API_KEY**
   - From your Cloudinary dashboard
   - Example: `123456789012345`

6. **CLOUDINARY_API_SECRET**
   - From your Cloudinary dashboard
   - Example: `your-api-secret-here`

7. **FRONTEND_URL**
   - Your frontend URL (where your React app is hosted)
   - Example: `https://your-app.vercel.app` or `https://your-app.netlify.app`
   - This is used for CORS configuration

#### 🟡 Optional Variables:

8. **STRIPE_SECRET_KEY** (if using Stripe)
   - Your Stripe secret key
   - Format: `sk_live_...` or `sk_test_...`

9. **STRIPE_WEBHOOK_SECRET** (if using Stripe webhooks)
   - Your Stripe webhook secret
   - Format: `whsec_...`

### Step 5: Run Database Migrations

After the first deployment:

1. Go to your service in Render dashboard
2. Click on the service name
3. Go to the **Shell** tab
4. Run:
   ```bash
   npx prisma migrate deploy
   ```
5. This will apply all database migrations

### Step 6: Verify Deployment

1. **Check the logs:**
   - Go to your service → **Logs** tab
   - Look for: `🚀 Server running on port 10000`
   - Should see: `✅ Database connected`

2. **Test the health endpoint:**
   - Your service URL will be: `https://your-service-name.onrender.com`
   - Visit: `https://your-service-name.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Test an API endpoint:**
   - Try: `https://your-service-name.onrender.com/api/locations`
   - Should return locations data

## 🛠️ Helper Commands

### Generate JWT Secrets:
```bash
cd /Users/ritambiswas/fm_website
node generate-secrets.js
```

### Run Deployment Preparation Script:
```bash
cd /Users/ritambiswas/fm_website
./deploy.sh
```

## 📝 Environment Variables Quick Reference

| Variable | Required | Where to Get It |
|----------|----------|-----------------|
| DATABASE_URL | ✅ Yes | PostgreSQL provider (Render/Neon/etc.) |
| JWT_SECRET | ✅ Yes | Run `node generate-secrets.js` |
| JWT_REFRESH_SECRET | ✅ Yes | Run `node generate-secrets.js` |
| CLOUDINARY_CLOUD_NAME | ✅ Yes | Cloudinary dashboard |
| CLOUDINARY_API_KEY | ✅ Yes | Cloudinary dashboard |
| CLOUDINARY_API_SECRET | ✅ Yes | Cloudinary dashboard |
| FRONTEND_URL | ✅ Yes | Your frontend hosting URL |
| STRIPE_SECRET_KEY | ⚠️ Optional | Stripe dashboard |
| STRIPE_WEBHOOK_SECRET | ⚠️ Optional | Stripe webhook settings |

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are correct
- Verify TypeScript compiles locally: `cd backend && npm run build`

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if database allows external connections
- For Neon: Use the pooler connection string

### Service Crashes
- Check logs in Render dashboard
- Verify all required environment variables are set
- Test health endpoint: `/health`

### CORS Errors
- Update FRONTEND_URL environment variable
- Ensure it matches your actual frontend URL exactly

## 📞 Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check `backend/RENDER_DEPLOYMENT.md` for more details

## 🎉 After Deployment

Once deployed, your backend will be available at:
```
https://your-service-name.onrender.com
```

Update your frontend API configuration to use this URL!
