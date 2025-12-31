"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from "@/context/UserContext";
import ChatHeader from '@/app/components/chatArea/ChatHeader';
import ChatBody, { LocalMessage } from '@/app/components/chatArea/ChatBody';
import ChatInput from '@/app/components/chatArea/ChatInput';
import { db, auth } from '@/lib/firebase';
import { ref, get, set, push, onValue, update } from 'firebase/database';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import Box from "@mui/material/Box";
import Cookies from 'js-cookie';

interface InlineThreadViewProps {
  conversationId: string;
}

const InlineThreadView: React.FC<InlineThreadViewProps> = ({ conversationId }) => {
  const { userData, isLoading } = useUser();
  const [conversation, setConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [firebaseAuthenticated, setFirebaseAuthenticated] = useState(false);

  // Firebase Authentication Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseAuthenticated(true);
      } else {
        setFirebaseAuthenticated(false);

        // Try to authenticate with custom token
        const authToken = Cookies.get('auth_token');
        if (authToken) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/firebase-token`, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data?.customToken) {
                await signInWithCustomToken(auth, data.data.customToken);
              }
            }
          } catch (error) {
            console.error('Firebase authentication error:', error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load conversation data
  useEffect(() => {
    if (!conversationId || !firebaseAuthenticated) return;
    const load = async () => {
      try {
        const convRef = ref(db, `conversations/${conversationId}`);
        const snap = await get(convRef);
        if (snap.exists()) {
          const conv = { id: conversationId, ...snap.val() };

          // Try to resolve the other participant's public profile
          const otherId = conv.participants?.find((p: string) => p !== String(userData?.user_id));

          if (otherId) {
            try {
              const publicRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, { cache: 'no-cache' });
              if (publicRes.ok) {
                const publicData = await publicRes.json();
                const found = (publicData.data || []).find((f: any) => String(f.user_id) === String(otherId));
                if (found) {
                  conv.participantDetails = conv.participantDetails || {};
                  conv.participantDetails[otherId] = {
                    firstName: found.first_name || (found.username || '').split('@')[0],
                    email: '',
                    profilePicture: found.profile_picture || undefined
                  };
                }
              }
            } catch (err) {
              console.error('Failed to fetch public freelancer info', err);
            }
          }

          setConversation(conv);
        } else if (conversationId.includes('_') && userData?.user_id) {
          // Handle non-existent but valid pattern conversation ID
          const participants = conversationId.split('_').sort();
          const currentUserId = String(userData.user_id);
          const otherId = participants.find(p => p !== currentUserId);

          if (otherId && participants.includes(currentUserId)) {
            try {
              // Fetch other user profile info
              let otherDetails = {
                firstName: `User ${otherId}`,
                email: '',
                profilePicture: undefined
              };

              const publicRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, { cache: 'no-cache' });
              if (publicRes.ok) {
                const publicData = await publicRes.json();
                const found = (publicData.data || []).find((f: any) => String(f.user_id) === String(otherId));
                if (found) {
                  otherDetails = {
                    firstName: found.first_name || (found.username || '').split('@')[0],
                    email: '',
                    profilePicture: found.profile_picture || undefined
                  };
                }
              }

              const participantDetails = {
                [currentUserId]: {
                  firstName: userData.first_name || 'Me',
                  email: userData.email || '',
                  profilePicture: userData.profile_picture || undefined
                },
                [otherId]: otherDetails
              };

              const newConvData = {
                participants,
                participantDetails,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                lastMessage: '',
                lastSenderId: '',
                lastMessageRead: true
              };

              await set(convRef, newConvData);
              setConversation({ id: conversationId, ...newConvData });
            } catch (createErr) {
              console.error('Failed to auto-create conversation', createErr);
            }
          }
        }
      } catch (err) {
        console.error('Could not load conversation', err);
      }
    };
    load();
  }, [conversationId, userData, firebaseAuthenticated]);

  // Realtime messages listener
  useEffect(() => {
    if (!conversationId || !firebaseAuthenticated) return;
    setIsLoadingMessages(true);

    const messagesRef = ref(db, `conversations/${conversationId}/messages`);

    const unsub = onValue(messagesRef, (snap) => {
      const data = snap.val();
      if (!data) {
        setMessages([]);
        setIsLoadingMessages(false);
        return;
      }

      const msgs: LocalMessage[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      msgs.sort((a, b) => {
        const aTime = typeof a.createdAt === 'number' ? a.createdAt : 0;
        const bTime = typeof b.createdAt === 'number' ? b.createdAt : 0;
        return aTime - bTime;
      });
      setMessages(msgs);
      setIsLoadingMessages(false);
    });

    return () => unsub();
  }, [conversationId, firebaseAuthenticated]);

  // Mark messages as read
  useEffect(() => {
    if (!conversationId || !firebaseAuthenticated || !userData || messages.length === 0) return;

    const unreadMessages = messages.filter(
      (msg) => msg.senderId !== String(userData.user_id) && !msg.isRead
    );

    if (unreadMessages.length === 0) return;

    const markAsRead = async () => {
      try {
        const updates: { [key: string]: any } = {};

        unreadMessages.forEach((msg) => {
          updates[`conversations/${conversationId}/messages/${msg.id}/isRead`] = true;
          updates[`conversations/${conversationId}/messages/${msg.id}/deliveryStatus`] = 'read';
          updates[`conversations/${conversationId}/messages/${msg.id}/readAt`] = Date.now();
        });

        updates[`conversations/${conversationId}/lastMessageRead`] = true;

        const dbRef = ref(db);
        await update(dbRef, updates);
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    };

    const timer = setTimeout(markAsRead, 300);

    return () => clearTimeout(timer);
  }, [conversationId, firebaseAuthenticated, userData, messages]);

  // Real-time listener for typing status
  useEffect(() => {
    if (!conversationId || !conversation || !userData || !firebaseAuthenticated) {
      setIsOtherUserTyping(false);
      return;
    }

    const otherId = conversation.participants?.find((p: string) => p !== String(userData.user_id));
    if (!otherId) {
      setIsOtherUserTyping(false);
      return;
    }

    const typingRef = ref(db, `conversations/${conversationId}/typing/${otherId}`);

    const unsub = onValue(
      typingRef,
      (snap) => {
        const isTyping = snap.val() === true;
        setIsOtherUserTyping(isTyping);
      },
      (err) => {
        console.error('Typing status listener error:', err);
        setIsOtherUserTyping(false);
      }
    );

    return () => unsub();
  }, [conversationId, conversation, userData, firebaseAuthenticated]);

  const handleViewProfile = (user: { id?: string; firstName?: string; email?: string }) => {
    // For inline view, we might not want to show profile inline
    // or we could emit an event to parent. For now, do nothing or navigate
    if (user.id) {
      window.open(`/freelancer-profile/${user.id}`, '_blank');
    }
  };

  if (isLoading || !userData) return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      bgcolor: '#FFFFFF',
    }}>
      Loading...
    </Box>
  );

  if (!firebaseAuthenticated) return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      bgcolor: '#FFFFFF',
    }}>
      Authenticating...
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#FFFFFF",
        overflow: "hidden",
        fontFamily: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
      }}
    >
      <ChatHeader
        currentUserId={String(userData.user_id)}
        conversation={conversation}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <ChatBody
          messages={messages}
          currentUserId={String(userData.user_id)}
          isOtherUserTyping={isOtherUserTyping}
        />
        <ChatInput
          conversationId={conversationId}
          currentUserId={String(userData.user_id)}
          onSend={async (text) => {
            if (!conversationId || !conversation || !userData) return;
            const senderId = String(userData.user_id);
            const otherId = conversation.participants?.find((p: string) => p !== senderId);
            if (!otherId) return;

            const trimmed = text.trim();
            if (!trimmed) return;

            try {
              const messagesRef = ref(db, `conversations/${conversationId}/messages`);
              const newMessageRef = push(messagesRef);
              await set(newMessageRef, {
                senderId,
                receiverId: otherId,
                text: trimmed,
                createdAt: Date.now(),
                isRead: false,
                deliveryStatus: 'sent',
              });

              const convRef = ref(db, `conversations/${conversationId}`);
              await update(convRef, {
                lastMessage: trimmed,
                updatedAt: Date.now(),
                lastSenderId: senderId,
                lastMessageRead: false,
              });
            } catch (err) {
              console.error('Send message failed:', err);
            }
          }}
        />
      </div>
    </Box>
  );
};

export default InlineThreadView;
