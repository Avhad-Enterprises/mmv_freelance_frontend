Quick Firestore Index Deployment

Why: 
1. The `conversations` query uses `where('participants', 'array-contains', <uid>)` with `orderBy('updatedAt', 'desc')` which requires a composite index.
2. The `messages` subcollection uses `orderBy('createdAt', 'asc')` to display chat history chronologically.

The project includes `firestore.indexes.json` with the required indexes.

Options to deploy:

A) Deploy via Firebase Console (quickest):
1. For conversations index, open this link (auto-creates index):
   https://console.firebase.google.com/v1/r/project/mmv-chatting/firestore/indexes?create_composite=ClJwcm9qZWN0cy9tbXYtY2hhdHRpbmcvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2NvbnZlcnNhdGlvbnMvaW5kZXhlcy9fEAEaEAoMcGFydGljaXBhbnRzGAEaDQoJdXBkYXRlZEF0EAIaDAoIX19uYW1lX18QAg
2. Click "Create Index" and wait until it becomes active (may take a minute).

B) Deploy using Firebase CLI (recommended - deploys all indexes):
1. Ensure `firebase-tools` is installed and you're logged in:

```bash
npm install -g firebase-tools
firebase login
```

2. From this folder run:

```bash
cd "d:\Avhad Intern Project\MMV Freelancing\mmv_freelance_frontend"
firebase deploy --only firestore:indexes
```

This will deploy both indexes:
- Conversations index (for chat list sorting)
- Messages index (for displaying all chat history)

Notes:
- The app now includes a runtime fallback: the `useConversations` hook will automatically fall back to an unsorted query and sort client-side if the index is not yet created, so the UI won't break immediately.
- Creating the indexes makes the queries more efficient and ensures all historical messages load properly.
- Messages will persist permanently in Firebase and can be accessed from any time period (1 month ago, 1 year ago, etc.)
