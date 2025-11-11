# Quick Start Guide - Database Setup

## ✅ What's Done
- ✅ Dependencies installed
- ✅ Windows compatibility fixed (cross-env added)
- ✅ All code complete

## ⚠️ What You Need to Do

### Step 1: Set Up Neon Database (Free - Takes 2 minutes)

1. **Go to** https://neon.tech
2. **Sign up** for a free account
3. **Create a new project** - Choose any name you like
4. **Copy the connection string** - It looks like:
   ```
   postgresql://username:password@host.neon.tech/database?sslmode=require
   ```

### Step 2: Create .env File

1. In the CardPrinter folder, create a file named `.env` (no extension)
2. Add this line (replace with your actual connection string):
   ```
   DATABASE_URL=postgresql://your-connection-string-here
   ```

### Step 3: Run the App

```bash
# Push database schema (creates tables)
npm run db:push

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5000**

## Alternative: Use Local SQLite (Simpler but less features)

If you don't want to use Neon, you can modify the app to use SQLite instead. This requires changing the database configuration.

## Need Help?

1. **Can't access Neon.tech?**
   - Try using a VPN or ask someone to create the database for you

2. **Database errors?**
   - Make sure your DATABASE_URL is correct
   - Check if you have internet connection
   - Verify the connection string includes `?sslmode=require` at the end

3. **Port already in use?**
   - Change the port in `server/index.ts`

## Files Created/Modified

✅ All backend and frontend code is complete and ready
✅ Windows compatibility issue fixed
✅ Just need database credentials to run!
