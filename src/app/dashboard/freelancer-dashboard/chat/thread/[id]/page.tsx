"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ChatHeader from "@/app/components/chatArea/ChatHeader";
import ProfileDetailsModal from "@/app/components/chatArea/ProfileDetailsModal";
import ChatBody, { LocalMessage } from "@/app/components/chatArea/ChatBody";
import ChatInput from "@/app/components/chatArea/ChatInput";
import { db, auth } from "@/lib/firebase";
import { get, onValue, push, ref, set, update } from "firebase/database";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";

export default function FreelancerThreadPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const conversationId = params?.id;
  const { userData, isLoading } = useUser();
  const [conversation, setConversation] = useState<any | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalUser, setProfileModalUser] = useState<{ id?: string; firstName?: string; email?: string } | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [firebaseAuthenticated, setFirebaseAuthenticated] = useState(false);

  // Firebase auth (same as client thread)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setFirebaseAuthenticated(true);
        return;
      }
      setFirebaseAuthenticated(false);

      const authToken = Cookies.get("auth_token");
      if (!authToken) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/firebase-token`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) return;
        const data = await response.json();
        if (data.success && data.data?.customToken) {
          await signInWithCustomToken(auth, data.data.customToken);
          setFirebaseAuthenticated(true);
        }
      } catch (error) {
        console.error("Firebase authentication error:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  // load conversation (plus try to enrich participant details)
  useEffect(() => {
    if (!conversationId || !firebaseAuthenticated) return;
    const load = async () => {
      try {
        const convRef = ref(db, `conversations/${conversationId}`);
        const snap = await get(convRef);
        if (!snap.exists()) return;

        const conv = { id: conversationId, ...snap.val() };
        const otherId = conv.participants?.find((p: string) => p !== String(userData?.user_id));

        if (otherId) {
          try {
            // Try public freelancer endpoint (will work if other user is a freelancer)
            const publicRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`, { cache: "no-cache" });
            if (publicRes.ok) {
              const publicData = await publicRes.json();
              const found = (publicData.data || []).find((f: any) => String(f.user_id) === String(otherId));
              if (found) {
                conv.participantDetails = conv.participantDetails || {};
                conv.participantDetails[otherId] = {
                  firstName: found.first_name || (found.username || "").split("@")[0],
                  email: found.email || (typeof found.username === "string" && found.username.includes("@") ? found.username : ""),
                };
              }
            }
          } catch (err) {
            console.error("Failed to fetch public info for conversation header", err);
          }
        }

        setConversation(conv);
      } catch (err) {
        console.error("Could not load conversation", err);
      }
    };
    load();
  }, [conversationId, userData, firebaseAuthenticated]);

  // realtime messages listener
  useEffect(() => {
    if (!conversationId || !firebaseAuthenticated) return;

    const messagesRef = ref(db, `conversations/${conversationId}/messages`);
    const unsub = onValue(
      messagesRef,
      (snap) => {
        const data = snap.val();
        if (!data) {
          setMessages([]);
          return;
        }
        const msgs: LocalMessage[] = Object.entries(data)
          .map(([id, msg]: [string, any]) => ({
            id,
            senderId: msg.senderId || "",
            receiverId: msg.receiverId || "",
            text: msg.text || "",
            createdAt: msg.createdAt || null,
            isRead: !!msg.isRead,
            deliveryStatus: msg.deliveryStatus || (msg.isRead ? 'read' : 'sent'),
          }))
          .sort((a, b) => {
            const aTime = typeof a.createdAt === "number" ? a.createdAt : 0;
            const bTime = typeof b.createdAt === "number" ? b.createdAt : 0;
            return aTime - bTime;
          });

        setMessages(msgs);
      },
      (err) => {
        console.error("Message listener error:", err);
      }
    );

    return () => unsub();
  }, [conversationId, firebaseAuthenticated]);

  // Mark messages as read when receiver views them
  useEffect(() => {
    if (!conversationId || !firebaseAuthenticated || !userData || messages.length === 0) return;
    
    const currentUserId = String(userData.user_id);
    
    // Find unread messages sent by the other person (not by current user)
    // Convert senderId to string for comparison
    const unreadMessages = messages.filter(
      (msg) => String(msg.senderId) !== currentUserId && 
               (msg.deliveryStatus !== 'read' || !msg.isRead)
    );
    
    console.log('📬 Checking for unread messages:', {
      currentUserId,
      totalMessages: messages.length,
      unreadCount: unreadMessages.length,
      unreadIds: unreadMessages.map(m => m.id)
    });
    
    if (unreadMessages.length === 0) return;
    
    // Mark each unread message as read
    const markAsRead = async () => {
      try {
        const updates: { [key: string]: any } = {};
        
        unreadMessages.forEach((msg) => {
          updates[`conversations/${conversationId}/messages/${msg.id}/isRead`] = true;
          updates[`conversations/${conversationId}/messages/${msg.id}/deliveryStatus`] = 'read';
          updates[`conversations/${conversationId}/messages/${msg.id}/readAt`] = Date.now();
        });
        
        // Also update the conversation's lastMessageRead status
        updates[`conversations/${conversationId}/lastMessageRead`] = true;
        
        const dbRef = ref(db);
        await update(dbRef, updates);
        
        console.log(`✅ Marked ${unreadMessages.length} messages as read`);
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    };
    
    // Small delay to ensure user has actually viewed the messages
    const timer = setTimeout(markAsRead, 300);
    
    return () => clearTimeout(timer);
  }, [conversationId, firebaseAuthenticated, userData, messages]);

  // typing listener
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
      (snap) => setIsOtherUserTyping(snap.val() === true),
      (err) => {
        console.error("Typing status listener error:", err);
        setIsOtherUserTyping(false);
      }
    );

    return () => unsub();
  }, [conversationId, conversation, userData, firebaseAuthenticated]);

  if (!conversationId) return <div>Missing conversation id</div>;
  if (isLoading || !userData) return <div>Loading user data...</div>;
  if (!firebaseAuthenticated) return <div>Authenticating...</div>;

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <h2 className="main-title">Messages</h2>

        <div className="bg-white border-30" style={{ overflow: "hidden" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: { xs: "calc(100vh - 200px)", md: "calc(100vh - 240px)" },
                minHeight: { xs: 520, md: 560 },
                background: "linear-gradient(180deg, #F0F5F3 0%, #E9F7EF 100%)",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(36,64,52,0.08)",
                border: "1px solid rgba(49,121,90,0.12)",
                fontFamily:
                  "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
              }}
            >
              <ChatHeader
                currentUserId={String(userData.user_id)}
                conversation={conversation}
                onViewProfile={(user) => {
                  setProfileModalUser(user);
                  setShowProfileModal(true);
                }}
                onBack={() => router.push("/dashboard/freelancer-dashboard/chat")}
              />

              <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
                <ChatBody messages={messages} currentUserId={String(userData.user_id)} isOtherUserTyping={isOtherUserTyping} />
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
                        deliveryStatus: 'sent', // Initial status: sent (single tick)
                      });

                      const convRef = ref(db, `conversations/${conversationId}`);
                      await update(convRef, {
                        lastMessage: trimmed,
                        updatedAt: Date.now(),
                        lastSenderId: senderId,
                        lastMessageRead: false,
                      });
                    } catch (err) {
                      console.error("Send message failed:", err);
                    }
                  }}
                />
              </div>
            </Box>
        </div>
      </div>

      {profileModalUser && (
        <ProfileDetailsModal
          open={showProfileModal}
          userData={profileModalUser}
          onClose={() => {
            setShowProfileModal(false);
            setProfileModalUser(null);
          }}
        />
      )}
    </div>
  );
}


