# 🚀 Deploy with Render CLI (Correct Method)

## ✅ Render CLI Installed!

The correct Render CLI is now installed via Homebrew.

## Step 1: Login to Render

```bash
render login
```

This will:
- Open your browser
- Ask you to authorize the CLI
- Complete authentication

## Step 2: Create Service in Render Dashboard

**Before deploying, you need to create the service in Render dashboard:**

1. Go to: https://dashboard.render.com
2. Sign up/Login (if not already)
3. Click "New +" → "Web Service"
4. Configure:
   - **Name:** `featureme-backend`
   - **Environment:** `Node`
   - **Region:** `Oregon` (or closest)
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
   - **Plan:** `Starter` (free tier)
5. Click "Create Web Service"

## Step 3: Set Environment Variables

In your service → **Environment** tab, add:

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

## Step 4: Deploy Your Code

After creating the service and setting environment variables:

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

The CLI will:
- Ask you to select your service
- Upload your code
- Trigger a build
- Deploy your backend

## Step 5: Run Database Migrations

After deployment:

1. Go to your service in Render dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

## Step 6: Verify Deployment

Visit: `https://featureme-backend.onrender.com/health`

Should return: `{"status":"ok","timestamp":"..."}`

## 🔄 Updating Your Deployment

When you make changes:

```bash
cd /Users/ritambiswas/fm_website/backend
render deploy
```

## 📋 Quick Commands

```bash
# Login
render login

# List services
render services

# Deploy
cd backend
render deploy

# View logs
render logs <service-name>
```

## 🆘 Troubleshooting

**If `render login` fails:**
- Make sure you're logged into Render in your browser
- Try: `render logout` then `render login` again

**If `render deploy` can't find service:**
- Make sure service is created in dashboard first
- Check service name matches exactly

**If build fails:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Test build locally: `cd backend && npm run build`

---

**Ready to deploy!** Start with `render login` 🚀

