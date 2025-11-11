# Card Printer - Setup and Usage Instructions

## ✅ What's Been Completed

All features have been implemented! Here's what's ready:

### Backend (100% Complete)
- ✅ Topics database table created
- ✅ Cards linked to topics via foreign key
- ✅ 5 API endpoints for topic management
- ✅ Storage layer with all CRUD operations

### Frontend (100% Complete)
- ✅ **Topics Menu Button** - View and filter by saved topics
- ✅ **Add to Topic Button** - Add current cards to an existing topic
- ✅ **New Topic Button** - Create a new topic
- ✅ Dialog modals for both operations
- ✅ Toast notifications for user feedback

## 🚀 How to Run the App

### Step 1: Install Dependencies
Open a terminal in the CardPrinter directory and run:
```bash
cd "C:\Users\slyre\Documents\Riley Flash Cards\CardPrinter\CardPrinter"
npm install
```

### Step 2: Update Database Schema
Apply the new database schema changes:
```bash
npm run db:push
```

This will create the `topics` table and add the `topicId` column to the `cards` table.

### Step 3: Start the Development Server
```bash
npm run dev
```

The app should now be running at `http://localhost:5000` (or whatever port is configured).

## 📖 How to Use the New Features

### Creating a Topic
1. Upload some cards to your collection
2. Click the **"New Topic"** button in the header
3. Enter a name for your topic (e.g., "Math Cards", "Science Terms")
4. Click **"Create Topic"**
5. You'll see a success notification

### Adding Cards to a Topic
1. Make sure you have cards uploaded
2. Click the **"Add to Topic"** button
3. Select a topic from the list
4. Click **"Add All Cards"**
5. All current cards will be associated with that topic

### Viewing Topics
1. Click the **"Topics"** dropdown menu
2. You'll see a list of all your saved topics
3. Click on any topic name to filter cards by that topic
4. Click "All Cards" to see everything

### Printing Cards from a Topic
1. Filter by a topic using the Topics menu
2. Click **"Preview Print Layout"**
3. You'll see only the cards from that topic
4. Click **"Print"** to send to your printer

## 🎯 Features Overview

### What Each Button Does:

**Topics (Menu Button)**
- Shows list of all saved topics
- Click "All Cards" to show everything
- Click any topic name to filter cards
- Located in the header next to other actions

**Add to Topic**
- Opens a dialog to select a topic
- Adds ALL current cards to the selected topic
- Disabled when no cards are uploaded
- Great for organizing cards after uploading

**New Topic**
- Opens a dialog to create a new topic
- Enter a descriptive name
- Creates the topic instantly
- Disabled when no cards exist

**Preview Print Layout** (existing feature)
- Shows print preview with 9 cards per page
- Now respects topic filtering
- MTG-sized cards (63mm x 88mm)

## 📝 Database Schema

### Topics Table
```typescript
{
  id: string (UUID)
  name: string
  createdAt: Date
}
```

### Cards Table (Updated)
```typescript
{
  id: string (UUID)
  imageUrl: string
  type: string
  originalFileName: string
  position: string
  topicId: string | null  // ← NEW: Links to topics table
  createdAt: Date
}
```

## 🔧 Troubleshooting

### "Cannot find module" errors
Run `npm install` to ensure all dependencies are installed.

### Database errors
Make sure you ran `npm run db:push` to apply the schema changes.

### Topics not showing up
Refresh the page after creating a topic. The query should auto-update, but a refresh ensures everything is in sync.

### Port already in use
If port 5000 is taken, check your `package.json` or environment variables for the port configuration.

## 🎨 UI Components Used

The app uses **shadcn/ui** components:
- `DropdownMenu` - For the Topics menu
- `Dialog` - For create/add modals
- `Button` - For all actions
- `Input` - For text entry
- `Label` - For form labels
- `Toast` - For notifications

## 📦 Project Structure

```
CardPrinter/
├── client/
│   └── src/
│       ├── pages/
│       │   └── home.tsx          ← Main UI (NOW UPDATED ✅)
│       └── components/ui/         ← shadcn components
├── server/
│   ├── routes.ts                  ← API endpoints (UPDATED ✅)
│   ├── storage.ts                 ← Database operations (UPDATED ✅)
│   └── db.ts                      ← Database connection
├── shared/
│   └── schema.ts                  ← Database schema (UPDATED ✅)
└── package.json
```

## 🎉 You're All Set!

The app is now fully functional with topic management. Upload some cards, create topics, and organize your collection!

For any issues, check the browser console and server logs for error messages.
