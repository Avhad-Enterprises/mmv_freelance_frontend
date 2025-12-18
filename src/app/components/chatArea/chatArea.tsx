'use client'
/**
 * Chat Area Component - Firebase Client SDK Implementation
 * 
 * AUTHENTICATION APPROACH:
 * This component uses Firebase Client SDK (NOT Admin SDK) for browser-based chat.
 * 
 * Authentication Flow:
 * 1. Uses onAuthStateChanged to monitor Firebase auth state
 * 2. Requests custom Firebase token from backend API
 * 3. Signs in with custom token using signInWithCustomToken()
 * 
 * BACKEND REQUIREMENT:
 * Your backend needs to implement this endpoint:
 * GET /api/v1/auth/firebase-token
 * - Headers: Authorization: Bearer <auth_token>
 * - Response: { success: true, data: { customToken: string } }
 * 
 * The backend should:
 * 1. Verify the user's auth_token
 * 2. Use Firebase Admin SDK to create a custom token for that user
 * 3. Return the custom token to the frontend
 * 
 * Example backend code (Node.js):
 * ```
 * import admin from 'firebase-admin';
 * 
 * router.get('/auth/firebase-token', authenticateUser, async (req, res) => {
 *   const userId = req.user.user_id;
 *   const customToken = await admin.auth().createCustomToken(String(userId));
 *   res.json({ success: true, data: { customToken } });
 * });
 * ```
 */
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import {
  ref, onValue, set, push, get, query, orderByChild, 
  limitToLast, endBefore, onDisconnect, serverTimestamp as rtdbServerTimestamp,
  update, off
} from "firebase/database";
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { MessageCircle, Plus } from 'lucide-react';
import ChatHeader from '@/app/components/chatArea/ChatHeader';
import ProfileDetailsModal from '@/app/components/chatArea/ProfileDetailsModal';
import ChatBody, { LocalMessage } from '@/app/components/chatArea/ChatBody';
import ChatInput from '@/app/components/chatArea/ChatInput';
import AuthenticatedImage from '@/app/components/common/AuthenticatedImage';
import Cookies from 'js-cookie';
import { db as sharedDb, auth } from '@/lib/firebase';

// ---------------- STYLES ----------------
const styles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive Styles */
  .chat-shell {
    display: flex;
    background: linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%);
    height: calc(100vh - 240px);
    min-height: 560px;
    border-radius: 30px;
    overflow: hidden;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    box-shadow: 0 4px 20px rgba(36,64,52,0.08);
    border: 1px solid rgba(49,121,90,0.12);
  }

  .chat-search-input::placeholder {
    color: rgba(255,255,255,0.65);
  }

  .chat-search-input:focus {
    outline: none;
    border-color: #D2F34C !important;
    box-shadow: 0 0 0 2px rgba(210,243,76,0.2);
  }

  /* Custom scrollbar for chat */
  .chat-sidebar::-webkit-scrollbar,
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-sidebar::-webkit-scrollbar-track,
  .chat-messages::-webkit-scrollbar-track {
    background: #F0F5F3;
  }
  
  .chat-sidebar::-webkit-scrollbar-thumb,
  .chat-messages::-webkit-scrollbar-thumb {
    background: #31795A;
    border-radius: 3px;
  }

  .chat-sidebar::-webkit-scrollbar-thumb:hover,
  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: #244034;
  }

  @media (max-width: 768px) {
    .chat-shell {
      height: calc(100vh - 200px);
      min-height: 520px;
      border-radius: 20px;
    }

    .chat-sidebar {
      width: 100% !important;
      border-right: none !important;
      display: flex;
      border-radius: 20px 20px 0 0 !important;
    }
    
    .chat-main {
      display: none !important;
    }
    
    .chat-main.active {
      display: flex !important;
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
      z-index: 50;
      background: linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%);
      border-radius: 0;
    }

    .mobile-back-btn {
      display: flex !important;
    }
  }

  @media (min-width: 769px) {
    .mobile-back-btn {
      display: none !important;
    }
  }
