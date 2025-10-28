// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// // Validate required configuration
// if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
//     throw new Error('Missing required Firebase configuration. Check your environment variables.');
// }

// // ====================================================================
// // ====================> ADD THIS LINE <===============================
// console.log("Reading Firebase Config:", firebaseConfig);
// // ====================================================================
// // ====================================================================

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const db = getFirestore(app);
// const auth = getAuth(app);
// const appId = firebaseConfig.appId || 'default-app-id';

// export { db, auth, appId };

// Firebase temporarily disabled due to build issues
export const db = null;
export const auth = null;
export const appId = 'firebase-disabled';