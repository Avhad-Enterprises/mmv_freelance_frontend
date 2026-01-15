"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from "@/context/UserContext";
import { useSocketMessages } from '@/hooks/useSocketMessages';
import { useSocket } from '@/context/SocketContext';
import ChatBody from '@/app/components/chatArea/ChatBody';
import ChatInput from '@/app/components/chatArea/ChatInput';
import Box from "@mui/material/Box";
import { authCookies } from '@/utils/cookies';
import axios from 'axios';
import AuthenticatedImage from '@/app/components/common/AuthenticatedImage';

interface InlineThreadViewProps {
  conversationId: string;
  onBack?: () => void;
}

interface ParticipantInfo {
  user_id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  profile_picture?: string;
}

interface ConversationDetails {
  conversation_id: number;
  participants: ParticipantInfo[];
  last_message_content?: string;
  last_message_created_at?: string;
}

const InlineThreadView: React.FC<InlineThreadViewProps> = ({ conversationId, onBack }) => {
  const { userData, currentRole, isLoading } = useUser();
  const { isConnected } = useSocket();
  const [conversationDetails, setConversationDetails] = useState<ConversationDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Fetch conversation details
  const fetchConversationDetails = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoadingDetails(true);
      const token = authCookies.getToken();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.data) {
        const found = response.data.data.find(
          (c: ConversationDetails) => String(c.conversation_id) === conversationId
        );
        if (found) {
          setConversationDetails(found);
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversation details:', error);
    } finally {
      setLoadingDetails(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchConversationDetails();
  }, [fetchConversationDetails]);

  // Use socket messages hook
  const {
    messages,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
    isOtherUserTyping,
    sendTyping
  } = useSocketMessages({
    conversationId: conversationId,
    currentUserId: userData?.user_id?.toString() || null
  });

  // Get other participant details
  const otherParticipant = conversationDetails?.participants?.find(
    p => String(p.user_id) !== String(userData?.user_id)
  );

  const displayName = otherParticipant?.first_name || 'User';
  const displayImage = otherParticipant?.profile_picture;
  const displayInitial = displayName.charAt(0).toUpperCase();

  // Format last active time
  const formatLastActive = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const lastActiveText = conversationDetails?.last_message_created_at
    ? formatLastActive(conversationDetails.last_message_created_at)
    : null;

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
      {/* Chat Header with real participant info */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(49,121,90,0.1)',
        background: '#244034',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderRadius: '0 30px 0 0'
      }}>
        {/* Back Button - merged into header */}
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'rgba(255,255,255,0.95)',
            cursor: 'pointer',
            padding: '8px',
            display: onBack ? 'flex' : 'none', // Only display if onBack is provided
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            marginRight: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          aria-label="Back to messages"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Profile Picture */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.15)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {displayImage ? (
            <AuthenticatedImage
              src={displayImage}
              alt={displayName}
              width={44}
              height={44}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              {displayInitial}
            </span>
          )}
        </div>

        {/* Name and Status */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 600,
            color: '#FFFFFF',
            fontSize: '1rem',
            marginBottom: '2px'
          }}>
            {loadingDetails ? 'Loading...' : displayName}
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: isOtherUserTyping ? '#D2F34C' : 'rgba(255,255,255,0.7)',
            fontWeight: isOtherUserTyping ? 500 : 400
          }}>
            {isOtherUserTyping ? (
              '● Typing...'
            ) : lastActiveText ? (
              `Active ${lastActiveText}`
            ) : isConnected ? (
              'Online'
            ) : (
              'Offline'
            )}
          </div>
        </div>

        {/* Connection indicator */}
        <div style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: isConnected ? '#4ade80' : '#f87171',
          boxShadow: isConnected ? '0 0 8px #4ade80' : '0 0 8px #f87171'
        }} />
      </div>

      {/* Chat Body */}
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
          hasMoreMessages={hasMoreMessages}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMoreMessages}
          isConnected={isConnected}
        />
        <ChatInput
          conversationId={conversationId}
          currentUserId={String(userData.user_id)}
          userRole={currentRole}
          onSend={sendMessage}
          onTyping={sendTyping}
          disabled={!isConnected}
          otherParticipantId={otherParticipant?.user_id?.toString()}
        />
      </div>
    </Box>
  );
};

export default InlineThreadView;
