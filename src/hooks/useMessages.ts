import { useState, useEffect, useRef } from 'react';
import { Database, ref, onValue, query, limitToLast, get, orderByChild, endBefore, off } from 'firebase/database';
import { LocalMessage } from '@/app/components/chatArea/ChatBody';

interface UseMessagesOptions {
    conversationId: string | null;
    db: Database | null;
    currentUserId: string | null;
    messagesPerPage?: number;
}

interface UseMessagesReturn {
    messages: LocalMessage[];
    hasMoreMessages: boolean;
    isLoadingMore: boolean;
    loadMoreMessages: () => Promise<void>;
    isOtherUserTyping: boolean;
}

/**
 * Custom hook to manage real-time messages for a conversation
 * Handles message subscription, pagination, and typing indicators
 */
export function useMessages({
    conversationId,
    db,
    currentUserId,
    messagesPerPage = 50
}: UseMessagesOptions): UseMessagesReturn {
    const [messages, setMessages] = useState<LocalMessage[]>([]);
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<number | null>(null);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState<boolean>(false);

    const isMountedRef = useRef<boolean>(true);
    const messagesUnsubscribeRef = useRef<(() => void) | null>(null);
    const typingUnsubscribeRef = useRef<(() => void) | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;

            if (messagesUnsubscribeRef.current) {
                try {
                    messagesUnsubscribeRef.current();
                } catch (error) {
                    console.error('Error unsubscribing from messages:', error);
                } finally {
                    messagesUnsubscribeRef.current = null;
                }
            }

            if (typingUnsubscribeRef.current) {
                try {
                    typingUnsubscribeRef.current();
                } catch (error) {
                    console.error('Error unsubscribing from typing:', error);
                } finally {
                    typingUnsubscribeRef.current = null;
                }
            }
        };
    }, []);

    // Subscribe to messages
    useEffect(() => {
        if (!conversationId || !db) {
            if (isMountedRef.current) {
                setMessages([]);
                setHasMoreMessages(false);
                setOldestMessageTimestamp(null);
            }
            return;
        }

        // Cleanup previous listener
        if (messagesUnsubscribeRef.current) {
            messagesUnsubscribeRef.current();
            messagesUnsubscribeRef.current = null;
        }

        const messagesRef = ref(db, `conversations/${conversationId}/messages`);
        const messagesQuery = query(messagesRef, limitToLast(messagesPerPage));

        const unsubscribe = onValue(
            messagesQuery,
            (snapshot) => {
                if (!isMountedRef.current) return;

                const data = snapshot.val();
                if (!data) {
                    if (isMountedRef.current) {
                        setMessages([]);
                        setHasMoreMessages(false);
                        setOldestMessageTimestamp(null);
                    }
                    return;
                }

                const msgs: LocalMessage[] = Object.keys(data).map((messageId) => {
                    const messageData = data[messageId];
                    return {
                        id: messageId,
                        senderId: messageData.senderId || '',
                        receiverId: messageData.receiverId || '',
                        text: messageData.text || '',
                        createdAt: messageData.createdAt ? new Date(messageData.createdAt) : null,
                        isRead: !!messageData.isRead,
                        deliveryStatus: messageData.deliveryStatus || (messageData.isRead ? 'read' : 'sent'),
                    } as LocalMessage;
                }).sort((a, b) => {
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return timeA - timeB;
                });

                if (isMountedRef.current) {
                    setMessages(msgs);
                    setHasMoreMessages(msgs.length >= messagesPerPage);

                    if (msgs.length > 0) {
                        const oldestMsg = msgs[0];
                        setOldestMessageTimestamp(oldestMsg.createdAt ? new Date(oldestMsg.createdAt).getTime() : null);
                    } else {
                        setOldestMessageTimestamp(null);
                    }
                }

                // Mark messages as read
                if (currentUserId) {
                    Object.keys(data).forEach(async (messageId) => {
                        const messageData = data[messageId];
                        if (String(messageData.receiverId) === String(currentUserId) && !messageData.isRead) {
                            try {
                                const messageRef = ref(db, `conversations/${conversationId}/messages/${messageId}`);
                                const { update } = await import('firebase/database');
                                await update(messageRef, {
                                    isRead: true,
                                    deliveryStatus: 'read',
                                    readAt: Date.now()
                                });
                            } catch (error) {
                                console.error('Error marking message as read:', error);
                            }
                        }
                    });
                }
            },
            (err) => {
                console.error('Error fetching messages:', err);
            }
        );

        messagesUnsubscribeRef.current = () => off(messagesRef, 'value', unsubscribe);

        return () => {
            if (messagesUnsubscribeRef.current) {
                messagesUnsubscribeRef.current();
                messagesUnsubscribeRef.current = null;
            }
        };
    }, [conversationId, db, currentUserId, messagesPerPage]);

    // Load more messages (pagination)
    const loadMoreMessages = async () => {
        if (!conversationId || !db || isLoadingMore || !hasMoreMessages || !oldestMessageTimestamp) {
            return;
        }

        setIsLoadingMore(true);

        try {
            const messagesRef = ref(db, `conversations/${conversationId}/messages`);
            const olderMessagesQuery = query(
                messagesRef,
                orderByChild('createdAt'),
                endBefore(oldestMessageTimestamp),
                limitToLast(messagesPerPage)
            );

            const snapshot = await get(olderMessagesQuery);
            const data = snapshot.val();

            if (data && isMountedRef.current) {
                const olderMsgs: LocalMessage[] = Object.keys(data).map((messageId) => {
                    const messageData = data[messageId];
                    return {
                        id: messageId,
                        senderId: messageData.senderId || '',
                        receiverId: messageData.receiverId || '',
                        text: messageData.text || '',
                        createdAt: messageData.createdAt ? new Date(messageData.createdAt) : null,
                        isRead: !!messageData.isRead,
                        deliveryStatus: messageData.deliveryStatus || (messageData.isRead ? 'read' : 'sent'),
                    } as LocalMessage;
                }).sort((a, b) => {
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return timeA - timeB;
                });

                setMessages(prev => [...olderMsgs, ...prev]);

                if (olderMsgs.length > 0) {
                    const newOldest = olderMsgs[0];
                    setOldestMessageTimestamp(newOldest.createdAt ? new Date(newOldest.createdAt).getTime() : null);
                    setHasMoreMessages(olderMsgs.length >= messagesPerPage);
                } else {
                    setHasMoreMessages(false);
                }
            } else {
                if (isMountedRef.current) {
                    setHasMoreMessages(false);
                }
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            if (isMountedRef.current) {
                setIsLoadingMore(false);
            }
        }
    };

    return {
        messages,
        hasMoreMessages,
        isLoadingMore,
        loadMoreMessages,
        isOtherUserTyping
    };
}
