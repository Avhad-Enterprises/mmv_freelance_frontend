// Firebase Authentication Debugging Utility
// Use this to verify Firebase setup and authentication flow

import { auth } from '@/lib/firebase';
import axios from 'axios';

export const debugFirebaseAuth = async () => {
  console.log('🔍 Firebase Debug Start');
  console.log('='.repeat(50));

  // 1. Check Firebase Config
  console.log('\n1️⃣ Firebase Configuration:');
  console.log('  API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...');
  console.log('  Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('  Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

  // 2. Check Firebase Auth Instance
  console.log('\n2️⃣ Firebase Auth Instance:');
  console.log('  Initialized:', !!auth);
  console.log('  Current User:', auth.currentUser?.uid || 'Not authenticated');
  console.log('  Email:', auth.currentUser?.email || 'N/A');

  // 3. Test Backend Token Endpoint
  console.log('\n3️⃣ Testing Backend Token Endpoint:');
  try {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    
    if (!token) {
      console.error('  ❌ No auth token found in localStorage or sessionStorage');
      return;
    }

    console.log('  JWT Token found:', token.substring(0, 20) + '...');

    const response = await axios.get(
      'http://localhost:8000/api/v1/auth/firebase-token',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('  ✅ Backend Response:', response.status);
    console.log('  Custom Token:', response.data.data?.customToken?.substring(0, 30) + '...');

    // 4. Test Firebase Sign In
    console.log('\n4️⃣ Testing Firebase Sign In:');
    if (response.data.data?.customToken) {
      const { signInWithCustomToken } = await import('firebase/auth');
      
      const userCredential = await signInWithCustomToken(auth, response.data.data.customToken);
      console.log('  ✅ Sign In Successful');
      console.log('  User UID:', userCredential.user.uid);
      
      // Get ID token
      const idToken = await userCredential.user.getIdToken();
      console.log('  ID Token:', idToken.substring(0, 30) + '...');

      // 5. Test Realtime Database Access
      console.log('\n5️⃣ Testing Realtime Database Access:');
      try {
        const { ref, get } = await import('firebase/database');
        const { db } = await import('@/lib/firebase');
        
        const conversationsRef = ref(db, 'conversations');
        const snapshot = await get(conversationsRef);
        
        console.log('  ✅ Realtime Database Access Successful');
        console.log('  Conversations Exist:', snapshot.exists());
      } catch (error: any) {
        console.error('  ❌ Realtime Database Error:', error.message);
        console.error('  Error Code:', error.code);
      }
    }

  } catch (error: any) {
    console.error('  ❌ Backend Error:', error.message);
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🔍 Firebase Debug End');
};

// Quick check function for production use
export const checkFirebaseAuth = async (): Promise<boolean> => {
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      console.log('⚠️ No Firebase user authenticated');
      return false;
    }

    // Verify token is still valid
    await auth.currentUser.getIdToken(true);
    console.log('✅ Firebase authentication valid');
    return true;

  } catch (error: any) {
    console.error('❌ Firebase authentication check failed:', error.message);
    return false;
  }
};

// Auto-refresh token before expiry
export const setupTokenRefresh = (auth: any) => {
  // Firebase tokens expire after 1 hour
  // Refresh 5 minutes before expiry (55 minutes)
  const REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes in ms

  return setInterval(async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true);
        console.log('🔄 Firebase token refreshed automatically');
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
    }
  }, REFRESH_INTERVAL);
};

// Usage in component:
// import { debugFirebaseAuth, checkFirebaseAuth, setupTokenRefresh } from '@/utils/firebase-debug';
// 
// // In useEffect:
// debugFirebaseAuth(); // Run full debug
// 
// // Before Firestore operations:
// const isAuthed = await checkFirebaseAuth();
// if (!isAuthed) {
//   // Re-authenticate
// }
//
// // Setup auto-refresh:
// const refreshInterval = setupTokenRefresh(auth);
// return () => clearInterval(refreshInterval);
