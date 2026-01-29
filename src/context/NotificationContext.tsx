'use client';

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './UserContext';
import { authCookies } from '@/utils/cookies';

// Define the shape of a notification object
export interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    type?: string;
    created_at?: string;
    related_id?: number;      // ID of the related entity (e.g., projects_task_id, applied_projects_id)
    related_type?: string;    // Type of related entity (e.g., 'projects_task', 'applied_projects')
    // Add other fields as needed based on your DB schema
}

// Define the context interface
interface NotificationContextType {
    unreadCount: number;
    notifications: Notification[];
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { userData } = useUser();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const socketRef = useRef<Socket | null>(null);

    // Use the environment variable for the API URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // 1. Initial Data Fetch & Connection Setup
    useEffect(() => {
        // Only connect if we have a user
        if (!userData?.user_id) {
            setNotifications([]);
            setUnreadCount(0);
            setIsLoading(false);
            return;
        }

        // --- A. Connection Setup ---
        // Initialize Socket.IO connection
        // We pass user_id in the query params as requested
        socketRef.current = io(API_URL, {
            auth: {
                token: authCookies.getToken()
            },
            query: {
                user_id: userData.user_id,
            },
            transports: ['websocket', 'polling'], // Start with websocket, fallback to polling
            reconnectionAttempts: 5,
        });

        const socket = socketRef.current;

        // Connection events
        socket.on('connect', () => {
            // Socket connected successfully
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
        });

        socket.on('disconnect', (reason) => {
            console.warn('⚠️ Socket disconnected:', reason);
        });

        // --- B. Real-time Listeners ---
        // Listen for 'new_notification' event from backend
        socket.on('new_notification', (payload: any) => {
            // Play sound (optional)
            try {
                const audio = new Audio('/assets/dashboard/sound/notification.mp3'); // Ensure this file exists or use a CDN
                audio.play().catch(e => {
                    // Ignore audio errors
                });
            } catch (e) {
                // Ignore audio errors
            }

            // Update state
            setUnreadCount((prev) => prev + 1);

            // If payload is a full notification object, add it to the list
            // Otherwise, we might need to fetch the latest, but for now let's assume payload is the notification
            const newNotification: Notification = {
                id: payload.id || Date.now(), // Fallback ID if missing
                title: payload.title || 'New Notification',
                message: payload.message || payload.content || '',
                is_read: false,
                created_at: new Date().toISOString(),
                ...payload
            };

            setNotifications((prev) => [newNotification, ...prev]);
        });

        // --- C. Initial Sync ---
        // Fetch unread count and latest notifications
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const token = authCookies.getToken();

                // Fetch unread count
                // Correct Endpoint: GET /api/v1/notification/my-count
                const countRes = await fetch(`${API_URL}/api/v1/notification/my-count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (countRes.ok) {
                    const data = await countRes.json();
                    setUnreadCount(typeof data.data === 'number' ? data.data : (data.count || 0));
                }

                // Fetch recent notifications list
                // Correct Endpoint: GET /api/v1/notification/my-notifications
                const listRes = await fetch(`${API_URL}/api/v1/notification/my-notifications`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (listRes.ok) {
                    const data = await listRes.json();
                    // Assuming data.data is the array
                    setNotifications(data.data || []);
                }

            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [userData?.user_id, API_URL]);


    // Mark a single notification as read
    const markAsRead = async (id: number) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            ));

            if (unreadCount > 0) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            // API Call
            const token = authCookies.getToken();
            await fetch(`${API_URL}/api/v1/notification/read/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            // Revert optimistic update if needed (omitted for simplicity)
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);

            const token = authCookies.getToken();
            await fetch(`${API_URL}/api/v1/notification/read-all`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    }

    return (
        <NotificationContext.Provider value={{ unreadCount, notifications, markAsRead, markAllAsRead, isLoading }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
