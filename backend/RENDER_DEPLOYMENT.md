# Render Deployment Guide for FeatureMe Backend

This guide will help you deploy the FeatureMe backend to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A PostgreSQL database (you can use Render's PostgreSQL service or an external one like Neon)
3. All your API keys and secrets ready:
   - Database connection string
   - JWT secrets
   - Cloudinary credentials
   - Stripe keys
   - Frontend URL

## Step-by-Step Deployment

### Option 1: Deploy using render.yaml (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect your repository to Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing your backend
   - Render will automatically detect the `render.yaml` file

3. **Set Environment Variables**
   In the Render dashboard, go to your service → Environment tab and add:
   
   **Required Variables:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - A strong random string for JWT access tokens
   - `JWT_REFRESH_SECRET` - A different strong random string for refresh tokens
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (or leave empty if not using)
   - `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret (or leave empty)
   - `FRONTEND_URL` - Your frontend URL (e.g., https://your-frontend.vercel.app)

   **Optional Variables:**
   - `JWT_EXPIRES_IN` - Default: 24h
   - `JWT_REFRESH_EXPIRES_IN` - Default: 7d
   - `WHATSAPP_NUMBER` - Default: 9477493296
   - `NODE_ENV` - Will be set to "production" automatically

4. **Deploy**
   - Render will automatically build and deploy your service
   - The build process will:
     1. Install dependencies
     2. Generate Prisma client
     3. Build TypeScript code
     4. Start the server

5. **Run Database Migrations**
   After the first deployment, you need to run migrations:
   - Go to your service in Render dashboard
   - Open the Shell tab
   - Run: `npx prisma migrate deploy`
   - Or if you prefer, run locally: `npx prisma migrate deploy --schema=./prisma/schema.prisma`

### Option 2: Manual Deployment

1. **Create a new Web Service**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch

2. **Configure the Service**
   - **Name**: `featureme-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users (e.g., Oregon)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (if your backend is in a subdirectory)
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   Add all the environment variables listed in Option 1 above.

4. **Deploy**
   Click "Create Web Service" and Render will start the deployment.

## Database Setup

### Using Render PostgreSQL

1. Create a new PostgreSQL database in Render
2. Copy the Internal Database URL
3. Set it as `DATABASE_URL` in your web service environment variables

### Using External Database (e.g., Neon)

1. Get your connection string from your database provider
2. Set it as `DATABASE_URL` in your web service environment variables
3. Make sure the connection string uses SSL if required

## Post-Deployment Steps

1. **Run Database Migrations**
   ```bash
   # In Render Shell or locally
   npx prisma migrate deploy
   ```

2. **Verify Deployment**
   - Check the health endpoint: `https://your-service.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Update Frontend**
   - Update your frontend's API URL to point to your Render service
   - Update CORS settings if needed

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Yes | Secret for JWT access tokens | `your-super-secret-key-here` |
| `JWT_REFRESH_SECRET` | Yes | Secret for JWT refresh tokens | `your-refresh-secret-key-here` |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret | `your-api-secret` |
| `FRONTEND_URL` | Yes | Your frontend URL for CORS | `https://your-app.vercel.app` |
| `STRIPE_SECRET_KEY` | No | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret | `whsec_...` |
| `WHATSAPP_NUMBER` | No | WhatsApp number | `9477493296` |
| `PORT` | Auto | Server port (set by Render) | `10000` |
| `NODE_ENV` | Auto | Environment (set by Render) | `production` |

## Generating JWT Secrets

You can generate secure random secrets using:

```bash
# For JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# For JWT_REFRESH_SECRET (run again for a different value)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Verify TypeScript compiles without errors locally

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Render's IPs
- For Neon, ensure you're using the pooler connection string

### Prisma Issues
- Make sure `prisma generate` runs during build
- Verify Prisma schema is correct
- Run migrations: `npx prisma migrate deploy`

### CORS Errors
- Update `FRONTEND_URL` environment variable
- Check `app.ts` CORS configuration

### Service Crashes
- Check logs in Render dashboard
- Verify all required environment variables are set
- Test health endpoint: `/health`

## Updating Your Deployment

1. Push changes to your GitHub repository
2. Render will automatically detect and deploy the changes
3. Monitor the deployment in the Render dashboard

## Custom Domain (Optional)

1. Go to your service → Settings → Custom Domains
2. Add your domain
3. Follow Render's DNS configuration instructions
4. Update `FRONTEND_URL` if needed

## Monitoring

- View logs in real-time in Render dashboard
- Set up alerts for service failures
- Monitor database connections and performance

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com

---

**Note**: The free tier on Render spins down services after 15 minutes of inactivity. For production, consider upgrading to a paid plan.

