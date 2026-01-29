import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { authCookies } from '@/utils/cookies';
import { useSocket } from '@/context/SocketContext';

export interface Conversation {
  id: string; // Will be stringified integer ID from backend
  participants: string[]; // user ids as strings
  participantDetails: { [userId: string]: { email: string; firstName: string; profilePicture?: string; } };
  lastMessage?: string;
  lastMessageTime?: number;
  updatedAt?: number;
  lastSenderId?: string;
  hasUnread?: boolean;
  createdAt?: number;
}

export function useConversations(currentUserId: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setIsLoading(true);
      const token = authCookies.getToken();
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        const apiConversations = response.data.data || [];

        const mapped: Conversation[] = apiConversations.map((c: any) => {
          const participantDetails: any = {};
          const participantIds: string[] = [];

          // Map participants array to participantDetails object
          c.participants.forEach((p: any) => {
            const pid = String(p.user_id);
            participantIds.push(pid);
            participantDetails[pid] = {
              email: p.email || '',
              firstName: p.first_name || p.username || 'User',
              profilePicture: p.profile_picture || undefined
            };
          });

          return {
            id: String(c.conversation_id), // Convert integer ID to string
            participants: participantIds,
            participantDetails: participantDetails,
            lastMessage: c.last_message_content || '',
            lastMessageTime: c.last_message_created_at ? new Date(c.last_message_created_at).getTime() : 0,
            updatedAt: c.updated_at ? new Date(c.updated_at).getTime() : 0,
            lastSenderId: c.last_message_sender_id ? String(c.last_message_sender_id) : undefined,
            hasUnread: (c.unread_count || 0) > 0,
            createdAt: new Date(c.created_at).getTime()
          };
        });

        setConversations(mapped);
      }
    } catch (error) {
      // Error fetching conversations
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Listen for updates via socket to refresh list (e.g. new message in any conversation)
  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchConversations();
    };

    // If I receive a message notification (from socket/index.ts `message_notification`), refresh list
    socket.on('message_notification', handleRefresh);
    socket.on('new_message', handleRefresh); // Also refresh on new message

    return () => {
      socket.off('message_notification', handleRefresh);
      socket.off('new_message', handleRefresh);
    };
  }, [socket, fetchConversations]);

  return { conversations, isLoading, refreshConversations: fetchConversations };
}
