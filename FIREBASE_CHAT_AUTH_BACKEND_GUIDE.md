# Firebase Chat Authentication - Backend Implementation Guide

## Overview
The chat feature in the frontend uses Firebase Client SDK and requires a backend endpoint to generate custom Firebase authentication tokens. This ensures users can only access Firebase as their authenticated user account.

## Required Backend Endpoint

### Endpoint Details
- **URL**: `GET /api/v1/auth/firebase-token`
- **Authentication**: Required (Bearer token)
- **Response Format**: JSON

### Request
```http
GET /api/v1/auth/firebase-token HTTP/1.1
Host: your-api-domain.com
Authorization: Bearer <user_auth_token>
Content-Type: application/json
```

### Response Format
```json
{
  "success": true,
  "data": {
    "customToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Authentication failed"
}
```

## Backend Implementation

### 1. Install Firebase Admin SDK
```bash
npm install firebase-admin
# or
yarn add firebase-admin
```

### 2. Initialize Firebase Admin (One time setup)

Create a service account key from Firebase Console:
1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely

```typescript
// firebaseAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from './path/to/serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
```

### 3. Create the Endpoint

#### Express.js Example
```typescript
import { Router } from 'express';
import { adminAuth } from './firebaseAdmin';
import { authenticateUser } from './middleware/auth'; // Your auth middleware

const router = Router();

router.get('/auth/firebase-token', authenticateUser, async (req, res) => {
  try {
    // Get user ID from your authentication middleware
    const userId = req.user.user_id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID not found'
      });
    }

    // Create custom Firebase token
    const customToken = await adminAuth.createCustomToken(String(userId), {
      // Optional: Add custom claims
      email: req.user.email,
      firstName: req.user.first_name,
      role: req.user.role
    });

    return res.json({
      success: true,
      data: {
        customToken
      }
    });
  } catch (error) {
    console.error('Firebase custom token generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate Firebase authentication token'
    });
  }
});

export default router;
```

#### NestJS Example
```typescript
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { adminAuth } from './firebase-admin';

@Controller('auth')
export class AuthController {
  @Get('firebase-token')
  @UseGuards(AuthGuard)
  async getFirebaseToken(@Req() req) {
    try {
      const userId = req.user.user_id;
      
      if (!userId) {
        return {
          success: false,
          error: 'User ID not found'
        };
      }

      const customToken = await adminAuth.createCustomToken(String(userId), {
        email: req.user.email,
        firstName: req.user.first_name,
        role: req.user.role
      });

      return {
        success: true,
        data: {
          customToken
        }
      };
    } catch (error) {
      console.error('Firebase custom token generation error:', error);
      return {
        success: false,
        error: 'Failed to generate Firebase authentication token'
      };
    }
  }
}
```

## Security Considerations

1. **Always validate the user's auth token** before generating a Firebase custom token
2. **Use the user's actual ID** from your database as the Firebase UID
3. **Set appropriate custom claims** to match your user's permissions
4. **Keep service account key secure** - Never commit it to version control
5. **Use environment variables** for Firebase configuration
6. **Rate limit the endpoint** to prevent abuse

## Environment Variables Required

Add these to your backend `.env` file:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

Or use the service account JSON file path:
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/serviceAccountKey.json
```

## Testing the Endpoint

### Using cURL
```bash
curl -X GET http://localhost:YOUR_PORT/api/v1/auth/firebase-token \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json"
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "customToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY5NDU0MTU5MCwiZXhwIjoxNjk0NTQ1MTkwLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay..."
  }
}
```

## Troubleshooting

### Issue: "Service account not found"
- Ensure the service account JSON file path is correct
- Verify the file has proper read permissions

### Issue: "Insufficient permissions"
- Check that the service account has Firebase Admin privileges
- Verify the service account is enabled in Firebase Console

### Issue: "Invalid custom claims"
- Keep custom claims under 1000 bytes
- Use only JSON-serializable values

## Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Custom Token Authentication](https://firebase.google.com/docs/auth/admin/create-custom-tokens)
- [Service Account Setup](https://firebase.google.com/docs/admin/setup#initialize-sdk)
