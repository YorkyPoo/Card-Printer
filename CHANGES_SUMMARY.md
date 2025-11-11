# Card Printer - Changes Summary

## Overview
I've added topic management features to your Card Printer app. The app was built on Replit and needs to be completed with the UI components for managing topics.

## Changes Made

### 1. Database Schema Updates (`shared/schema.ts`)
- ✅ Added `topics` table with fields:
  - `id`: Unique identifier
  - `name`: Topic name
  - `createdAt`: Timestamp
- ✅ Updated `cards` table to include:
  - `topicId`: Foreign key linking cards to topics (optional)

### 2. Backend API Endpoints (`server/routes.ts`)
Added the following new API endpoints:

- ✅ `GET /api/topics` - Fetch all topics
- ✅ `POST /api/topics` - Create a new topic
- ✅ `POST /api/topics/:topicId/cards` - Add cards to a topic
- ✅ `GET /api/topics/:topicId/cards` - Get all cards in a topic
- ✅ `DELETE /api/topics/:id` - Delete a topic

### 3. Storage Layer (`server/storage.ts`)
Added methods to the `DatabaseStorage` class:

- ✅ `getTopics()` - Retrieve all topics
- ✅ `createTopic(topic)` - Create a new topic
- ✅ `deleteTopic(id)` - Delete a topic
- ✅ `addCardsToTopic(topicId, cardIds)` - Associate cards with a topic
- ✅ `getCardsByTopic(topicId)` - Get cards filtered by topic

### 4. Frontend Updates (`client/src/pages/home.tsx`)
Started updates to add:
- State management for topics and card selection
- UI components imported (DropdownMenu, Dialog, Input, Label)

## What Still Needs to Be Done

### Frontend Implementation Required:

1. **Add Topics Query**
```typescript
const { data: topics = [] } = useQuery<Topic[]>({
  queryKey: ["/api/topics"],
});
```

2. **Add Topic Mutations**
```typescript
const createTopicMutation = useMutation({
  mutationFn: async (name: string) =>
    apiRequest("POST", "/api/topics", { name }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/topics"] });
    setShowNewTopicDialog(false);
    setNewTopicName("");
  },
});

const addCardsToTopicMutation = useMutation({
  mutationFn: async ({ topicId, cardIds }: { topicId: string; cardIds: string[] }) =>
    apiRequest("POST", `/api/topics/${topicId}/cards`, { cardIds }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
    setShowAddToTopicDialog(false);
    setSelectedCards([]);
  },
});
```

3. **Add Menu Button to Header** (next to "Preview Print Layout" button)
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      <Menu className="w-4 h-4 mr-2" />
      Topics
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Saved Topics</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {topics.map((topic) => (
      <DropdownMenuItem
        key={topic.id}
        onClick={() => setCurrentTopicFilter(topic.id)}
      >
        {topic.name}
      </DropdownMenuItem>
    ))}
    {topics.length === 0 && (
      <DropdownMenuItem disabled>No topics yet</DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>
```

4. **Add Two Buttons Next to "Preview Print Layout"**

Button 1 - "Add to Current Topic":
```tsx
<Button
  variant="outline"
  onClick={() => setShowAddToTopicDialog(true)}
  disabled={selectedCards.length === 0}
>
  <Plus className="w-4 h-4 mr-2" />
  Add to Topic
</Button>
```

Button 2 - "Create New Topic":
```tsx
<Button
  variant="outline"
  onClick={() => setShowNewTopicDialog(true)}
  disabled={cards.length === 0}
>
  <FolderPlus className="w-4 h-4 mr-2" />
  New Topic
</Button>
```

5. **Add Dialog for Creating New Topic**
```tsx
<Dialog open={showNewTopicDialog} onOpenChange={setShowNewTopicDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Topic</DialogTitle>
      <DialogDescription>
        Enter a name for your new topic collection
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="topic-name">Topic Name</Label>
        <Input
          id="topic-name"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          placeholder="e.g., Math Cards, Science Terms"
        />
      </div>
    </div>
    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setShowNewTopicDialog(false)}
      >
        Cancel
      </Button>
      <Button
        onClick={() => createTopicMutation.mutate(newTopicName)}
        disabled={!newTopicName.trim()}
      >
        Create Topic
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

6. **Add Card Selection Functionality**
Update the card display to allow selection by adding checkboxes

7. **Filter Cards by Topic**
Update the cards query to filter by topic when a topic is selected

## Database Migration Required

Before running the app, you need to update the database schema:

```bash
npm run db:push
```

This will apply the schema changes (adding the topics table and topicId field to cards).

## How to Complete the Implementation

1. Open the project in your code editor
2. Complete the frontend implementation in `client/src/pages/home.tsx` using the code snippets above
3. Run `npm install` to ensure all dependencies are installed
4. Run `npm run db:push` to update the database schema
5. Start the development server with `npm run dev`
6. Test the new features:
   - Create topics via the menu
   - Select cards and add them to topics
   - Filter cards by topic

## Features Summary

### What Works Now:
- ✅ Backend API for topic management
- ✅ Database schema supports topics
- ✅ Storage layer methods implemented

### What Needs Frontend Work:
- ⏳ Menu button with topics list
- ⏳ "Add to Topic" button
- ⏳ "New Topic" button and dialog
- ⏳ Card selection UI
- ⏳ Topic filtering

## Additional Notes

The app uses:
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: React with TypeScript, TanStack Query, shadcn/ui components
- **Originally built on**: Replit

All the backend work is complete. You just need to add the UI components to the home page to enable users to interact with the topic features.
