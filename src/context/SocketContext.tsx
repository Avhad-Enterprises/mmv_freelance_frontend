"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authCookies } from '@/utils/cookies';
import { useUser } from '@/context/UserContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Get user from context to ensure we only connect when user is logged in
    // However, for the token we use cookies directly to avoid race conditions or missing data context
    const { userData } = useUser();

    useEffect(() => {
        const token = authCookies.getToken();

        if (token && userData?.user_id) {
            // Initialize socket
            const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', {
                path: '/socket.io',
                auth: {
                    token: token
                },
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketInstance.on('connect', () => {
                console.log('✅ Socket connected');
                setIsConnected(true);
            });

            socketInstance.on('disconnect', () => {
                console.log('❌ Socket disconnected');
                setIsConnected(false);
            });

            socketInstance.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
                setIsConnected(false);
            });

            setSocket(socketInstance);

            return () => {
                socketInstance.disconnect();
            };
        } else {
            // Disconnect if no token or user
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [userData?.user_id]); // Re-connect only if user changes

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
