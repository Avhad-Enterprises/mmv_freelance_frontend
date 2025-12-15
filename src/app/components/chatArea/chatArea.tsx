'use client'
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc, collection, query, where,
  onSnapshot, serverTimestamp, orderBy, limit, Timestamp, addDoc, Firestore
} from "firebase/firestore";
import { getAuth, signInAnonymously, Auth } from "firebase/auth";
import { Search, Send, Plus, MessageCircle, Check, CheckCheck } from 'lucide-react';
import Conversation from '@/app/components/conversation/Conversation';
import Cookies from 'js-cookie';

// ---------------- CONFIG ----------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ---------------- TYPES ----------------
interface Conversation {
  id: string;
  participants: string[];
  participantDetails: { [userId: string]: { email: string; firstName: string; } };
  createdAt?: Timestamp;
  lastMessage?: string;
  lastMessageTime?: Timestamp;
  lastSenderId?: string;
  hasUnread?: boolean;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp?: Timestamp;
  read: boolean;
}

interface UserData {
  user_id: string;
  first_name: string;
  email: string;
}

interface FirebaseInstances {
  db: Firestore | undefined;
  auth: Auth | undefined;
}

// ---------------- COMPONENT ----------------
const ChatArea: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newChatUserId, setNewChatUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [firebaseInstances, setFirebaseInstances] = useState<FirebaseInstances>({ db: undefined, auth: undefined });

  // ---------------- FIREBASE INIT ----------------
  useEffect(() => {
    const authenticateFirebase = async () => {
      if (typeof window === 'undefined') return;

      const isValidConfig = Object.values(firebaseConfig).every(value => value);
      if (!isValidConfig) {
        console.error("Firebase configuration is incomplete.");
        setError("Firebase configuration is incomplete.");
        setIsLoading(false);
        return;
      }

      try {
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
        const auth = getAuth(app);
        const db = getFirestore(app);

        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
        setFirebaseInstances({ db, auth });
      } catch (err: any) {
        console.error("Firebase auth error:", err);
        setError(`Firebase authentication failed: ${err.message}`);
        setIsLoading(false);
      }
    };
    authenticateFirebase();
  }, []);

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const { db } = firebaseInstances;
    if (!db) return;

    const fetchUserData = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          setError("Please log in to use the chat");
          setIsLoading(false);
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
          setCurrentUser(userData);

          await setDoc(doc(db, 'users', userData.user_id), {
            email: userData.email,
            firstName: userData.first_name,
            userId: userData.user_id,
            lastActive: serverTimestamp()
          }, { merge: true });
        } else throw new Error('User data not found');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError("Could not load user data. Please refresh.");
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [firebaseInstances]);

  // ---------------- SUBSCRIBE TO CONVERSATIONS ----------------
  useEffect(() => {
    const { db } = firebaseInstances;
    if (!currentUser?.user_id || !db) return;

    setIsLoading(true);
    const q = query(
      collection(db, 'conversations'),
      where("participants", "array-contains", currentUser.user_id),
      orderBy("lastMessageTime", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convos = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        const isLastMessageFromOther = data.lastSenderId && data.lastSenderId !== currentUser.user_id;
        return {
          id: docSnap.id,
          participants: data.participants || [],
          participantDetails: data.participantDetails || {},
          lastMessage: data.lastMessage || '',
          lastMessageTime: data.lastMessageTime,
          lastSenderId: data.lastSenderId || '',
          createdAt: data.createdAt,
          hasUnread: isLastMessageFromOther && data.lastMessage && !data.lastMessageRead
        } as Conversation;
      });
      setConversations(convos);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching conversations:", err);
      setError(`Could not load conversations: ${err.message}`);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, firebaseInstances]);





  // ---------------- HANDLERS ----------------


  const handleStartNewChat = async () => {
    const { db } = firebaseInstances;
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
      const chatRef = doc(db, 'conversations', chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const data = chatDoc.data();
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

      const targetUserDoc = await getDoc(doc(db, 'users', targetUserId));
      let targetUserData = { email: 'Unknown', firstName: `User ${targetUserId}` };
      if (targetUserDoc.exists()) {
        targetUserData = {
          email: targetUserDoc.data().email || 'Unknown',
          firstName: targetUserDoc.data().firstName || `User ${targetUserId}`
        };
      }

      const conversationData = {
        participants,
        participantDetails: {
          [currentUser.user_id]: { email: currentUser.email, firstName: currentUser.first_name },
          [targetUserId]: targetUserData
        },
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        lastSenderId: ''
      };
      await setDoc(chatRef, conversationData);

      setSelectedConversation({
        id: chatId,
        ...conversationData,
        createdAt: Timestamp.now(),
        lastMessageTime: Timestamp.now()
      });
      setNewChatUserId("");
      setShowNewChatModal(false);
    } catch (err: any) {
      console.error("Error starting chat:", err);
      setError(`Could not start conversation: ${err.message}`);
    }
  };

  // ---------------- TIME FORMATTER ----------------
  const formatTime = (timestamp?: Timestamp | null) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return '';
    try {
      const date = timestamp.toDate();
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

  if (error && !currentUser) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------
  return (
    <div className="chat-area-container" style={{ background: '#EFF6F3', minHeight: '600px', borderRadius: '12px', overflow: 'hidden' }}>
      {/* LEFT SIDEBAR */}
      <div className="left-sidebar" style={{ width: '100%', maxWidth: '24rem', background: 'white', borderRight: '1px solid #E5E7EB' }}>
        <div style={{ background: '#244034', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#D2F34C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#244034', fontWeight: 700 }}>
                {currentUser?.first_name.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h2 style={{ color: 'white', fontWeight: 600, margin: 0 }}>{currentUser?.first_name || 'Loading...'}</h2>
              <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0 }}>ID: {currentUser?.user_id}</p>
            </div>
          </div>
          <button onClick={() => setShowNewChatModal(true)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <Plus style={{ color: 'white' }} />
          </button>
        </div>

        <div className="conversations-list" style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map(convo => {
            const otherUserId = convo.participants.find(p => p !== currentUser?.user_id);
            const otherUserDetails = otherUserId ? convo.participantDetails[otherUserId] : null;
            const isSelected = selectedConversation?.id === convo.id;
            return (
              <div
                key={convo.id}
                onClick={() => setSelectedConversation(convo)}
                style={{
                  padding: '1rem',
                  background: isSelected ? '#EFF6F3' : 'white',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F3F4F6'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#244034', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {otherUserDetails?.firstName.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontWeight: 600 }}>{otherUserDetails?.firstName || 'Unknown User'}</h3>
                    <p style={{ margin: 0, color: '#6B7280' }}>{convo.lastMessage || 'No messages yet'}</p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{formatTime(convo.lastMessageTime)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT CHAT PANEL */}
      <div className="right-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', background: 'white' }}>
              <h3 style={{ margin: 0 }}>
                {(() => {
                  const otherUserId = selectedConversation.participants.find(p => p !== currentUser?.user_id);
                  const otherUserDetails = otherUserId ? selectedConversation.participantDetails[otherUserId] : null;
                  return otherUserDetails?.firstName || 'Chat';
                })()}
              </h3>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', background: 'white' }}>
                <h3 style={{ margin: 0 }}>
                  {(() => {
                    const otherUserId = selectedConversation.participants.find(p => p !== currentUser?.user_id);
                    const otherUserDetails = otherUserId ? selectedConversation.participantDetails[otherUserId] : null;
                    return otherUserDetails?.firstName || 'Chat';
                  })()}
                </h3>
              </div>

              <div style={{ flex: 1 }}>
                {/* Conversation component handles realtime messages + sending */}
                {currentUser?.user_id && <Conversation conversationId={selectedConversation.id} currentUserId={String(currentUser.user_id)} />}
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <MessageCircle style={{ width: '64px', height: '64px', color: '#D1D5DB' }} />
              <h2>Welcome to Messages</h2>
              <p>Select a conversation to start chatting</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                style={{ background: '#244034', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NEW CHAT MODAL */}
      {showNewChatModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
            <h3>Start New Chat</h3>
            <input
              type="text"
              value={newChatUserId}
              onChange={(e) => setNewChatUserId(e.target.value)}
              placeholder="Enter User ID"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '1rem' }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => { setShowNewChatModal(false); setError(null); }}
                style={{ flex: 1, background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.75rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleStartNewChat}
                disabled={!newChatUserId.trim()}
                style={{
                  flex: 1,
                  background: newChatUserId.trim() ? '#244034' : '#D1D5DB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem'
                }}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
