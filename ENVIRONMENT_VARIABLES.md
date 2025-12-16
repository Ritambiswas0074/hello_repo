# 🔐 Environment Variables for Render Dashboard

Copy and paste these into your Render service's Environment tab.

## Required Environment Variables

### 1. NODE_ENV
```
production
```

### 2. PORT
```
10000
```

### 3. DATABASE_URL
```
postgresql://user:password@host:port/database
```
**⚠️ Replace with your actual PostgreSQL connection string**
- If using Render PostgreSQL: Copy from your database dashboard
- If using Neon: Get from Neon dashboard
- Format: `postgresql://username:password@hostname:5432/database_name`

### 4. JWT_SECRET
```
e6d93d475578c162dc353592c10fa28cbb41d2e6a530046cc9ef7a11e2f93be219cfc127166829586281fec92f7e8cc9452b2f59e16c21aed170e170474c027e
```

### 5. JWT_REFRESH_SECRET
```
856b114e08c4cf5a00d437270c9e199f4b5bd4905c61f009ae1b87f7210347af1f8eea9b67893184715fb049ced04c92311b5f4d459fd8dcb8902f93deaae304
```

### 6. CLOUDINARY_CLOUD_NAME
```
YOUR_CLOUDINARY_CLOUD_NAME
```
**⚠️ Replace with your actual Cloudinary cloud name**
- Get from: https://console.cloudinary.com
- Example: `my-cloud-name`

### 7. CLOUDINARY_API_KEY
```
YOUR_CLOUDINARY_API_KEY
```
**⚠️ Replace with your actual Cloudinary API key**
- Get from: Cloudinary dashboard → Settings → API Keys
- Example: `123456789012345`

### 8. CLOUDINARY_API_SECRET
```
YOUR_CLOUDINARY_API_SECRET
```
**⚠️ Replace with your actual Cloudinary API secret**
- Get from: Cloudinary dashboard → Settings → API Keys
- Example: `your-secret-key-here`

### 9. FRONTEND_URL
```
https://your-frontend-url.vercel.app
```
**⚠️ Replace with your actual frontend URL**
- Where your React frontend is hosted
- Examples:
  - `https://your-app.vercel.app`
  - `https://your-app.netlify.app`
  - `https://your-domain.com`

---

## Optional Environment Variables (If Using Stripe)

### 10. STRIPE_SECRET_KEY (Optional)
```
sk_live_xxxxxxxxxxxxx
```
**⚠️ Only if you're using Stripe payments**
- Get from: Stripe dashboard → Developers → API keys
- Use test key: `sk_test_...` for testing
- Use live key: `sk_live_...` for production

### 11. STRIPE_WEBHOOK_SECRET (Optional)
```
whsec_xxxxxxxxxxxxx
```
**⚠️ Only if you're using Stripe webhooks**
- Get from: Stripe dashboard → Developers → Webhooks
- Create webhook endpoint first, then copy the secret

---

## 📋 Quick Copy-Paste Format

When adding in Render dashboard, use this format:

| Variable Name | Value |
|--------------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | `your-postgresql-connection-string` |
| `JWT_SECRET` | `e6d93d475578c162dc353592c10fa28cbb41d2e6a530046cc9ef7a11e2f93be219cfc127166829586281fec92f7e8cc9452b2f59e16c21aed170e170474c027e` |
| `JWT_REFRESH_SECRET` | `856b114e08c4cf5a00d437270c9e199f4b5bd4905c61f009ae1b87f7210347af1f8eea9b67893184715fb049ced04c92311b5f4d459fd8dcb8902f93deaae304` |
| `CLOUDINARY_CLOUD_NAME` | `your-cloudinary-cloud-name` |
| `CLOUDINARY_API_KEY` | `your-cloudinary-api-key` |
| `CLOUDINARY_API_SECRET` | `your-cloudinary-api-secret` |
| `FRONTEND_URL` | `https://your-frontend-url.com` |

---

## ✅ Checklist

Before deploying, make sure you have:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `DATABASE_URL` = Your PostgreSQL connection string
- [ ] `JWT_SECRET` = (Copy from above)
- [ ] `JWT_REFRESH_SECRET` = (Copy from above)
- [ ] `CLOUDINARY_CLOUD_NAME` = Your Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` = Your Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` = Your Cloudinary API secret
- [ ] `FRONTEND_URL` = Your frontend URL

---

## 🔍 Where to Get Missing Values

### DATABASE_URL
- **Render PostgreSQL:** Dashboard → Your Database → Internal Database URL
- **Neon:** Dashboard → Connection String (use pooler)
- **Other:** Get from your database provider

### Cloudinary Credentials
1. Go to: https://console.cloudinary.com
2. Sign in
3. Go to: Settings → API Keys
4. Copy:
   - Cloud name
   - API Key
   - API Secret

### FRONTEND_URL
- Where your React frontend is deployed
- Examples: Vercel, Netlify, or your custom domain

---

## ⚠️ Important Notes

1. **Never commit these values to Git** - They're sensitive
2. **JWT secrets** are already generated - use the values above
3. **DATABASE_URL** must be a valid PostgreSQL connection string
4. **FRONTEND_URL** is used for CORS - must match your frontend exactly
5. **All values are case-sensitive** - Copy exactly as shown

---

**Ready to set these in Render dashboard!** 🚀
