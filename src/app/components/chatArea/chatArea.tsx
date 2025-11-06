'use client'
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, query, where, onSnapshot, serverTimestamp, orderBy, limit, Timestamp, addDoc, Firestore } from "firebase/firestore";
import { getAuth, signInAnonymously, Auth } from "firebase/auth";
import { Search, Send, Plus, MessageCircle, Check, CheckCheck, AlertCircle } from 'lucide-react';
import { useSidebar } from "@/context/SidebarContext";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | undefined;
let firestoreDb: Firestore | undefined;
let firebaseAuth: Auth | undefined;

if (typeof window !== 'undefined') {
    const isValidConfig = Object.values(firebaseConfig).every(value => value);
    if (!isValidConfig) {
        console.error("Firebase configuration is incomplete.");
    } else {
        firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
        firestoreDb = getFirestore(firebaseApp);
        firebaseAuth = getAuth(firebaseApp);
    }
}

interface Conversation {
    id: string;
    participants: string[];
    participantDetails: { [userId: string]: { email: string; firstName: string; } };
    createdAt: Timestamp;
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
    timestamp: Timestamp;
    read: boolean;
}

interface ChatAreaProps {
    setIsOpenSidebar?: (isOpen: boolean) => void;
}

interface UserData {
    user_id: string;
    first_name: string;
    email: string;
    userType?: 'CLIENT' | 'VIDEOGRAPHER' | 'VIDEO_EDITOR' | 'ADMIN';
}

interface ChatRestriction {
    targetUserId: string;
    applicationStatus: number;
    projectId: number;
    projectTitle: string;
    isPending: boolean;
    maxMessages: number;
    userRole: 'client' | 'freelancer';
}

