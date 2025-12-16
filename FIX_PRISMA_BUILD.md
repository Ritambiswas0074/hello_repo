# 🔧 Fix Prisma Build Error

## Problem
Prisma can't find `schema.prisma` during build because the path isn't specified.

## Solution: Update Build Command in Render

### Step 1: Update Build Command in Render Dashboard

1. **Go to:** https://dashboard.render.com
2. **Your service:** `featureme-backend`
3. **Click:** "Settings" tab
4. **Scroll to:** "Build & Deploy" section
5. **Find:** "Build Command" field
6. **Change it to:**
   ```
   cd backend && npm install && npx prisma generate --schema=./prisma/schema.prisma && npm run build
   ```
   OR if Root Directory is already set to `backend`:
   ```
   npm install && npx prisma generate --schema=./prisma/schema.prisma && npm run build
   ```
7. **Click:** "Save Changes"

### Step 2: Deploy Again

After updating the build command:

1. **Click:** "Manual Deploy" button
2. **Wait** for deployment

## Alternative: Check Root Directory

If Root Directory is NOT set to `backend`:

**Build Command should be:**
```
cd backend && npm install && npx prisma generate && npm run build
```

If Root Directory IS set to `backend`:

**Build Command should be:**
```
npm install && npx prisma generate --schema=./prisma/schema.prisma && npm run build
```

## Current Settings Check

**Verify in Render Settings:**
- **Root Directory:** Should be `backend` (or empty)
- **Build Command:** Should include Prisma schema path

---

**Update the build command in Render Settings, then deploy again!** 🚀