`;


// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('chat-area-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'chat-area-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ---------------- CONSTANTS ----------------
const MESSAGES_PER_PAGE = 50; // Load 50 messages at a time

// ---------------- TYPES ----------------
interface Conversation {
  id: string;
  participants: string[];
  participantDetails: { [userId: string]: { email: string; firstName: string; profilePicture?: string; } };
  createdAt?: number;
  lastMessage?: string;
  lastMessageTime?: number;
  updatedAt?: number;  // Support both naming conventions
  lastSenderId?: string;
  hasUnread?: boolean;
}

interface UserData {
  user_id: string;
  first_name: string;
  email: string;
}

interface ClientProfile {
  user_id: string;
  first_name: string;
  last_name?: string;
  email: string;
  profile_picture?: string;
}

// ---------------- COMPONENT ----------------
const ChatArea: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newChatUserId, setNewChatUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'info'>('error');
  const [showErrorToast, setShowErrorToast] = useState<boolean>(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileModalUser, setProfileModalUser] = useState<{ id?: string; firstName?: string; email?: string } | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Pagination state
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<number | null>(null);
  
  // Connection state monitoring
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  
  // Optimistic message updates
  const [pendingMessages, setPendingMessages] = useState<Map<string, LocalMessage>>(new Map());
  const pendingMessagesRef = useRef<Map<string, LocalMessage>>(new Map());
  
  // Client profile cache
  const [clientProfiles, setClientProfiles] = useState<Map<string, ClientProfile>>(new Map());
  const [loadingProfiles, setLoadingProfiles] = useState<Set<string>>(new Set());
  const profileCacheRef = useRef<Map<string, ClientProfile>>(new Map());
  const loadingProfilesRef = useRef<Set<string>>(new Set());
  
  // Memory leak prevention: Track component mount state
  const isMountedRef = useRef<boolean>(true);
  
  // Track active subscriptions for cleanup
  const conversationsUnsubscribeRef = useRef<(() => void) | null>(null);
  const messagesUnsubscribeRef = useRef<(() => void) | null>(null);
  const typingUnsubscribeRef = useRef<(() => void) | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Use shared Firebase db instance (same as client thread page)
  const db = sharedDb;
  
  // State to track Firebase authentication
  const [firebaseAuthenticated, setFirebaseAuthenticated] = useState<boolean>(false);
  
  // ---------------- FIREBASE AUTHENTICATION ----------------
  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth not initialized');
      return;
    }

    // Monitor Firebase auth state
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('✅ Firebase user already authenticated:', firebaseUser.uid);
        setFirebaseAuthenticated(true);
      } else {
        console.log('⚠️ No Firebase user, attempting to sign in with custom token');
        
        // Get custom token from backend
        try {
          const authToken = Cookies.get('auth_token');
          if (!authToken) {
            console.error('No auth token found in cookies');
            showError('Please sign in to use the chat feature', 'error');
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
            console.log('✅ Signed in to Firebase successfully');
            setFirebaseAuthenticated(true);
          } else {
            throw new Error('Invalid response from Firebase token endpoint');
          }
        } catch (err: any) {
          console.error('❌ Firebase authentication failed:', err);
          showError('Failed to authenticate with chat service. Please refresh the page.', 'error');
          setFirebaseAuthenticated(false);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);
  
  // ---------------- ERROR HANDLING HELPERS ----------------
  const showError = (message: string, type: 'error' | 'warning' | 'info' = 'error', autoDismiss = true) => {
    setError(message);
    setErrorType(type);
    setShowErrorToast(true);
    
    // Clear any existing timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    
    // Auto-dismiss after 5 seconds for errors, 3 seconds for info/warning
    if (autoDismiss) {
      const dismissTime = type === 'error' ? 5000 : 3000;
      errorTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setShowErrorToast(false);
        }
      }, dismissTime);
    }
  };
  
  const dismissError = () => {
    setShowErrorToast(false);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  };
  
  // ---------------- CONNECTION STATE MONITORING ----------------
  useEffect(() => {
    // Monitor browser online/offline status
    const handleOnline = () => {
      console.log('🌐 Browser is online');
      if (isMountedRef.current) setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('📵 Browser is offline');
      if (isMountedRef.current) {
        setIsOnline(false);
        setIsConnected(false);
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial state
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Monitor Realtime Database connection state
  useEffect(() => {
    if (!db) return;
    
    // Listen to Firebase Realtime Database connection status
    const connectedRef = ref(db, '.info/connected');
    const unsubscribe = onValue(
      connectedRef,
      (snapshot) => {
        const connected = snapshot.val() === true;
        console.log(connected ? '🔥 Realtime Database connected' : '⚠️ Realtime Database disconnected');
        if (isMountedRef.current) setIsConnected(connected);
      },
      () => {
        // On error, assume disconnected
        if (isMountedRef.current) setIsConnected(false);
      }
    );
    
    return () => off(connectedRef, 'value', unsubscribe);
  }, [db]);
  
  // ---------------- CLEANUP ON UNMOUNT ----------------
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      console.log('ChatArea unmounting - cleaning up all subscriptions');
      isMountedRef.current = false;
      
      // Unsubscribe from all active listeners
      if (conversationsUnsubscribeRef.current) {
        conversationsUnsubscribeRef.current();
        conversationsUnsubscribeRef.current = null;
      }
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
        messagesUnsubscribeRef.current = null;
      }
      if (typingUnsubscribeRef.current) {
        typingUnsubscribeRef.current();
        typingUnsubscribeRef.current = null;
      }
      
      // Clear error timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }
      
      // Abort any pending fetch requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    if (!db) return;

    const fetchUserData = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          if (isMountedRef.current) {
            setError("Please log in to use the chat");
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();

        if (data.success && data.data.user) {
          const userData: UserData = {
            user_id: String(data.data.user.user_id),
            first_name: data.data.user.first_name,
            email: data.data.user.email
          };
          
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setCurrentUser(userData);
          }

          const userRef = ref(db, `users/${userData.user_id}`);
          await set(userRef, {
            email: userData.email,
            firstName: userData.first_name,
            userId: userData.user_id,
            lastActive: Date.now()
          });
        } else throw new Error('User data not found');
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (isMountedRef.current) {
          showError("Unable to load your profile. Please refresh the page or try again later.", 'error');
          setIsLoading(false);
        }
      }
    };
    fetchUserData();
  }, [db]);

  // ---------------- SUBSCRIBE TO CONVERSATIONS (REALTIME DATABASE) ----------------
  useEffect(() => {
    if (!currentUser?.user_id || !db) {
      console.log('Waiting for user or Realtime Database initialization...');
      return;
    }
    
    // Cleanup any existing subscription before creating a new one
    if (conversationsUnsubscribeRef.current) {
      console.log('Cleaning up previous conversations listener');
      conversationsUnsubscribeRef.current();
      conversationsUnsubscribeRef.current = null;
    }

    const userId = String(currentUser.user_id);
    console.log(`Setting up real-time listener for editor conversations (userId: ${userId})`);
    
    if (isMountedRef.current) {
      setIsLoading(true);
      setError(null);
    }

    // Query conversations where current user is a participant
    const conversationsRef = ref(db, 'conversations');

    const unsubscribe = onValue(
      conversationsRef,
      (snapshot) => {
        // Check if component is still mounted before updating state
        if (!isMountedRef.current) {
          console.log('Component unmounted, skipping conversation update');
          return;
        }
        
        const data = snapshot.val();
        if (!data) {
          console.log('No conversations found');
          if (isMountedRef.current) {
            setConversations([]);
            setIsLoading(false);
          }
          return;
        }
        
        // Filter conversations where current user is a participant
        const convos: Conversation[] = [];
        Object.keys(data).forEach(conversationId => {
          const convoData = data[conversationId];
          const participants = convoData.participants || [];
          
          // Check if current user is a participant
          if (participants.includes(userId)) {
            const isLastMessageFromOther = convoData.lastSenderId && convoData.lastSenderId !== userId;
            
            convos.push({
              id: conversationId,
              participants: participants,
              participantDetails: convoData.participantDetails || {},
              lastMessage: convoData.lastMessage || '',
              lastMessageTime: convoData.lastMessageTime,
              updatedAt: convoData.updatedAt,
              lastSenderId: convoData.lastSenderId || '',
              createdAt: convoData.createdAt,
              hasUnread: isLastMessageFromOther && convoData.lastMessage && !convoData.lastMessageRead
            });
          }
        });
        
        console.log(`Received ${convos.length} conversations from Realtime Database`);
        
        // Sort client-side by updatedAt or lastMessageTime (most recent first)
        convos.sort((a, b) => {
          const timeA = a.updatedAt || a.lastMessageTime || 0;
          const timeB = b.updatedAt || b.lastMessageTime || 0;
          return timeB - timeA;
        });
        
        if (isMountedRef.current) {
          setConversations(convos);
          setIsLoading(false);
        }
        
        if (convos.length === 0) {
          console.log('No conversations found for this editor');
        }
      },
      (err) => {
        console.error("Error fetching conversations from Realtime Database:", err);
        if (isMountedRef.current) {
          showError("Unable to load your conversations. Please check your connection and try again.", 'error');
          setIsLoading(false);
        }
      }
    );
    
    // Store unsubscribe function for cleanup
    conversationsUnsubscribeRef.current = () => off(conversationsRef, 'value', unsubscribe);

    // Cleanup listener on unmount or when dependencies change
    return () => {
      console.log('Cleaning up Realtime Database conversation listener');
      if (conversationsUnsubscribeRef.current) {
        conversationsUnsubscribeRef.current();
        conversationsUnsubscribeRef.current = null;
      }
    };
  }, [currentUser, db]);

  // ---------------- FETCH CLIENT PROFILES ----------------
  const fetchClientProfile = async (clientId: string): Promise<ClientProfile | null> => {
    // Check cache first
    if (profileCacheRef.current.has(clientId)) {
      return profileCacheRef.current.get(clientId) || null;
    }

    // Check if already loading
    if (loadingProfilesRef.current.has(clientId)) {
      return null;
    }

    // Mark as loading
    loadingProfilesRef.current.add(clientId);
    if (isMountedRef.current) {
      setLoadingProfiles(new Set(loadingProfilesRef.current));
    }

    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        console.error('No auth token available');
        return null;
      }

      // Try the public user info endpoint (works for any authenticated user)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${clientId}/public-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // If the endpoint fails, just log and return null
        // The UI will fallback to Firebase participantDetails
        console.log(`Could not fetch public info for user ${clientId}, will use conversation details`);
        return null;
      }

      const data = await response.json();
      if (data.success && data.data) {
        const userData = data.data;
        const profile: ClientProfile = {
          user_id: String(userData.user_id),
          first_name: userData.first_name || userData.company_name || userData.display_name || 'Client',
          last_name: userData.last_name || '',
          email: '',
          profile_picture: userData.profile_picture
        };

        console.log(`✅ Fetched profile for user ${clientId}:`, profile);

        // Cache the profile (only if component is still mounted)
        if (isMountedRef.current) {
          profileCacheRef.current.set(clientId, profile);
          setClientProfiles(new Map(profileCacheRef.current));
        }

        return profile;
      }

      return null;
    } catch (error) {
      console.log(`Could not fetch profile for user ${clientId}, will use conversation details`);
      return null;
    } finally {
      // Remove from loading set (only if component is still mounted)
      loadingProfilesRef.current.delete(clientId);
      if (isMountedRef.current) {
        setLoadingProfiles(new Set(loadingProfilesRef.current));
      }
    }
  };

  // Fetch profiles for all conversations
  useEffect(() => {
    if (!currentUser || conversations.length === 0) return;

    const isPlaceholderName = (n?: string | null) => {
      if (!n) return true;
      const s = n.toString().trim();
      return !s || /^user\s*name$/i.test(s) || /^user\s*\d+$/i.test(s);
    };

    const fetchAllProfiles = async () => {
      const fetchPromises = conversations.map(convo => {
        const clientId = convo.participants.find(p => p !== currentUser.user_id);
        const fallback = clientId ? convo.participantDetails?.[clientId] : null;

        // Fetch if we don't have a cached profile OR if the stored participant name looks like a placeholder
        if (clientId && (!profileCacheRef.current.has(clientId) && !loadingProfilesRef.current.has(clientId))) {
          return fetchClientProfile(clientId);
        }

        if (clientId && fallback && isPlaceholderName(fallback.firstName)) {
          return fetchClientProfile(clientId);
        }

        return Promise.resolve(null);
      });

      await Promise.all(fetchPromises);
    };

    fetchAllProfiles();
  }, [conversations, currentUser]);

  // Real-time listener for messages when a conversation is selected
  useEffect(() => {
    // Reset modal state
    if (isMountedRef.current) {
      setShowProfileModal(false);
      setProfileModalUser(null);
    }

    if (!selectedConversation?.id || !db) {
      if (isMountedRef.current) {
        setMessages([]);
        setHasMoreMessages(false);
        setOldestMessageTimestamp(null);
      }
      return;
    }
    
    // Cleanup previous messages listener before creating new one
    if (messagesUnsubscribeRef.current) {
      console.log('Cleaning up previous messages listener before creating new one');
      messagesUnsubscribeRef.current();
      messagesUnsubscribeRef.current = null;
    }

    console.log(`Setting up real-time message listener for conversation: ${selectedConversation.id}`);

    const messagesRef = ref(db, `conversations/${selectedConversation.id}/messages`);
    // Query for the most recent messages
    const messagesQuery = query(messagesRef, limitToLast(MESSAGES_PER_PAGE));

    const unsubscribe = onValue(
      messagesQuery,
      (snapshot) => {
        // Check if component is still mounted before updating state
        if (!isMountedRef.current) {
          console.log('Component unmounted, skipping message update');
          return;
        }
        
        const data = snapshot.val();
        if (!data) {
          console.log(`No messages found for conversation ${selectedConversation.id}`);
          if (isMountedRef.current) {
            setMessages([]);
            setHasMoreMessages(false);
            setOldestMessageTimestamp(null);
          }
          return;
        }
        
        // Convert object to array and sort by createdAt
        const msgs: LocalMessage[] = Object.keys(data).map((messageId) => {
          const messageData = data[messageId];
          return {
            id: messageId,
            senderId: messageData.senderId || '',
            receiverId: messageData.receiverId || '',
            text: messageData.text || '',
            createdAt: messageData.createdAt ? new Date(messageData.createdAt) : null,
            isRead: !!messageData.isRead,
            // Determine delivery status - fallback to 'read' if isRead, otherwise 'sent'
            deliveryStatus: messageData.deliveryStatus || (messageData.isRead ? 'read' : 'sent'),
          } as LocalMessage;
        }).sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeA - timeB; // Oldest first
        });
        
        console.log(`Received ${msgs.length} messages (limited to ${MESSAGES_PER_PAGE}) for conversation ${selectedConversation.id}`);
        
        if (isMountedRef.current) {
          setMessages(msgs);
          
          // Remove any pending messages that have been confirmed
          const updatedPending = new Map(pendingMessagesRef.current);
          let hasChanges = false;
          
          updatedPending.forEach((msg, tempId) => {
            // Check if this pending message now exists in confirmed messages
            const isConfirmed = msgs.some(m => {
              if (!m.text || !msg.text || !m.senderId || !msg.senderId) return false;
              if (m.text !== msg.text || m.senderId !== msg.senderId) return false;
              if (!m.createdAt || !msg.createdAt) return false;
              
              // Helper to safely get timestamp
              const getTime = (timestamp: Date | number): number => {
                return timestamp instanceof Date ? timestamp.getTime() : Number(timestamp);
              };
              
              return Math.abs(getTime(m.createdAt) - getTime(msg.createdAt)) < 5000;
            });
            
            if (isConfirmed) {
              updatedPending.delete(tempId);
              hasChanges = true;
            }
          });
          
          if (hasChanges) {
            pendingMessagesRef.current = updatedPending;
            setPendingMessages(new Map(updatedPending));
          }
          
          // For now, disable pagination (can be added later if needed)
          setHasMoreMessages(false);
          
          // Track the oldest message timestamp for pagination
          if (msgs.length > 0) {
            const oldestMsg = msgs[0];
            setOldestMessageTimestamp(oldestMsg.createdAt ? new Date(oldestMsg.createdAt).getTime() : null);
          }
        }

        // Mark unread messages addressed to current user as read and delivered
        Object.keys(data).forEach(async (messageId) => {
          const messageData = data[messageId];
          // Use string comparison for IDs
          if (String(messageData.receiverId) === String(currentUser?.user_id)) {
            try {
              const messageRef = ref(db, `conversations/${selectedConversation.id}/messages/${messageId}`);
              const updates: any = {};
              
              // Update delivery status to 'delivered' if not already delivered/read
              if (!messageData.deliveryStatus || messageData.deliveryStatus === 'sent') {
                updates.deliveryStatus = 'delivered';
              }
              
              // Mark as read if user is viewing the conversation
              if (!messageData.isRead) {
                updates.isRead = true;
                updates.deliveryStatus = 'read';
                updates.readAt = Date.now();
              }
              
              if (Object.keys(updates).length > 0) {
                await update(messageRef, updates);
                console.log(`📩 Updated message ${messageId} status:`, updates);
              }
            } catch (err) {
              // non-fatal
              console.error('Error updating message status:', err);
            }
          }
        });
      },
      (err) => {
        console.error('Message listener error:', err);
        if (isMountedRef.current) {
          showError("Unable to load messages for this conversation. Please try selecting it again.", 'error');
        }
      }
    );
    
    // Store unsubscribe function for cleanup
    messagesUnsubscribeRef.current = () => off(messagesRef, 'value', unsubscribe);

    return () => {
      console.log(`Cleaning up message listener for conversation: ${selectedConversation.id}`);
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
        messagesUnsubscribeRef.current = null;
      }
    };
  }, [selectedConversation?.id, db, currentUser?.user_id]);

  // Real-time listener for typing status
  useEffect(() => {
    if (!selectedConversation?.id || !db || !currentUser?.user_id) {
      if (isMountedRef.current) {
        setIsOtherUserTyping(false);
      }
      return;
    }

    const otherId = selectedConversation.participants.find(p => p !== currentUser.user_id);
    if (!otherId) {
      if (isMountedRef.current) {
        setIsOtherUserTyping(false);
      }
      return;
    }
    
    // Cleanup previous typing listener before creating new one
    if (typingUnsubscribeRef.current) {
      console.log('Cleaning up previous typing listener before creating new one');
      typingUnsubscribeRef.current();
      typingUnsubscribeRef.current = null;
    }

    const convRef = ref(db, `conversations/${selectedConversation.id}`);
    
    const unsubscribe = onValue(
      convRef,
      (snapshot) => {
        // Check if component is still mounted before updating state
        if (!isMountedRef.current) {
          console.log('Component unmounted, skipping typing status update');
          return;
        }
        
        const data = snapshot.val();
        if (!data) {
          if (isMountedRef.current) {
            setIsOtherUserTyping(false);
          }
          return;
        }

        // Check for typing status - support multiple formats
        let isTyping = false;
        if (data.typing && typeof data.typing === 'object') {
          isTyping = !!data.typing[otherId];
        } else if (typeof data.typing === 'string') {
          isTyping = data.typing === otherId;
        } else if (data.typingUserId && typeof data.typingUserId === 'string') {
          isTyping = data.typingUserId === otherId;
        }

        if (isMountedRef.current) {
          setIsOtherUserTyping(isTyping);
        }
      },
      (err) => {
        console.error('Typing status listener error:', err);
        if (isMountedRef.current) {
          setIsOtherUserTyping(false);
        }
      }
    );
    
    // Store unsubscribe function for cleanup
    typingUnsubscribeRef.current = () => off(convRef, 'value', unsubscribe);

    return () => {
      console.log(`Cleaning up typing listener for conversation: ${selectedConversation.id}`);
      if (typingUnsubscribeRef.current) {
        typingUnsubscribeRef.current();
        typingUnsubscribeRef.current = null;
      }
    };
  }, [selectedConversation?.id, selectedConversation?.participants, db, currentUser?.user_id]);

  // ---------------- LOAD MORE MESSAGES ----------------
  const loadMoreMessages = async () => {
    // Pagination with Realtime Database is handled differently
    // For now, we're loading the last N messages only
    // This can be enhanced with query cursors if needed
    console.log('Load more messages not yet implemented for Realtime Database');
    return;
  };

  // ---------------- HANDLERS ----------------


  const handleStartNewChat = async () => {
    // ensure modal state reset when starting a new chat
    setShowProfileModal(false);
    setProfileModalUser(null);
    setError(null);
    if (!currentUser) {
      setError("Please wait while loading user data");
      return;
    }

    const targetUserId = newChatUserId.trim();
    if (!targetUserId) return setError("Please enter a user ID.");
    if (targetUserId === currentUser.user_id) return setError("You cannot chat with yourself.");
    if (!db) return setError("Chat not available");

    try {
      const participants = [currentUser.user_id, targetUserId].sort();
      const chatId = participants.join('_');
      const chatRef = ref(db, `conversations/${chatId}`);
      const chatSnapshot = await get(chatRef);

      if (chatSnapshot.exists()) {
        const data = chatSnapshot.val();
        setSelectedConversation({
          id: chatId,
          participants: data.participants || [],
          participantDetails: data.participantDetails || {},
          createdAt: data.createdAt,
          lastMessage: data.lastMessage || '',
          lastMessageTime: data.lastMessageTime,
          lastSenderId: data.lastSenderId || '',
          hasUnread: data.lastSenderId && data.lastSenderId !== currentUser.user_id && data.lastMessage && !data.lastMessageRead
        });
        setNewChatUserId("");
        setShowNewChatModal(false);
        return;
      }

      const targetUserRef = ref(db, `users/${targetUserId}`);
      const targetUserSnapshot = await get(targetUserRef);
      let targetUserData: { email: string; firstName: string; profilePicture?: string } = { 
        email: 'Unknown', 
        firstName: `User ${targetUserId}`, 
        profilePicture: undefined 
      };
      if (targetUserSnapshot.exists()) {
        const data = targetUserSnapshot.val();
        targetUserData = {
          email: data.email || 'Unknown',
          firstName: data.firstName || data.first_name || `User ${targetUserId}`,
          profilePicture: data.profile_picture || data.profilePicture || undefined
        };
      }

      const participantDetails = {
        [currentUser.user_id]: { 
          email: currentUser.email, 
          firstName: currentUser.first_name,
          profilePicture: undefined
        },
        [targetUserId]: targetUserData
      };

      // Data for Realtime Database
      const rtdbData = {
        participants,
        participantDetails,
        createdAt: Date.now(),
        lastMessage: '',
        lastMessageTime: Date.now(),
        lastSenderId: ''
      };
      await set(chatRef, rtdbData);

      // Set local state
      setSelectedConversation({
        id: chatId,
        participants,
        participantDetails,
        lastMessage: '',
        lastSenderId: ''
      });
    } catch (err: any) {
      console.error("Error starting chat:", err);
      showError("Unable to start conversation. Please verify the user ID and try again.", 'error');
    }
  };

  // ---------------- TIME FORMATTER ----------------
  const formatTime = (timestamp?: number | null) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      if (diffMs < 0) return 'Just now';
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return '...';
    }
  };

  // ---------------- RENDER ----------------
  if (isLoading && !currentUser) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Loading Messages...</p>
      </div>
    );
  }

  if (error && !currentUser && showErrorToast) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#FEE2E2',
          border: '2px solid #EF4444',
          borderRadius: '12px',
          padding: '20px 30px',
          textAlign: 'left',
          maxWidth: '500px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>❌</span>
            <span style={{ fontWeight: 600, fontSize: '16px', color: '#991B1B' }}>Unable to Load Chat</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: '#7F1D1D', lineHeight: '1.5' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '12px',
              background: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------
  return (
    <>
      {/* Error Toast */}
      {showErrorToast && error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          minWidth: '320px',
          maxWidth: '500px',
          backgroundColor: errorType === 'error' ? '#FEE2E2' : errorType === 'warning' ? '#FEF3C7' : '#DBEAFE',
          border: `2px solid ${errorType === 'error' ? '#EF4444' : errorType === 'warning' ? '#F59E0B' : '#3B82F6'}`,
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {/* Icon */}
          <div style={{
            fontSize: '24px',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            {errorType === 'error' ? '❌' : errorType === 'warning' ? '⚠️' : 'ℹ️'}
          </div>
          
          {/* Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: 600,
              fontSize: '15px',
              color: errorType === 'error' ? '#991B1B' : errorType === 'warning' ? '#92400E' : '#1E40AF',
              marginBottom: '4px'
            }}>
              {errorType === 'error' ? 'Error' : errorType === 'warning' ? 'Warning' : 'Information'}
            </div>
            <div style={{
              fontSize: '14px',
              color: errorType === 'error' ? '#7F1D1D' : errorType === 'warning' ? '#78350F' : '#1E3A8A',
              lineHeight: '1.5'
            }}>
              {error}
            </div>
          </div>
          
          {/* Dismiss Button */}
          <button
            onClick={dismissError}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: errorType === 'error' ? '#991B1B' : errorType === 'warning' ? '#92400E' : '#1E40AF',
              padding: '0',
              lineHeight: '1',
              flexShrink: 0,
              marginTop: '2px'
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
      
    <div className="chat-shell">
      {/* LEFT SIDEBAR */}
      <div 
        className="chat-sidebar"
        style={{
          width: '340px',
          borderRight: '1px solid rgba(49,121,90,0.1)',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFFFFF',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
          borderRadius: '30px 0 0 30px'
        }}
      >
        {/* SIDEBAR HEADER */}
        <div style={{ 
          padding: '1.25rem', 
          background: '#244034',
          borderRadius: '30px 0 0 0'
        }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ 
              margin: 0, 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '1.25rem',
              fontFamily: 'var(--gorditas-font), inherit'
            }}>
              Messages
            </h3>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: 'rgba(255,255,255,0.75)', 
              fontSize: '0.85rem' 
            }}>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="chat-search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.15)',
                fontSize: '0.9rem',
                color: 'white',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
            <MessageCircle 
              style={{ 
                position: 'absolute', 
                left: '0.9rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '18px', 
                height: '18px', 
                color: 'rgba(255,255,255,0.7)' 
              }} 
            />
            <button
              onClick={() => setShowNewChatModal(true)}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#D2F34C',
                border: 'none',
                color: '#244034',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              aria-label="New Chat"
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* CONVERSATIONS LIST */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, background: '#FFFFFF' }}>
          {isLoading && conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #E9F7EF', 
                borderTopColor: '#31795A', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p>Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#244034',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '2px solid #31795A20'
              }}>
                <MessageCircle style={{ width: '36px', height: '36px', color: '#31795A' }} />
              </div>
              <p style={{ fontSize: '15px', margin: 0, fontWeight: 500, color: '#244034' }}>No conversations yet</p>
              <p style={{ fontSize: '13px', margin: '0.5rem 0 0 0', color: '#9CA3AF' }}>Start a new chat to begin messaging</p>
            </div>
          ) : (() => {
            // Filter conversations based on search query
            const filteredConversations = searchQuery.trim() 
              ? conversations.filter(convo => {
                  const clientId = convo.participants.find(p => p !== currentUser?.user_id);
                  const clientProfile = clientId ? clientProfiles.get(clientId) : null;
                  const fallbackDetails = clientId ? convo.participantDetails?.[clientId] : null;
                  
                  let displayName = '';
                  if (clientProfile) {
                    displayName = `${clientProfile.first_name} ${clientProfile.last_name || ''}`.trim();
                  } else if (fallbackDetails) {
                    displayName = fallbackDetails.firstName || fallbackDetails.email?.split('@')[0] || '';
                  }
                  
                  const query = searchQuery.toLowerCase();
                  return displayName.toLowerCase().includes(query) || 
                         (convo.lastMessage || '').toLowerCase().includes(query);
                })
              : conversations;
            
            if (filteredConversations.length === 0 && searchQuery.trim()) {
              return (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
                  <p style={{ fontSize: '14px', margin: 0 }}>No matching conversations</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#31795A',
                      cursor: 'pointer',
                      fontSize: '13px',
                      marginTop: '0.5rem',
                      textDecoration: 'underline'
                    }}
                  >
                    Clear search
                  </button>
                </div>
              );
            }
            
            return filteredConversations.map(convo => {
            const clientId = convo.participants.find(p => p !== currentUser?.user_id);
            const clientProfile = clientId ? clientProfiles.get(clientId) : null;
            const isLoadingProfile = clientId ? loadingProfiles.has(clientId) : false;
            const isSelected = selectedConversation?.id === convo.id;
            
            // Fallback to Firebase participant details if profile not loaded
            const fallbackDetails = clientId ? convo.participantDetails?.[clientId] : null;
            
            // Debug log to see what data we have
            if (clientId && !clientProfile) {
              console.log(`Conversation ${convo.id} participant details:`, {
                clientId,
                participantDetails: convo.participantDetails,
                fallbackDetails
              });
            }
            
            // Determine display name with multiple fallbacks. Treat generic placeholders like "User name" as invalid.
            let displayName = 'Unknown User';
            if (clientProfile) {
              displayName = `${clientProfile.first_name}${clientProfile.last_name ? ' ' + clientProfile.last_name : ''}`;
            } else if (fallbackDetails) {
              // Try different possible field names, but ignore placeholder values
              const fbFirst = (fallbackDetails.firstName || (fallbackDetails as any).first_name || '').toString().trim();
              const isInvalidPlaceholder = !fbFirst || /^user\s*name$/i.test(fbFirst) || /^user\s*\d+$/i.test(fbFirst);
              if (!isInvalidPlaceholder) {
                displayName = fbFirst;
              } else if (fallbackDetails.email) {
                displayName = fallbackDetails.email.split('@')[0];
              } else {
                displayName = 'Client';
              }
            }
            
            const displayInitial = displayName.charAt(0).toUpperCase();
            // Use profile picture from API or fallback to Firebase participantDetails
            const profilePicture = clientProfile?.profile_picture || fallbackDetails?.profilePicture;

            return (
              <div
                key={convo.id}
                onClick={() => setSelectedConversation(convo)}
                style={{
                  padding: '1rem 1.25rem',
                  background: isSelected ? '#E9F7EF' : '#FFFFFF',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F0F5F3',
                  transition: 'all 0.2s ease',
                  borderLeft: isSelected ? '4px solid #31795A' : '4px solid transparent'
                }}
                onMouseOver={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#F8FBF9';
                }}
                onMouseOut={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  {/* Profile Picture or Avatar */}
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: profilePicture ? 'transparent' : '#244034', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    fontSize: '20px',
                    fontWeight: 600,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(36,64,52,0.15)',
                    transition: 'transform 0.2s ease'
                  }}>
                    {isLoadingProfile ? (
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid rgba(255,255,255,0.3)', 
                        borderTopColor: 'white', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                      }} />
                    ) : profilePicture ? (
                      <AuthenticatedImage
                        src={profilePicture} 
                        alt={displayName}
                        width={48}
                        height={48}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                        unoptimized
                        fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23244034'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='white' font-weight='600'%3E{displayInitial}%3C/text%3E%3C/svg%3E"
                      />
                    ) : (
                      displayInitial
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontWeight: 600, 
                      fontSize: '0.95rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#244034'
                    }}>
                      {displayName}
                    </h3>
                    <p style={{ 
                      margin: '3px 0 0 0', 
                      color: '#6B7280', 
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {convo.lastMessage || 'No messages yet'}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      {formatTime(convo.updatedAt || convo.lastMessageTime)}
                    </span>
                  </div>
                  {convo.hasUnread && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#244034',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(49,121,90,0.3)'
                    }} />
                  )}
                </div>
              </div>
            );
          })})()}
        </div>
      </div>

      {/* RIGHT CHAT PANEL */}
      <div 
        className={`chat-main ${selectedConversation ? 'active' : ''}`}
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: 0, 
          overflow: 'hidden', 
          background: 'linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%)',
          borderRadius: '0 30px 30px 0'
        }}
      >
        {selectedConversation ? (
          <>
            {/* Header */}
            <ChatHeader
              currentUserId={currentUser?.user_id}
              conversation={selectedConversation}
              onViewProfile={(user) => { setProfileModalUser(user); setShowProfileModal(true); }}
              onBack={() => setSelectedConversation(null)}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
              {/* header placeholder (handled by ChatHeader) */}

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                <ChatBody 
                  messages={messages} 
                  currentUserId={String(currentUser?.user_id)} 
                  isOtherUserTyping={isOtherUserTyping}
                  hasMoreMessages={hasMoreMessages}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={loadMoreMessages}
                  pendingMessages={Array.from(pendingMessages.values())}
                  isOnline={isOnline}
                  isConnected={isConnected}
                />
                <ChatInput
                  conversationId={selectedConversation?.id}
                  currentUserId={String(currentUser?.user_id)}
                  onSend={async (text) => {
                    if (!selectedConversation || !currentUser) return showError('Please select a conversation first', 'warning');
                    if (!db) return showError('Chat service is temporarily unavailable', 'error');
                    
                    const senderId = String(currentUser.user_id);
                    const otherId = selectedConversation.participants.find(p => p !== currentUser.user_id) as string | undefined;
                    if (!otherId) return showError('Unable to identify the recipient. Please try selecting the conversation again.', 'error');

                    const trimmed = text.trim();
                    if (!trimmed) return;

                    // Generate temporary ID for optimistic update
                    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    
                    // Create optimistic message
                    const optimisticMessage: LocalMessage = {
                      id: tempId,
                      senderId,
                      receiverId: otherId,
                      text: trimmed,
                      createdAt: new Date(),
                      isRead: false,
                      deliveryStatus: 'sent',
                    };
                    
                    // Add to pending messages immediately (optimistic UI)
                    pendingMessagesRef.current.set(tempId, optimisticMessage);
                    if (isMountedRef.current) {
                      setPendingMessages(new Map(pendingMessagesRef.current));
                    }

                    try {
                      // Write message to Realtime Database
                      const messagesRef = ref(db, `conversations/${selectedConversation.id}/messages`);
                      const newMessageRef = push(messagesRef);
                      await set(newMessageRef, {
                        senderId,
                        receiverId: otherId,
                        text: trimmed,
                        createdAt: Date.now(),
                        isRead: false,
                        deliveryStatus: 'sent',
                      });

                      // Update conversation metadata
                      const conversationRef = ref(db, `conversations/${selectedConversation.id}`);
                      await update(conversationRef, {
                        lastMessage: trimmed,
                        updatedAt: Date.now(),
                        lastSenderId: senderId,
                        lastMessageRead: true, // Mark as read since user just participated
                      });

                      console.log('✅ Message sent successfully:', newMessageRef.key);
                      
                      // Remove from pending messages after successful send
                      setTimeout(() => {
                        pendingMessagesRef.current.delete(tempId);
                        if (isMountedRef.current) {
                          setPendingMessages(new Map(pendingMessagesRef.current));
                        }
                      }, 500); // Small delay to allow Realtime Database listener to confirm
                      
                    } catch (err: any) {
                      console.error('❌ Send message failed:', err);
                      
                      // Mark message as failed but keep it visible
                      const failedMessage = { ...optimisticMessage, failed: true };
                      pendingMessagesRef.current.set(tempId, failedMessage);
                      if (isMountedRef.current) {
                        setPendingMessages(new Map(pendingMessagesRef.current));
                        showError(
                          isOnline 
                            ? "Message failed to send. Retrying automatically..." 
                            : "You're offline. Message will be sent when connection is restored.",
                          'warning'
                        );
                      }
                      
                      // Auto-retry after 2 seconds if online
                      if (isOnline && isConnected) {
                        setTimeout(async () => {
                          try {
                            const messagesRef = ref(db, `conversations/${selectedConversation.id}/messages`);
                            const newMessageRef = push(messagesRef);
                            await set(newMessageRef, {
                              senderId,
                              receiverId: otherId,
                              text: trimmed,
                              createdAt: Date.now(),
                              isRead: false,
                              deliveryStatus: 'sent',
                            });
                            
                            const conversationRef = ref(db, `conversations/${selectedConversation.id}`);
                            await update(conversationRef, {
                              lastMessage: trimmed,
                              updatedAt: Date.now(),
                              lastSenderId: senderId,
                              lastMessageRead: true, // Mark as read since user just participated
                            });
                            
                            console.log('✅ Message retry successful');
                            pendingMessagesRef.current.delete(tempId);
                            if (isMountedRef.current) {
                              setPendingMessages(new Map(pendingMessagesRef.current));
                            }
                          } catch (retryErr) {
                            console.error('❌ Message retry failed:', retryErr);
                          }
                        }, 2000);
                      }
                    }
                  }}
                  disabled={!selectedConversation}
                />
              </div>
            </div>
          </>
        ) : (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%)',
            borderRadius: '0 30px 30px 0'
          }}>
            <div style={{ 
              textAlign: 'center', 
              maxWidth: 480, 
              padding: '32px',
              background: '#FFFFFF',
              borderRadius: '30px',
              boxShadow: '0 10px 40px rgba(36,64,52,0.08)',
              border: '1px solid rgba(49,121,90,0.1)'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#244034',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                border: '2px solid #31795A20'
              }}>
                <MessageCircle style={{ width: '48px', height: '48px', color: '#31795A', strokeWidth: 1.5 }} />
              </div>
              <h2 style={{ 
                marginTop: 0, 
                marginBottom: 8, 
                color: '#244034', 
                fontWeight: 600,
                fontFamily: 'var(--eb_garamond-font), serif',
                fontSize: '1.75rem'
              }}>
                Welcome to Messages
              </h2>
              <p style={{ 
                margin: '0 0 1.5rem 0', 
                color: '#6B7280',
                lineHeight: 1.6
              }}>
                Select a conversation from the sidebar to start chatting, or begin a new conversation.
              </p>
              <button
                onClick={() => setShowNewChatModal(true)}
                style={{
                  background: '#244034',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(36,64,52,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(36,64,52,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(36,64,52,0.2)';
                }}
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NEW CHAT MODAL */}
      {showNewChatModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(36,64,52,0.6)', 
          backdropFilter: 'blur(4px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '30px', 
            width: '90%', 
            maxWidth: '420px',
            boxShadow: '0 20px 60px rgba(36,64,52,0.2)'
          }}>
            <h3 style={{ 
              margin: '0 0 0.5rem 0',
              color: '#244034',
              fontFamily: 'var(--eb_garamond-font), serif',
              fontSize: '1.5rem'
            }}>
              Start New Chat
            </h3>
            <p style={{ 
              margin: '0 0 1.5rem 0',
              color: '#6B7280',
              fontSize: '0.9rem'
            }}>
              Enter the user ID to start a conversation
            </p>
            <input
              type="text"
              value={newChatUserId}
              onChange={(e) => setNewChatUserId(e.target.value)}
              placeholder="Enter User ID"
              style={{ 
                width: '100%', 
                padding: '0.875rem 1rem', 
                border: '2px solid #E9F7EF', 
                borderRadius: '15px', 
                marginBottom: '1rem',
                fontSize: '0.95rem',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#31795A'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E9F7EF'}
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => { setShowNewChatModal(false); dismissError(); }}
                style={{ 
                  flex: 1, 
                  background: '#F0F5F3', 
                  border: 'none', 
                  borderRadius: '15px', 
                  padding: '0.875rem',
                  color: '#244034',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#E9F7EF'}
                onMouseOut={(e) => e.currentTarget.style.background = '#F0F5F3'}
              >
                Cancel
              </button>
              <button
                onClick={handleStartNewChat}
                disabled={!newChatUserId.trim()}
                style={{
                  flex: 1,
                  background: newChatUserId.trim() 
                    ? '#244034' 
                    : '#D1D5DB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  padding: '0.875rem',
                  fontWeight: 600,
                  cursor: newChatUserId.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: newChatUserId.trim() ? '0 4px 14px rgba(36,64,52,0.2)' : 'none'
                }}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE DETAILS MODAL */}
      {profileModalUser && (
        <ProfileDetailsModal
          open={showProfileModal}
          userData={profileModalUser}
          onClose={() => { setShowProfileModal(false); setProfileModalUser(null); }}
        />
      )}
    </div>
    </>
  );
};

export default ChatArea;