const ChatArea: React.FC<ChatAreaProps> = ({ setIsOpenSidebar }) => {
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [newChatUserId, setNewChatUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [firebaseReady, setFirebaseReady] = useState<boolean>(false);
    const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
    const [chatRestriction, setChatRestriction] = useState<ChatRestriction | null>(null);
    const [messageLimitReached, setMessageLimitReached] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Check for chat restrictions from ongoing jobs
    useEffect(() => {
        const restrictionData = sessionStorage.getItem('chatRestriction');
        if (restrictionData) {
            try {
                const restriction: ChatRestriction = JSON.parse(restrictionData);
                // Set the userRole based on the current user's type
                restriction.userRole = currentUser?.userType === 'CLIENT' ? 'client' : 'freelancer';
                setChatRestriction(restriction);
                // Pre-fill the new chat modal with target user
                setNewChatUserId(restriction.targetUserId);
                setShowNewChatModal(true);
                // Clear after use
                sessionStorage.removeItem('chatRestriction');
            } catch (e) {
                console.error('Failed to parse chat restriction:', e);
            }
        }
    }, [currentUser?.userType]);

    useEffect(() => {
        const authenticateFirebase = async () => {
            if (!firebaseAuth) {
                setError("Firebase authentication not available");
                setIsLoading(false);
                return;
            }
            try {
                if (!firebaseAuth.currentUser) {
                    await signInAnonymously(firebaseAuth);
                }
                setFirebaseReady(true);
            } catch (err: any) {
                console.error("Firebase auth error:", err);
                setError(`Firebase authentication failed: ${err.message}`);
                setIsLoading(false);
            }
        };
        authenticateFirebase();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!firebaseReady) return;
            try {
                const cookieString = typeof document !== 'undefined' ? document.cookie : '';
            const tokenMatch = cookieString.split('; ').find(row => row.startsWith('auth_token='));
            const token = tokenMatch ? tokenMatch.split('=')[1] : null;
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
                        email: data.data.user.email,
                        userType: data.data.user.userType || (data.data.user.roles?.includes('CLIENT') ? 'CLIENT' : 'VIDEOGRAPHER')
                    };
                    setCurrentUser(userData);
                    if (firestoreDb) {
                        await setDoc(doc(firestoreDb, 'users', userData.user_id), {
                            email: userData.email,
                            firstName: userData.first_name,
                            userId: userData.user_id,
                            lastActive: serverTimestamp()
                        }, { merge: true });
                    }
                } else throw new Error('User data not found');
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError("Could not load user data. Please refresh.");
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [firebaseReady]);

    useEffect(() => {
        if (!firestoreDb) {
            setError("Chat not available - Firebase not initialized");
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!currentUser?.user_id || !firestoreDb) return;
        const q = query(collection(firestoreDb, 'conversations'), where("participants", "array-contains", currentUser.user_id), orderBy("lastMessageTime", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const convos = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const isLastMessageFromOther = data.lastSenderId && data.lastSenderId !== currentUser.user_id;
                return { 
                    id: doc.id, 
                    participants: data.participants || [], 
                    participantDetails: data.participantDetails || {}, 
                    lastMessage: data.lastMessage || '', 
                    lastMessageTime: data.lastMessageTime || serverTimestamp(), 
                    lastSenderId: data.lastSenderId || '', 
                    createdAt: data.createdAt || serverTimestamp(),
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
    }, [currentUser]);

    useEffect(() => {
        if (!selectedConversation || !firestoreDb || !currentUser) {
            setMessages([]);
            setMessageLimitReached(false);
            return;
        }

        // First, check total message count if there's a restriction
        const checkMessageLimit = async () => {
            if (chatRestriction && chatRestriction.maxMessages > 0 && firestoreDb) {
                const messagesQuery = query(
                    collection(firestoreDb, `conversations/${selectedConversation.id}/messages`),
                    where("senderId", "==", currentUser.user_id)
                );
                const snapshot = await getDocs(messagesQuery);
                const totalMessages = snapshot.size;
                
                if (totalMessages >= chatRestriction.maxMessages) {
                    setMessageLimitReached(true);
                } else {
                    setMessageLimitReached(false);
                }
            }
        };
        checkMessageLimit();

        // Then set up the regular messages listener
        const q = query(collection(firestoreDb, `conversations/${selectedConversation.id}/messages`), orderBy("timestamp", "asc"), limit(100));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const msg = { id: doc.id, text: data.text || '', senderId: data.senderId || '', receiverId: data.receiverId || '', timestamp: data.timestamp || serverTimestamp(), read: data.read || false } as Message;
                
                if (!msg.read && msg.receiverId === currentUser.user_id) {
                    setDoc(doc.ref, { read: true }, { merge: true });
                }
                return msg;
            });
            setMessages(msgs);
            
            if (selectedConversation.lastSenderId !== currentUser.user_id) {
                setDoc(doc(firestoreDb!, "conversations", selectedConversation.id), {
                    lastMessageRead: true
                }, { merge: true });
            }
        }, (err) => {
            console.error("Error fetching messages:", err);
            setError(`Could not load messages: ${err.message}`);
        });
        return () => unsubscribe();
    }, [selectedConversation, currentUser, chatRestriction]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!selectedConversation || !newMessage.trim() || !firestoreDb || !currentUser) return;
        
        // Check message limit before sending
        if (messageLimitReached) {
            setError("Message limit reached. Your application must be approved by the client to continue chatting.");
            return;
        }
        
        const otherUserId = selectedConversation.participants.find(p => p !== currentUser.user_id);
        if (!otherUserId) return;
        
        // Double check message limit from Firestore
        if (chatRestriction && chatRestriction.maxMessages > 0) {
            try {
                const messagesQuery = query(
                    collection(firestoreDb, `conversations/${selectedConversation.id}/messages`),
                    where("senderId", "==", currentUser.user_id)
                );
                const snapshot = await getDocs(messagesQuery);
                const totalMessages = snapshot.size;
                
                if (totalMessages >= chatRestriction.maxMessages) {
                    setMessageLimitReached(true);
                    setError("Message limit reached. Your application must be approved by the client to continue chatting.");
                    return;
                }
            } catch (err) {
                console.error("Error checking message limit:", err);
                setError("Unable to verify message limit. Please try again.");
                return;
            }
        }
        
        try {
            await addDoc(collection(firestoreDb, `conversations/${selectedConversation.id}/messages`), {
                text: newMessage.trim(),
                senderId: currentUser.user_id,
                receiverId: otherUserId,
                timestamp: serverTimestamp(),
                read: false
            });
            await setDoc(doc(firestoreDb, "conversations", selectedConversation.id), {
                lastMessage: newMessage.trim(),
                lastMessageTime: serverTimestamp(),
                lastSenderId: currentUser.user_id,
                lastMessageRead: false
            }, { merge: true });
            setNewMessage("");
            setError(null);
        } catch (err: any) {
            console.error("Error sending message:", err);
            setError(`Failed to send: ${err.message}`);
        }
    };

    const handleStartNewChat = async () => {
        setError(null);
        if (!currentUser) {
            setError("Please wait while loading user data");
            return;
        }
        const targetUserId = newChatUserId.trim();
        if (targetUserId === "") {
            setError("Please enter a user ID.");
            return;
        }
        if (targetUserId === currentUser.user_id) {
            setError("You cannot chat with yourself.");
            return;
        }
        if (!firestoreDb) {
            setError("Chat not available");
            return;
        }
        try {
            const participants = [currentUser.user_id, targetUserId].sort();
            const chatId = participants.join('_');
            const chatRef = doc(firestoreDb, 'conversations', chatId);
            const chatDoc = await getDoc(chatRef);
            if (chatDoc.exists()) {
                setSelectedConversation({ id: chatId, participants: chatDoc.data().participants, participantDetails: chatDoc.data().participantDetails, createdAt: chatDoc.data().createdAt, lastMessage: chatDoc.data().lastMessage, lastMessageTime: chatDoc.data().lastMessageTime, lastSenderId: chatDoc.data().lastSenderId });
                setNewChatUserId("");
                setShowNewChatModal(false);
                return;
            }
            const targetUserDoc = await getDoc(doc(firestoreDb, 'users', targetUserId));
            let targetUserData = { email: 'Unknown', firstName: `User ${targetUserId}` };
            if (targetUserDoc.exists()) {
                targetUserData = { email: targetUserDoc.data().email || 'Unknown', firstName: targetUserDoc.data().firstName || `User ${targetUserId}` };
            }
                const conversationData = {
                participants,
                participantDetails: {
                    [currentUser.user_id]: { 
                        email: currentUser.email, 
                        firstName: currentUser.first_name,
                        userType: currentUser.userType
                    },
                    [targetUserId]: {
                        ...targetUserData,
                        userType: targetUserDoc.exists() ? targetUserDoc.data().userType : undefined
                    }
                },
                createdAt: serverTimestamp(),
                lastMessage: '',
                lastMessageTime: serverTimestamp(),
                lastSenderId: ''
            };
            await setDoc(chatRef, conversationData);
            setSelectedConversation({ id: chatId, ...conversationData, createdAt: Timestamp.now(), lastMessageTime: Timestamp.now() });
            setNewChatUserId("");
            setShowNewChatModal(false);
        } catch (err: any) {
            console.error("Error starting chat:", err);
            setError(`Could not start conversation: ${err.message}`);
        }
    };

    const formatTime = (timestamp: Timestamp | undefined) => {
        if (!timestamp) return '';
        if (!(timestamp instanceof Timestamp) || !timestamp.toDate) return 'Just now';
        
        try {
            const date = timestamp.toDate();
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString();
        } catch (error) {
            return 'Just now';
        }
    };

    const getMessagesRemaining = async () => {
        if (!chatRestriction || chatRestriction.maxMessages <= 0 || !firestoreDb || !currentUser || !selectedConversation) return null;
        
        try {
            const messagesQuery = query(
                collection(firestoreDb, `conversations/${selectedConversation.id}/messages`),
                where("senderId", "==", currentUser.user_id)
            );
            const snapshot = await getDocs(messagesQuery);
            const totalMessages = snapshot.size;
            return chatRestriction.maxMessages - totalMessages;
        } catch (err) {
            console.error("Error getting messages remaining:", err);
            return null;
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', background: '#EFF6F3', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <div>
                    <MessageCircle style={{ width: '64px', height: '64px', margin: '0 auto 1rem', color: '#244034', opacity: 0.5 }} />
                    <p style={{ color: '#666', fontWeight: 500 }}>Loading Messages...</p>
                </div>
            </div>
        );
    }

    if (error && !currentUser) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '1.5rem', maxWidth: '28rem' }}>
                    <p style={{ color: '#B91C1C', fontWeight: 500 }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', background: '#EFF6F3', minHeight: '600px', height: 'calc(100vh - 200px)', maxHeight: '800px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            {/* Left Sidebar */}
            <div style={{ width: '100%', maxWidth: '24rem', background: 'white', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: '#244034', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#D2F34C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#244034', fontWeight: 700, fontSize: '1.125rem' }}>
                                {currentUser?.first_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 style={{ color: 'white', fontWeight: 600, margin: 0, fontSize: '1rem' }}>{currentUser?.first_name}</h2>
                            <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0 }}>ID: {currentUser?.user_id}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowNewChatModal(true)} style={{ padding: '0.5rem', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#31795A'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <Plus style={{ width: '24px', height: '24px', color: 'white' }} />
                    </button>
                </div>

                <div style={{ padding: '0.75rem', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ width: '20px', height: '20px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Search conversations..." style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '0.875rem', outline: 'none' }} />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
                            <MessageCircle style={{ width: '64px', height: '64px', color: '#D1D5DB', marginBottom: '1rem' }} />
                            <h3 style={{ color: '#4B5563', fontWeight: 500, marginBottom: '0.5rem' }}>No conversations yet</h3>
                            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>Start a new chat to get connected</p>
                        </div>
                    ) : (
                        conversations.map(convo => {
                            const otherUserId = convo.participants.find(p => p !== currentUser?.user_id);
                            const otherUserDetails = otherUserId ? convo.participantDetails[otherUserId] : null;
                            const isSelected = selectedConversation?.id === convo.id;
                            return (
                                <div key={convo.id} onClick={() => setSelectedConversation(convo)} style={{ padding: '1rem', borderBottom: '1px solid #F3F4F6', cursor: 'pointer', background: isSelected ? '#EFF6F3' : 'white', transition: 'background 0.2s' }} onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = '#F9FAFB')} onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'white')}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#244034', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ color: 'white', fontWeight: 600, fontSize: '1.125rem' }}>
                                                {otherUserDetails?.firstName.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                <h3 style={{ fontWeight: convo.hasUnread ? 700 : 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9375rem' }}>
                                                    {otherUserDetails?.firstName || 'Unknown User'}
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {convo.hasUnread && (
                                                        <div style={{ 
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#244034',
                                                            flexShrink: 0
                                                        }}/>
                                                    )}
                                                    <span style={{ fontSize: '0.75rem', color: '#6B7280', flexShrink: 0 }}>
                                                        {formatTime(convo.lastMessageTime)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p style={{ 
                                                fontSize: '0.875rem', 
                                                color: convo.hasUnread ? '#244034' : '#6B7280', 
                                                fontWeight: convo.hasUnread ? 600 : 400,
                                                margin: 0, 
                                                overflow: 'hidden', 
                                                textOverflow: 'ellipsis', 
                                                whiteSpace: 'nowrap' 
                                            }}>
                                                {convo.lastMessage || 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Side - Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedConversation ? (
                    <>
                        <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#244034', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'white', fontWeight: 600 }}>
                                    {(() => {
                                        const otherUserId = selectedConversation.participants.find(p => p !== currentUser?.user_id);
                                        const otherUserDetails = otherUserId ? selectedConversation.participantDetails[otherUserId] : null;
                                        return otherUserDetails?.firstName.charAt(0).toUpperCase() || 'U';
                                    })()}
                                </span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 600, color: '#111827', margin: 0, fontSize: '1rem' }}>
                                    {(() => {
                                        const otherUserId = selectedConversation.participants.find(p => p !== currentUser?.user_id);
                                        const otherUserDetails = otherUserId ? selectedConversation.participantDetails[otherUserId] : null;
                                        return otherUserDetails?.firstName || 'Chat';
                                    })()}
                                </h3>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
                                    {(() => {
                                        const otherUserId = selectedConversation.participants.find(p => p !== currentUser?.user_id);
                                        const otherUserDetails = otherUserId ? selectedConversation.participantDetails[otherUserId] : null;
                                        return otherUserDetails?.email || '';
                                    })()}
                                </p>
                            </div>
                            {chatRestriction && (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem', 
                                    padding: '0.5rem 0.75rem', 
                                    background: messageLimitReached ? '#FEE2E2' : '#FEF3C7', 
                                    borderRadius: '6px',
                                    position: 'relative'
                                }}>
                                    <AlertCircle style={{ width: '16px', height: '16px', color: messageLimitReached ? '#B91C1C' : '#D97706' }} />
                                    {chatRestriction.userRole === 'client' ? (
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: messageLimitReached ? '#B91C1C' : '#D97706' }}>
                                            {messageLimitReached ? 'Chat Locked' : 'Pending Approval'}
                                        </span>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: messageLimitReached ? '#B91C1C' : '#D97706' }}>
                                                {messageLimitReached ? 'Limit Reached' : `${getMessagesRemaining()} messages remaining`}
                                            </span>
                                            {!messageLimitReached && (
                                                <div style={{ 
                                                    position: 'absolute', 
                                                    bottom: '-18px', 
                                                    right: '0', 
                                                    fontSize: '0.65rem', 
                                                    color: '#666',
                                                    background: '#fff',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                                }}>
                                                    {chatRestriction.maxMessages} max
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Message Restriction Banner */}
                        {chatRestriction && chatRestriction.isPending && (
                            <div style={{ background: '#FEF3C7', borderBottom: '1px solid #FCD34D', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertCircle style={{ width: '20px', height: '20px', color: '#D97706', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.875rem', color: '#92400E', margin: 0, fontWeight: 500 }}>
                                        {chatRestriction.userRole === 'client' 
                                            ? 'Action Required - Freelancer Application'
                                            : 'Limited Chat - Application Pending'}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#B45309', margin: 0 }}>
                                        {chatRestriction.userRole === 'client' 
                                            ? `Please approve the freelancer's application for "${chatRestriction.projectTitle}" to continue unlimited chat.`
                                            : `You can send up to ${chatRestriction.maxMessages} messages until your application for "${chatRestriction.projectTitle}" is approved.`}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23244034\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                            {messages.length === 0 ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                                    <div>
                                        <MessageCircle style={{ width: '64px', height: '64px', margin: '0 auto 1rem', color: '#D1D5DB' }} />
                                        <p style={{ color: '#6B7280' }}>No messages yet. Start the conversation!</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isOwnMessage = msg.senderId === currentUser?.user_id;
                                    return (
                                        <div key={msg.id} style={{ display: 'flex', justifyContent: isOwnMessage ? 'flex-end' : 'flex-start' }}>
                                            <div style={{ maxWidth: '70%' }}>
                                                <div style={{ borderRadius: '8px', padding: '0.75rem 1rem', background: isOwnMessage ? '#244034' : 'white', color: isOwnMessage ? 'white' : '#1F2937', boxShadow: isOwnMessage ? 'none' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)', borderBottomRightRadius: isOwnMessage ? '0px' : '8px', borderBottomLeftRadius: isOwnMessage ? '8px' : '0px' }}>
                                                    <p style={{ fontSize: '0.875rem', margin: 0, wordWrap: 'break-word' }}>{msg.text}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '0.25rem', gap: '0.25rem', color: isOwnMessage ? '#D1D5DB' : '#6B7280' }}>
                                                        <span style={{ fontSize: '0.75rem' }}>
                                                            {msg.timestamp?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {isOwnMessage && (msg.read ? <CheckCheck style={{ width: '12px', height: '12px' }} /> : <Check style={{ width: '12px', height: '12px' }} />)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div style={{ background: 'white', borderTop: '1px solid #E5E7EB', padding: '1rem' }}>
                            {error && <div style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: '6px', fontSize: '0.875rem' }}>{error}</div>}
                            {messageLimitReached && (
                                <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <AlertCircle style={{ width: '20px', height: '20px', color: '#B91C1C' }} />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#B91C1C' }}>
                                            {chatRestriction?.userRole === 'client' ? 'Action Required' : 'Message Limit Reached'}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#991B1B', margin: 0, paddingLeft: '1.75rem' }}>
                                        {chatRestriction?.userRole === 'client'
                                            ? 'Please approve the freelancer\'s application to enable unlimited chat.'
                                            : `You've reached the ${chatRestriction?.maxMessages} message limit. The client must approve your application to continue chatting.`}
                                    </p>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <textarea 
                                    value={newMessage} 
                                    onChange={(e) => setNewMessage(e.target.value)} 
                                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} 
                                    placeholder={messageLimitReached ? "Message limit reached..." : "Type a message..."} 
                                    rows={1} 
                                    disabled={messageLimitReached}
                                    style={{ 
                                        flex: 1, 
                                        resize: 'none', 
                                        padding: '0.75rem 1rem', 
                                        background: messageLimitReached ? '#F3F4F6' : '#F9FAFB', 
                                        border: '1px solid #E5E7EB', 
                                        borderRadius: '8px', 
                                        fontSize: '0.875rem', 
                                        outline: 'none', 
                                        fontFamily: 'inherit',
                                        cursor: messageLimitReached ? 'not-allowed' : 'text'
                                    }} 
                                />
                                <button 
                                    onClick={handleSendMessage} 
                                    disabled={!newMessage.trim() || messageLimitReached} 
                                    style={{ 
                                        padding: '0.75rem', 
                                        background: (newMessage.trim() && !messageLimitReached) ? '#244034' : '#D1D5DB', 
                                        color: 'white', 
                                        borderRadius: '8px', 
                                        border: 'none', 
                                        cursor: (newMessage.trim() && !messageLimitReached) ? 'pointer' : 'not-allowed', 
                                        transition: 'background 0.2s' 
                                    }} 
                                    onMouseEnter={(e) => (newMessage.trim() && !messageLimitReached) && (e.currentTarget.style.background = '#31795A')} 
                                    onMouseLeave={(e) => (newMessage.trim() && !messageLimitReached) && (e.currentTarget.style.background = '#244034')}
                                >
                                    <Send style={{ width: '20px', height: '20px' }} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <div>
                            <MessageCircle style={{ width: '96px', height: '96px', margin: '0 auto 1.5rem', color: '#D1D5DB' }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Welcome to Messages</h2>
                            <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>Select a conversation to start chatting</p>
                            <button onClick={() => setShowNewChatModal(true)} style={{ padding: '0.75rem 1.5rem', background: '#244034', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#31795A'} onMouseLeave={(e) => e.currentTarget.style.background = '#244034'}>
                                Start New Chat
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', maxWidth: '28rem', width: '100%', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                            {chatRestriction ? `Chat with Client - ${chatRestriction.projectTitle}` : 'Start New Chat'}
                        </h3>
                        {chatRestriction && chatRestriction.isPending && (
                            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.875rem', color: '#92400E', margin: 0 }}>
                                    <strong>Note:</strong> {chatRestriction.userRole === 'client' 
                                        ? 'You need to approve the freelancer\'s application to enable unlimited chat.'
                                        : `Your application is pending. You can send up to ${chatRestriction.maxMessages} messages.`}
                                </p>
                            </div>
                        )}
                        <input 
                            type="text" 
                            value={newChatUserId} 
                            onChange={(e) => setNewChatUserId(e.target.value)} 
                            placeholder="Enter User ID" 
                            disabled={!!chatRestriction}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem 1rem', 
                                border: '1px solid #D1D5DB', 
                                borderRadius: '8px', 
                                fontSize: '0.9375rem', 
                                outline: 'none', 
                                marginBottom: '1rem',
                                background: chatRestriction ? '#F3F4F6' : 'white',
                                cursor: chatRestriction ? 'not-allowed' : 'text'
                            }} 
                        />
                        {error && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.875rem' }}>{error}</div>}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => { setShowNewChatModal(false); setNewChatUserId(""); setError(null); setChatRestriction(null); }} style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #D1D5DB', color: '#374151', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 500, transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                Cancel
                            </button>
                            <button onClick={handleStartNewChat} disabled={!newChatUserId.trim()} style={{ flex: 1, padding: '0.75rem 1rem', background: newChatUserId.trim() ? '#244034' : '#D1D5DB', color: 'white', borderRadius: '8px', border: 'none', cursor: newChatUserId.trim() ? 'pointer' : 'not-allowed', fontWeight: 500, transition: 'background 0.2s' }} onMouseEnter={(e) => newChatUserId.trim() && (e.currentTarget.style.background = '#31795A')} onMouseLeave={(e) => newChatUserId.trim() && (e.currentTarget.style.background = '#244034')}>
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