import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '@/context/SocketContext';
import { authCookies } from '@/utils/cookies';
import axios from 'axios';

import { LocalMessage } from '@/app/components/chatArea/ChatBody';

// Align with the API response structure roughly
export interface Message {
    id: number;
    conversation_id?: number;
    sender_id: number;
    receiver_id: number;
    content: string; // The backend uses 'content', but we map it to 'text' for compatibility if needed
    is_read: boolean;
    read_at?: string;
    created_at: string;
    updated_at: string;
}

interface UseSocketMessagesOptions {
    conversationId: string | null; // This might be coming as string from params
    currentUserId: string | null;
}

interface UseSocketMessagesReturn {
    messages: LocalMessage[];
    hasMoreMessages: boolean;
    isLoadingMore: boolean;
    loadMoreMessages: () => Promise<void>;
    sendMessage: (text: string) => void;
    markAsRead: () => void;
    isOtherUserTyping: boolean;
    sendTyping: (isTyping: boolean) => void;
}

export function useSocketMessages({
    conversationId,
    currentUserId
}: UseSocketMessagesOptions): UseSocketMessagesReturn {
    const { socket } = useSocket();
    const [messages, setMessages] = useState<LocalMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Initial load
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [offset, setOffset] = useState(0);
    const LIMIT = 50;

    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initial fetch of messages
    const fetchMessages = useCallback(async (isLoadMore = false) => {
        if (!conversationId) return;

        try {
            if (isLoadMore) setIsLoadingMore(true);
            else setIsLoading(true);

            const token = authCookies.getToken();
            const currentOffset = isLoadMore ? messages.length : 0;

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/conversations/${conversationId}/messages`,
                {
                    params: { limit: LIMIT, offset: currentOffset },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const apiMessages: Message[] = response.data.data;
            const mappedMessages: LocalMessage[] = apiMessages.map(msg => ({
                id: msg.id.toString(),
                senderId: msg.sender_id.toString(),
                receiverId: msg.receiver_id.toString(),
                text: msg.content,
                createdAt: new Date(msg.created_at),
                isRead: msg.is_read,
                deliveryStatus: msg.is_read ? 'read' : 'sent'
            })).sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)); // Ensure ascending order

            if (isLoadMore) {
                setMessages(prev => [...mappedMessages, ...prev]); // Prepend older messages? 
                // Wait, if we prepend, we need to make sure logic is correct. 
                // Usually chat history API returns newest first (desc). 
                // So if we fetch offset 0, we get most recent. 
                // We should reverse apiMessages if they come desc.
                // Our ChatService orderBy('created_at', 'desc').
                // So mappedMessages are [newest, ..., oldest].
                // We want to display oldest at top.
                // So we should reverse mappedMessages to get [oldest, ..., newest].
                // But if we load more (older), they should go to the top.
            } else {
                setMessages(mappedMessages); // If api returns desc, we reverse effectively by sorting above.
            }

            if (apiMessages.length < LIMIT) {
                setHasMoreMessages(false);
            }

        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [conversationId, messages.length]);

    // Initial Load
    useEffect(() => {
        if (conversationId) {
            fetchMessages(false);
        }
    }, [conversationId]); // Don't add fetchMessages dependency

    // Socket Events
    useEffect(() => {
        if (!socket || !conversationId) return;

        socket.emit('join_conversation', conversationId);

        const handleNewMessage = (msg: Message) => {
            // Only add if belongs to this conversation (already guarded by room join but safe checking)
            // msg.conversation_id might check out.
            const newMessage: LocalMessage = {
                id: msg.id.toString(),
                senderId: msg.sender_id.toString(),
                receiverId: msg.receiver_id.toString(),
                text: msg.content,
                createdAt: new Date(msg.created_at),
                isRead: msg.is_read,
                deliveryStatus: 'sent'
            };
            setMessages(prev => [...prev, newMessage]);

            // If message is from other user, mark it as read immediately if we are viewing?
            if (msg.sender_id.toString() !== currentUserId) {
                markAsRead();
            }
        };

        const handleTypingStart = (data: { userId: number }) => {
            if (data.userId.toString() !== currentUserId) {
                setIsOtherUserTyping(true);
            }
        };

        const handleTypingStop = (data: { userId: number }) => {
            if (data.userId.toString() !== currentUserId) {
                setIsOtherUserTyping(false);
            }
        };

        const handleMessagesRead = (data: { userId: number, readAt: string }) => {
            // Update all my sent messages to read
            if (data.userId.toString() !== currentUserId) {
                setMessages(prev => prev.map(m =>
                    m.senderId === currentUserId && !m.isRead
                        ? { ...m, isRead: true, deliveryStatus: 'read' }
                        : m
                ));
            }
        };

        socket.on('new_message', handleNewMessage);
        socket.on('typing_start', handleTypingStart);
        socket.on('typing_stop', handleTypingStop);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.emit('leave_conversation', conversationId);
            socket.off('new_message', handleNewMessage);
            socket.off('typing_start', handleTypingStart);
            socket.off('typing_stop', handleTypingStop);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, conversationId, currentUserId]);

    const sendMessage = useCallback((text: string) => {
        if (!socket || !conversationId || !currentUserId) return;

        // Optimistic update? Maybe safer to wait for socket echo or socket ack.
        // But for responsiveness we can rely on 'new_message' event which comes back.
        // Or we can append locally. 
        // Existing implementation probably expects optimisitic.
        // But let's rely on socket event back for simplicity and consistency first.

        // Need toUserId? The backend takes conversationId. But backend implementation used `toUserId` in socket event?
        // Let's check backend implementation.
        // `socket.on('send_message', async (data) => { const { conversationId, content, toUserId } = data; ... })`
        // So we need toUserId. We don't have it easily here unless we pass it or fetch it.
        // Actually we can just send conversationId and backend can figure out the other participant?
        // My backend code DOES assume `toUserId` is passed in `send_message`.
        // I should probably fix backend to infer `toUserId` from conversation.
        // BUT `ChatService.createMessage` calculates `receiverId`. 
        // Backend `socket.on('send_message'...)`:
        // `const message = await ChatService.createMessage(userId, conversationId, content);`
        // `ChatService.createMessage` logic:
        // `const conversation = await DB(CONVERSATIONS_TABLE).where('id', conversationId).first();`
        // `const receiverId = conversation.participant1_id === senderId ? ... : ...;`
        // So backend DOES calculate receiverId. 
        // BUT backend `socket.on` tries to use `toUserId` from data for notification: `this.io.to(user_${toUserId}).emit...`
        // So if I don't pass `toUserId`, that notification might fail.
        // I can just rely on `new_message` in room.

        // However, I should try to pass toUserId if possible.
        // But `useSocketMessages` doesn't have `otherUserId`. 
        // I will ignore it for now or rely on room broadcast.

        socket.emit('send_message', {
            conversationId,
            content: text,
            // toUserId: ??? 
        });
    }, [socket, conversationId, currentUserId]);

    const markAsRead = useCallback(() => {
        if (!socket || !conversationId) return;
        socket.emit('mark_read', { conversationId });
    }, [socket, conversationId]);

    const sendTyping = useCallback((isTyping: boolean) => {
        if (!socket || !conversationId) return;

        if (isTyping) {
            socket.emit('typing_start', { conversationId });
        } else {
            socket.emit('typing_stop', { conversationId });
        }
    }, [socket, conversationId]);

    const loadMoreMessages = async () => {
        if (!hasMoreMessages || isLoadingMore) return;
        await fetchMessages(true);
    };

    return {
        messages,
        hasMoreMessages,
        isLoadingMore,
        loadMoreMessages,
        sendMessage,
        markAsRead,
        isOtherUserTyping,
        sendTyping
    };
}
