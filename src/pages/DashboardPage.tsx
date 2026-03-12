import { useEffect, useState, useCallback } from 'react';
import { useRetailerAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useNotifications } from '@/context/NotificationContext';
import { TrendingUp, ShoppingBag, IndianRupee, Package, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRetailerOrders } from '@/api/orders';
import { getRetailerProducts } from '@/api/products';
import { getRetailerEarningsToday, getRetailerEarningsTotal } from '@/api/payments';
import { ORDER_STATUS_LABELS } from '@/constants';
import './Modern.css';

const RetailerDashboardPage = () => {
    const { retailer } = useRetailerAuth();
    const { socket } = useSocket();
    const { addNotification } = useNotifications();
    const [liveToast, setLiveToast] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [todayEarnings, setTodayEarnings] = useState<number>(0);
    const [totalEarnings, setTotalEarnings] = useState<number>(0);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    const fetchDashboardData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const [ordersRes, productsRes, earningsTodayRes, earningsTotalRes] = await Promise.allSettled([
                getRetailerOrders({ page: 1, limit: 5 }),
                getRetailerProducts(1, 1),
                getRetailerEarningsToday(),
                getRetailerEarningsTotal(),
            ]);

            if (ordersRes.status === 'fulfilled') {
                const data = ordersRes.value;
                const orders = data?.orders || data?.data || data || [];
                const ordersArray = Array.isArray(orders) ? orders : [];
                setRecentOrders(ordersArray.slice(0, 5));
                setTotalOrders(data?.pagination?.total || data?.total || ordersArray.length);
            }

            if (productsRes.status === 'fulfilled') {
                const data = productsRes.value;
                setTotalProducts(data?.pagination?.total || data?.total || 0);
            }

            if (earningsTodayRes.status === 'fulfilled') {
                const data = earningsTodayRes.value;
                setTodayEarnings(data?.total || data?.earnings || data?.amount || 0);
            }

            if (earningsTotalRes.status === 'fulfilled') {
                const data = earningsTotalRes.value;
                setTotalEarnings(data?.total || data?.earnings || data?.amount || 0);
            }
        } catch (err) {
            console.error('Dashboard data fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Listen for new_order socket event to auto-refresh dashboard
    useEffect(() => {
        if (!socket) return;

        const handleNewOrder = (payload: any) => {
            console.log('🆕 [Dashboard] New order received:', payload);

            // Auto-refresh dashboard data
            fetchDashboardData(true);

            setLiveToast(`🛒 New order received! #${payload.order_number || payload.order_id}`);
            setTimeout(() => setLiveToast(null), 5000);

            // Push to global notification bell
            addNotification({
                type: 'new_order',
                title: 'New Order Received',
                message: `Order #${payload.order_number || payload.order_id} — ₹${payload.total_amount || 0}`,
                orderId: payload.order_id,
                orderNumber: payload.order_number,
            });
        };

        socket.on('new_order', handleNewOrder);
        return () => {
            socket.off('new_order', handleNewOrder);
        };
    }, [socket, fetchDashboardData, addNotification]);

    const getStatusLabel = (status: number) => {
        return (ORDER_STATUS_LABELS as Record<number, string>)[status] || `Status ${status}`;
    };

    const formatTime = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
            </div>
        );
    }

    const stats = [
        {
            label: "Today's Earnings",
            value: `₹${todayEarnings.toLocaleString()}`,
            icon: <IndianRupee size={20} />,
            change: "+12%",
            positive: true
        },
        {
            label: "Total Orders",
            value: totalOrders.toString(),
            icon: <ShoppingBag size={20} />,
            change: "+8",
            positive: true
        },
        {
            label: "Products Listed",
            value: totalProducts.toString(),
            icon: <Package size={20} />,
            change: "Active",
            positive: true
        },
        {
            label: "Total Revenue",
            value: `₹${totalEarnings.toLocaleString()}`,
            icon: <TrendingUp size={20} />,
            change: "+24%",
            positive: true
        }
    ];

    return (
        <div className="modern-page">
            {/* Live toast notification for new orders */}
            <AnimatePresence>
                {liveToast && (
                    <motion.div
                        key="dashboard-toast"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            background: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.25)',
                            color: '#15803d',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            marginBottom: '12px'
                        }}
                    >
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                        {liveToast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div 
                className="modern-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="modern-header-content">
                    <h1>Dashboard</h1>
                    <p>Welcome back, {retailer?.owner_name || retailer?.shop_name || 'Retailer'}. Here's your store overview.</p>
                </div>
                <motion.button
                    className="btn btn-outline"
                    onClick={() => fetchDashboardData(true)}
                    disabled={refreshing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <RefreshCw size={16} className={refreshing ? 'loading-spinner' : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </motion.button>
            </motion.div>

            {/* Stats Grid */}
            <div className="modern-grid modern-grid-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">{stat.label}</span>
                                <div className="stat-icon">
                                    {stat.icon}
                                </div>
                            </div>
                            <h2 className="stat-value">{stat.value}</h2>
                            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
            >
                <div className="modern-card">
                    <div className="modern-card-header">
                        <div>
                            <h3 className="modern-card-title">Recent Orders</h3>
                            <p className="modern-card-subtitle">Latest transactions from your store</p>
                        </div>
                    </div>
                    {recentOrders.length > 0 ? (
                        <div className="modern-table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => {
                                        const status = order.order_status ?? order.status;
                                        return (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <td>
                                                    <span className="font-semibold">#{order.id}</span>
                                                </td>
                                                <td>
                                                    {order.customer_name || order.user_name || 'Customer'}
                                                </td>
                                                <td>
                                                    {order.items?.length || order.item_count || 0} items
                                                </td>
                                                <td>
                                                    <span className="font-semibold">₹{order.total_amount || 0}</span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${getStatusLabel(status).toLowerCase().replace(/\s+/g, '-')}`}>
                                                        {getStatusLabel(status)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="text-sm" style={{ color: '#737373' }}>
                                                        {formatTime(order.created_at || order.createdAt)}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <ShoppingBag size={32} />
                            </div>
                            <h3 className="empty-state-title">No orders yet</h3>
                            <p className="empty-state-description">
                                Orders will appear here once customers start placing them.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default RetailerDashboardPage;
