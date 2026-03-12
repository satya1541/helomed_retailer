import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRetailerAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useRetailerAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsConnected(false);
            return;
        }

        const token = localStorage.getItem('helo_med_retailer_token');
        if (!token) return;

        const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'https://helo.thynxai.cloud';

        // Option A: Pass token in auth object for automatic room joining
        const newSocket = io(SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        newSocket.on('connect', () => {
            console.log('Socket connected with ID:', newSocket.id);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connect error:', err);
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.off('connect_error');
            newSocket.disconnect();
        };
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
