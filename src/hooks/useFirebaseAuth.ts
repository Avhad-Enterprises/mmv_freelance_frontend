import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Cookies from 'js-cookie';

interface UseFirebaseAuthReturn {
    firebaseAuthenticated: boolean;
    authError: string | null;
}

/**
 * Custom hook to handle Firebase authentication
 * Manages Firebase auth state and custom token authentication
 */
export function useFirebaseAuth(): UseFirebaseAuthReturn {
    const [firebaseAuthenticated, setFirebaseAuthenticated] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
        isMountedRef.current = true;

        if (!auth) {
            console.error('Firebase auth not initialized');
            setAuthError('Firebase authentication not available');
            return;
        }

        // Monitor Firebase auth state
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!isMountedRef.current) return;

            if (firebaseUser) {
                setFirebaseAuthenticated(true);
                setAuthError(null);
            } else {
                // Get custom token from backend
                try {
                    const authToken = Cookies.get('auth_token');
                    if (!authToken) {
                        console.error('No auth token found in cookies');
                        setAuthError('Please sign in to use the chat feature');
                        return;
                    }

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/firebase-token`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to get Firebase token: ${response.statusText}`);
                    }

                    const data = await response.json();
                    if (data.success && data.data?.customToken) {
                        // Sign in to Firebase with custom token
                        await signInWithCustomToken(auth, data.data.customToken);

                        if (isMountedRef.current) {
                            setFirebaseAuthenticated(true);
                            setAuthError(null);
                        }
                    } else {
                        throw new Error('Invalid response from Firebase token endpoint');
                    }
                } catch (err: any) {
                    console.error('Firebase authentication failed:', err);
                    if (isMountedRef.current) {
                        setAuthError('Failed to authenticate with chat service. Please refresh the page.');
                        setFirebaseAuthenticated(false);
                    }
                }
            }
        });

        return () => {
            isMountedRef.current = false;
            unsubscribeAuth();
        };
    }, []);

    return { firebaseAuthenticated, authError };
}
