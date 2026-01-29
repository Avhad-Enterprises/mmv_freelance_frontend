"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useSocket } from "@/context/SocketContext";
import { useSocketMessages } from "@/hooks/useSocketMessages";
import ChatHeader from "@/app/components/chatArea/ChatHeader";
import ChatBody from "@/app/components/chatArea/ChatBody";
import ChatInput from "@/app/components/chatArea/ChatInput";
import Box from "@mui/material/Box";
import axios from "axios";
import { authCookies } from "@/utils/cookies";

interface InlineThreadViewProps {
  conversationId: string;
  onSettingsClick?: () => void;
  onBack?: () => void;
}

const InlineThreadView: React.FC<InlineThreadViewProps> = ({
  conversationId,
  onSettingsClick,
  onBack,
}) => {
  const { userData, currentRole, isLoading } = useUser();
  const { isConnected } = useSocket();
  const currentUserId = userData?.user_id ? String(userData.user_id) : null;

  const [conversation, setConversation] = useState<any | null>(null);
  const [otherParticipantId, setOtherParticipantId] = useState<
    string | undefined
  >(undefined);

  // Use socket-based messages hook
  const {
    messages,
    hasMoreMessages,
    isLoadingMore,
    loadMoreMessages,
    sendMessage,
    markAsRead,
    isOtherUserTyping,
    sendTyping,
  } = useSocketMessages({
    conversationId: conversationId,
    currentUserId: currentUserId,
  });

  // Load conversation metadata from backend API
  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const loadConversation = async () => {
      try {
        const token = authCookies.getToken();
        // The backend does not have a GET /conversations/:id endpoint (returns 404).
        // Fetch all conversations and find the matching one instead.
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const conversations = response.data?.data || [];
        const convData = conversations.find(
          (c: any) => String(c.conversation_id) === String(conversationId)
        );

        if (convData) {
          // Build participant details from API response
          const participantDetails: Record<string, any> = {};
          const participantIds: string[] = [];

          convData.participants?.forEach((p: any) => {
            const pid = String(p.user_id);
            participantIds.push(pid);
            participantDetails[pid] = {
              firstName: p.first_name || p.username || "User",
              email: p.email || "",
              profilePicture: p.profile_picture || undefined,
            };
          });

          const otherId = participantIds.find((id) => id !== currentUserId);
          setOtherParticipantId(otherId);

          setConversation({
            id: String(convData.conversation_id || conversationId),
            participants: participantIds,
            participantDetails,
          });
        } else {
          // If conversation not found in list, fallback to deriving participants from conversationId
          if (conversationId.includes("_")) {
            const parts = conversationId.split("_").sort();
            const otherId = parts.find((p) => p !== currentUserId);
            setOtherParticipantId(otherId);
            setConversation({
              id: conversationId,
              participants: parts,
              participantDetails: {},
            });
          }
        }
      } catch (err: any) {
        // Suppress noisy Axios 404 errors and log a friendly message.
        if (err?.response?.status === 404) {
          console.warn(
            `Conversation ${conversationId} not found (404). Falling back to conversationId parsing.`
          );
        } else {
          console.error("Failed to load conversation:", err);
        }

        // Fallback parsing from conversationId if possible
        if (conversationId && conversationId.includes("_")) {
          const parts = conversationId.split("_").sort();
          const otherId = parts.find((p) => p !== currentUserId);
          setOtherParticipantId(otherId);
          setConversation({
            id: conversationId,
            participants: parts,
            participantDetails: {},
          });
        }
      }
    };

    loadConversation();
  }, [conversationId, currentUserId]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (messages.length > 0 && currentUserId) {
      const hasUnreadFromOther = messages.some(
        (msg) => msg.senderId !== currentUserId && !msg.isRead
      );
      if (hasUnreadFromOther) {
        markAsRead();
      }
    }
  }, [messages, currentUserId, markAsRead]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    sendMessage(text);
  };

  const handleTyping = (isTyping: boolean) => {
    sendTyping(isTyping);
  };

  if (isLoading || !userData) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          bgcolor: "#FFFFFF",
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#FFFFFF",
        overflow: "hidden",
        fontFamily:
          "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
      }}
    >
      <ChatHeader
        currentUserId={currentUserId}
        conversation={conversation}
        onProfileClick={onSettingsClick}
        onBack={onBack}
        isTyping={isOtherUserTyping}
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
          currentUserId={currentUserId}
          isOtherUserTyping={isOtherUserTyping}
          hasMoreMessages={hasMoreMessages}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMoreMessages}
          isConnected={isConnected}
        />
        <ChatInput
          conversationId={conversationId}
          currentUserId={currentUserId}
          userRole={currentRole}
          otherParticipantId={otherParticipantId}
          onSend={handleSend}
          onTyping={handleTyping}
        />
      </div>
    </Box>
  );
};

export default InlineThreadView;
