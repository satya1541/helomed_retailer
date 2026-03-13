import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface AppNotification {
    id: string;
    type: 'new_order' | 'delivery_assigned' | 'delivery_arrived' | 'order_update';
    title: string;
    message: string;
    orderId?: number;
    orderNumber?: string;
    timestamp: Date;
    read: boolean;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    addNotification: () => { },
    markAsRead: () => { },
    markAllAsRead: () => { },
    removeNotification: () => { },
    clearAll: () => { },
});

const STORAGE_KEY = 'helo_med_retailer_notifications';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize notifications from localStorage
    const [notifications, setNotifications] = useState<AppNotification[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];
        try {
            const parsed = JSON.parse(saved);
            // Revitalize Date objects
            return parsed.map((n: any) => ({
                ...n,
                timestamp: new Date(n.timestamp)
            }));
        } catch (e) {
            console.error('Failed to parse saved notifications:', e);
            return [];
        }
    });

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: AppNotification = {
            ...notification,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);

        // Play notification sound
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            osc.type = 'sine';
            gain.gain.value = 0.3;
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.frequency.value = 1100;
                osc2.type = 'sine';
                gain2.gain.value = 0.3;
                osc2.start();
                osc2.stop(ctx.currentTime + 0.2);
            }, 200);
        } catch (e) {
            // Audio not supported
        }
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            clearAll,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
