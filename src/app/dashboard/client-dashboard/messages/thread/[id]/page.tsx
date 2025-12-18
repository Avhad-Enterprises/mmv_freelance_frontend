"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import ChatHeader from '@/app/components/chatArea/ChatHeader';
import ProfileDetailsModal from '@/app/components/chatArea/ProfileDetailsModal';
import ChatBody, { LocalMessage } from '@/app/components/chatArea/ChatBody';
import ChatInput from '@/app/components/chatArea/ChatInput';
import { db, auth } from '@/lib/firebase';
import { ref, get, set, push, onValue, query as rtdbQuery, orderByChild, limitToLast, update } from 'firebase/database';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import DashboardHeader from "@/app/components/dashboard/candidate/dashboard-header";
import Box from "@mui/material/Box";
import Cookies from 'js-cookie';
import { IFreelancer } from "@/interfaces/freelancer";
import CandidateDetailsArea from "@/app/components/candidate-details/candidate-details-area-sidebar";
import toast from 'react-hot-toast';

// Helper function to map API candidate data to IFreelancer interface
const mapApiCandidateToIFreelancer = (apiCandidate: any): IFreelancer => {
  return {
    user_id: apiCandidate.user_id,
    first_name: apiCandidate.first_name || '',
    last_name: apiCandidate.last_name || '',
    username: apiCandidate.username || '',
    email: apiCandidate.email || apiCandidate.username || '',
    profile_picture: apiCandidate.profile_picture || null,
    bio: apiCandidate.bio || null,
    city: apiCandidate.city || null,
    country: apiCandidate.country || null,
    latitude: apiCandidate.latitude || null,
    longitude: apiCandidate.longitude || null,
    skills: apiCandidate.skills || [],
    superpowers: apiCandidate.superpowers || [],
    languages: apiCandidate.languages || [],
    portfolio_links: apiCandidate.portfolio_links || [],
    rate_amount: apiCandidate.rate_amount || '0.00',
    currency: apiCandidate.currency || 'USD',
    availability: apiCandidate.availability || 'not specified',
    experience_level: apiCandidate.experience_level || 'not specified',
    role_name: apiCandidate.role_name || null,
    profile_title: apiCandidate.profile_title || null,
    short_description: apiCandidate.short_description || null,
    kyc_verified: apiCandidate.kyc_verified || false,
    aadhaar_verification: apiCandidate.aadhaar_verification || false,
    hire_count: apiCandidate.hire_count || 0,
    review_id: apiCandidate.review_id || 0,
    total_earnings: apiCandidate.total_earnings || 0,
    time_spent: apiCandidate.time_spent || 0,
    youtube_videos: apiCandidate.youtube_videos || [],
    experience: apiCandidate.experience || [],
    education: apiCandidate.education || [],
    previous_works: apiCandidate.previous_works || [],
    certification: apiCandidate.certification || [],
    services: apiCandidate.services || [],
    created_at: apiCandidate.created_at || '',
    updated_at: apiCandidate.updated_at || '',
    freelancer_id: apiCandidate.freelancer_id || apiCandidate.user_id || 0,
    work_type: apiCandidate.work_type || null,
    hours_per_week: apiCandidate.hours_per_week || null,
  };
};

