import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, ShoppingBag, Truck, MapPin, RefreshCw, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/context/NotificationContext';
import type { AppNotification } from '@/context/NotificationContext';

const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
        case 'new_order': return <ShoppingBag size={16} />;
        case 'delivery_assigned': return <Truck size={16} />;
        case 'delivery_arrived': return <MapPin size={16} />;
        case 'order_update': return <RefreshCw size={16} />;
        default: return <Bell size={16} />;
    }
};

const getNotificationColor = (type: AppNotification['type']) => {
    switch (type) {
        case 'new_order': return { bg: '#dcfce7', border: '#86efac', icon: '#16a34a' };
        case 'delivery_assigned': return { bg: '#dbeafe', border: '#93c5fd', icon: '#2563eb' };
        case 'delivery_arrived': return { bg: '#fef3c7', border: '#fcd34d', icon: '#d97706' };
        case 'order_update': return { bg: '#f3e8ff', border: '#c4b5fd', icon: '#7c3aed' };
        default: return { bg: '#f5f5f5', border: '#e5e5e5', icon: '#525252' };
    }
};

const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
};

export const NotificationBell = () => {
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const panelRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);

    // Handle resize to update isMobile
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target as Node) &&
                bellRef.current && !bellRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification: AppNotification) => {
        markAsRead(notification.id);

        if (notification.orderId) {
            setIsOpen(false);
            navigate(`/orders?openOrder=${notification.orderId}`);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Bell Button */}
            <button
                ref={bellRef}
                onClick={() => setIsOpen(prev => !prev)}
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    border: '1px solid #e5e5e5',
                    background: isOpen ? '#f5f5f5' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    zIndex: isOpen ? 1001 : 1,
                }}
            >
                <Bell size={18} color="#525252" />
                {/* Badge */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            style={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                minWidth: 18,
                                height: 18,
                                borderRadius: 9,
                                background: '#dc2626',
                                color: 'white',
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 4px',
                                border: '2px solid white',
                                lineHeight: 1,
                            }}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={panelRef}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: isMobile ? -56 : 0, // Offset horizontally on mobile to keep it centered or visible
                            width: isMobile ? 'calc(100vw - 32px)' : 380,
                            maxWidth: isMobile ? 380 : 'unset',
                            background: 'white',
                            borderRadius: 12,
                            border: '1px solid #e5e5e5',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06)',
                            zIndex: 1000,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Panel Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            borderBottom: '1px solid #f0f0f0',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#171717' }}>
                                    Notifications
                                </span>
                                {unreadCount > 0 && (
                                    <span style={{
                                        background: '#dc2626',
                                        color: 'white',
                                        fontSize: '0.6875rem',
                                        fontWeight: 600,
                                        padding: '1px 7px',
                                        borderRadius: 10,
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: 4 }}>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 4,
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            fontSize: '0.75rem', color: '#16a34a', fontWeight: 500,
                                            padding: '4px 8px', borderRadius: 6,
                                        }}
                                        title="Mark all as read"
                                    >
                                        <Check size={12} /> Read all
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 4,
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            fontSize: '0.75rem', color: '#a3a3a3', fontWeight: 500,
                                            padding: '4px 8px', borderRadius: 6,
                                        }}
                                        title="Clear all"
                                    >
                                        <Trash2 size={12} /> Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div style={{
                            maxHeight: 420,
                            overflowY: 'auto',
                        }}>
                            {notifications.length === 0 ? (
                                <div style={{
                                    padding: '40px 16px',
                                    textAlign: 'center',
                                    color: '#a3a3a3',
                                }}>
                                    <Bell size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
                                    <p style={{ fontSize: '0.875rem', margin: 0 }}>No notifications yet</p>
                                    <p style={{ fontSize: '0.75rem', margin: '4px 0 0' }}>
                                        New orders and updates will appear here
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification) => {
                                    const colors = getNotificationColor(notification.type);
                                    return (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            onClick={() => handleNotificationClick(notification)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 12,
                                                padding: '12px 16px',
                                                cursor: notification.orderId ? 'pointer' : 'default',
                                                borderBottom: '1px solid #f5f5f5',
                                                background: notification.read ? 'white' : '#fafffe',
                                                borderLeft: notification.read ? 'none' : `3px solid ${colors.icon}`,
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = notification.read ? 'white' : '#fafffe'; }}
                                        >
                                            {/* Icon */}
                                            <div style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                background: colors.bg,
                                                border: `1px solid ${colors.border}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                color: colors.icon,
                                            }}>
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    gap: 8,
                                                }}>
                                                    <span style={{
                                                        fontWeight: notification.read ? 500 : 600,
                                                        fontSize: '0.8125rem',
                                                        color: '#171717',
                                                        lineHeight: 1.3,
                                                    }}>
                                                        {notification.title}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeNotification(notification.id);
                                                        }}
                                                        style={{
                                                            background: 'none', border: 'none', cursor: 'pointer',
                                                            padding: 2, flexShrink: 0, opacity: 0.4,
                                                            transition: 'opacity 0.15s',
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4'; }}
                                                    >
                                                        <X size={12} color="#737373" />
                                                    </button>
                                                </div>
                                                <p style={{
                                                    fontSize: '0.75rem',
                                                    color: '#737373',
                                                    margin: '2px 0 0',
                                                    lineHeight: 1.4,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {notification.message}
                                                </p>
                                                <span style={{
                                                    fontSize: '0.6875rem',
                                                    color: '#a3a3a3',
                                                    marginTop: 4,
                                                    display: 'block',
                                                }}>
                                                    {formatTimeAgo(notification.timestamp)}
                                                </span>
                                            </div>

                                            {/* Unread dot */}
                                            {!notification.read && (
                                                <span style={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    background: colors.icon,
                                                    flexShrink: 0,
                                                    marginTop: 6,
                                                }} />
                                            )}
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
