# 🚀 Quick Start - Deploy to Render

## ✅ What I've Done For You

1. ✅ **Created Render configuration** (`render.yaml`)
2. ✅ **Updated package.json** with postinstall script
3. ✅ **Initialized Git repository** and committed all files
4. ✅ **Created deployment documentation**
5. ✅ **Generated JWT secrets** (see below)

## 🔐 Your Generated JWT Secrets

**IMPORTANT: Save these secrets! You'll need them for Render environment variables.**

```
JWT_SECRET:
1f3befa2b757a866526ec15d4201b0d1ff700439ef18bf55ef0b5dec439109f8ec60f73cf201a7dd1129aab8356aa9d24ce2c1663cff0a47ce7df2daff91e2f2

JWT_REFRESH_SECRET:
40e21f2ad86c6bc5bdf19399938259193916ffa4ab56871ac4f24c75810825d60afa846b6d580193fbcb89745ea8801c820c92c710cd174b5478cfb97d62a8cb
```

## 📋 Next Steps (You Need to Do These)

### 1. Push to GitHub (5 minutes)

```bash
# Create a new repository on GitHub first: https://github.com/new
# Then run these commands:

cd /Users/ritambiswas/fm_website
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

### 2. Deploy on Render (10 minutes)

1. **Go to Render:** https://dashboard.render.com
2. **Sign up/Login** (you can use GitHub)
3. **Click "New +" → "Blueprint"**
4. **Connect your GitHub repository**
5. **Select your repository** (`fm_website` or your repo name)
6. **Click "Apply"** - Render will detect `render.yaml` automatically

### 3. Set Environment Variables (5 minutes)

In Render dashboard → Your Service → **Environment** tab, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `JWT_SECRET` | `1f3befa2b757a866526ec15d4201b0d1ff700439ef18bf55ef0b5dec439109f8ec60f73cf201a7dd1129aab8356aa9d24ce2c1663cff0a47ce7df2daff91e2f2` |
| `JWT_REFRESH_SECRET` | `40e21f2ad86c6bc5bdf19399938259193916ffa4ab56871ac4f24c75810825d60afa846b6d580193fbcb89745ea8801c820c92c710cd174b5478cfb97d62a8cb` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `FRONTEND_URL` | Your frontend URL (e.g., `https://your-app.vercel.app`) |

### 4. Run Database Migrations (2 minutes)

After deployment:
1. Go to your service in Render
2. Click **Shell** tab
3. Run: `npx prisma migrate deploy`

### 5. Test Your Deployment

Visit: `https://your-service-name.onrender.com/health`

Should return: `{"status":"ok","timestamp":"..."}`

## 📚 Full Documentation

- **Detailed Guide:** `DEPLOYMENT_CHECKLIST.md`
- **Render Guide:** `backend/RENDER_DEPLOYMENT.md`

## 🆘 Need Help?

If you get stuck:
1. Check the logs in Render dashboard
2. Verify all environment variables are set
3. Make sure database is accessible
4. Test health endpoint: `/health`

## 🎉 After Deployment

Your backend will be live at:
```
https://your-service-name.onrender.com
```

Update your frontend to use this URL!