export default function ThreadPage() {
  const params = useParams() as { id?: string };
  const conversationId = params?.id;
  const { userData, isLoading } = useUser();
  const [conversation, setConversation] = useState<any | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalUser, setProfileModalUser] = useState<{ id?: string; firstName?: string; email?: string } | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [firebaseAuthenticated, setFirebaseAuthenticated] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<IFreelancer | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Firebase Authentication Effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('✅ Firebase user authenticated:', user.uid);
        setFirebaseAuthenticated(true);
      } else {
        console.log('⚠️ No Firebase user, attempting authentication...');
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
                console.log('✅ Firebase authentication successful via custom token');
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

  useEffect(() => {
    if (!conversationId || !firebaseAuthenticated) return;
    const load = async () => {
      try {
        const convRef = ref(db, `conversations/${conversationId}`);
        const snap = await get(convRef);
        if (snap.exists()) {
          const conv = { id: conversationId, ...snap.val() };

          // Try to resolve the other participant's public profile (freelancer list)
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
                    email: `${found.username || 'unknown'}@example.com`,
                  };
                }
              }
            } catch (err) {
              console.error('Failed to fetch public freelancer info for conversation header', err);
            }
          }

          setConversation(conv);

          // Don't seed placeholder messages - let the realtime listener handle all messages
        }
      } catch (err) {
        console.error('Could not load conversation', err);
      }
    };
    load();
  }, [conversationId, userData, firebaseAuthenticated]);

  // realtime messages listener
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
      
      const msgs: LocalMessage[] = Object.entries(data).map(([id, msg]: [string, any]) => {
        return {
          id,
          senderId: msg.senderId || '',
          receiverId: msg.receiverId || '',
          text: msg.text || '',
          createdAt: msg.createdAt || null,
          isRead: !!msg.isRead,
          deliveryStatus: msg.deliveryStatus || (msg.isRead ? 'read' : 'sent'),
        } as LocalMessage;
      }).sort((a, b) => {
        const aTime = typeof a.createdAt === 'number' ? a.createdAt : 0;
        const bTime = typeof b.createdAt === 'number' ? b.createdAt : 0;
        return aTime - bTime;
      });
      
      setMessages(msgs);
      setIsLoadingMessages(false);
    }, (err) => {
      console.error('Message listener error:', err);
      setIsLoadingMessages(false);
    });

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

  // Handler for viewing freelancer profile
  const handleViewProfile = async (user: { id?: string; firstName?: string; email?: string }) => {
    if (!user.id) {
      toast.error("Unable to load profile: User ID not found.");
      return;
    }

    setLoadingProfile(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/freelancers/getfreelancers-public`,
        { cache: 'no-cache' }
      );
      
      if (response.ok) {
        const data = await response.json();
        const freelancer = (data.data || []).find(
          (f: any) => String(f.user_id) === String(user.id)
        );
        
        if (freelancer) {
          setSelectedFreelancer(mapApiCandidateToIFreelancer(freelancer));
        } else {
          toast.error("Freelancer profile not found.");
        }
      } else {
        toast.error("Failed to load freelancer profile.");
      }
    } catch (error) {
      console.error("Error fetching freelancer profile:", error);
      toast.error("An error occurred while loading the profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

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

  if (!conversationId) return <div>Missing conversation id</div>;
  if (isLoading || !userData) return <div>Loading user data...</div>;
  if (!firebaseAuthenticated) return <div>Authenticating...</div>;

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader />
        <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
          <h2 className="main-title m0">
            {selectedFreelancer ? `Profile: ${selectedFreelancer.first_name} ${selectedFreelancer.last_name}` : "Messages"}
          </h2>
          {selectedFreelancer && (
            <button className="dash-btn-two tran3s" onClick={() => setSelectedFreelancer(null)}>
              ← Back to Messages
            </button>
          )}
        </div>

        {selectedFreelancer ? (
          <CandidateDetailsArea freelancer={selectedFreelancer} loading={loadingProfile} />
        ) : (
        <div className="bg-white border-30" style={{ overflow: "hidden" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: { xs: "calc(100vh - 200px)", md: "calc(100vh - 240px)" },
                minHeight: { xs: 520, md: 560 },
                background: "#FFFFFF",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(36,64,52,0.15)",
                border: "1px solid rgba(49,121,90,0.12)",
                fontFamily:
                  "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
              }}
            >
              <ChatHeader
                currentUserId={String(userData.user_id)}
                conversation={conversation}
                onViewProfile={handleViewProfile}
              />

              {/* Only the chat messages area scrolls; header & input stay fixed */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  overflow: "hidden",
                }}
              >
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
                      // write message with delivery status
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

                      // update conversation metadata
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
        </div>
        )}
      </div>
    </div>
  );
}
