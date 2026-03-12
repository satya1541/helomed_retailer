import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, ShoppingBag, Filter, Search, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRetailerOrderDetails, getRetailerOrders, updateRetailerOrderStatus } from '@/api/orders';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@/constants';
import { useSocket } from '@/context/SocketContext';
import { useNotifications } from '@/context/NotificationContext';
import './Modern.css';

const RetailerOrdersPage = () => {
    const { socket, isConnected } = useSocket();
    const { addNotification } = useNotifications();
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState<any[]>([]);
    const [allOrdersForSearch, setAllOrdersForSearch] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [flashIds, setFlashIds] = useState<Set<number>>(new Set());
    const [liveToast, setLiveToast] = useState<string | null>(null);

    const extractOrders = (payload: any): any[] => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.orders)) return payload?.orders;
        if (Array.isArray(payload?.data?.orders)) return payload?.data?.orders;
        if (Array.isArray(payload?.data)) return payload?.data;
        if (Array.isArray(payload?.items)) return payload?.items;
        return [];
    };

    const extractTotal = (payload: any): number => {
        return payload?.total || payload?.data?.total || payload?.meta?.total || 0;
    };

    const getOrderStatusLabel = (status: number) => {
        return ORDER_STATUS_LABELS[status] || `Status ${status}`;
    };

    const getStatusBadgeClass = (status: number): string => {
        const statusMap: Record<number, string> = {
            0: 'pending',
            1: 'placed',
            2: 'accepted',
            3: 'rejected',
            4: 'preparing',
            5: 'ready',
            6: 'delivery',
            7: 'delivered',
            8: 'cancelled'
        };
        return statusMap[status] || 'pending';
    };

    const getAvailableActions = (status?: number) => {
        const map: Record<number, Array<{ label: string; value: number }>> = {
            1: [
                { label: 'Accept', value: 2 },
                { label: 'Reject', value: 3 }
            ],
            2: [{ label: 'Prepare', value: 4 }],
            4: [{ label: 'Ready', value: 5 }]
        };
        if (typeof status !== 'number') return [];
        return map[status] || [];
    };

    const normalizeOrderDetails = (payload: any, fallback: any) => {
        const root = payload?.data ?? payload ?? {};
        const base = root?.order ?? root;
        return {
            ...fallback,
            ...base,
            id: base?.id ?? fallback?.id ?? fallback?.order_id,
            order_number: base?.order_number ?? fallback?.order_number,
            order_status: base?.order_status ?? fallback?.order_status,
            total_amount: base?.total_amount ?? fallback?.total_amount,
            items: root?.items ?? base?.items ?? fallback?.items ?? [],
            totals: root?.totals ?? base?.totals ?? fallback?.totals
        };
    };

    const getOrderDate = (order: any): string => {
        if (order.accepted_at) {
            return new Date(order.accepted_at).toLocaleDateString();
        }
        
        if (order.order_number) {
            const match = order.order_number.match(/ORD(\d{13})/);
            if (match) {
                const timestamp = parseInt(match[1]);
                return new Date(timestamp).toLocaleDateString();
            }
        }
        
        if (order.items && order.items.length > 0 && order.items[0].createdAt) {
            return new Date(order.items[0].createdAt).toLocaleDateString();
        }
        
        return '--';
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                limit: 20
            };
            if (statusFilter) params.order_status = Number(statusFilter);
            if (startDate) params.from = startDate;
            if (endDate) params.to = endDate;

            console.log('🔍 Status Filter Value:', statusFilter);
            console.log('📤 Fetching orders with params:', params);

            const data = await getRetailerOrders(params);
            const list = extractOrders(data);
            const total = extractTotal(data);

            console.log('📥 Orders received:', list.length, 'Total:', total);
            console.log('📊 First order status:', list[0]?.order_status);
            
            if (statusFilter && list.length > 0) {
                const targetStatus = Number(statusFilter);
                const matchingCount = list.filter(o => (o.order_status ?? o.status) === targetStatus).length;
                if (matchingCount === 0) {
                    console.warn('⚠️ Backend returned 0 orders matching status', targetStatus, '- filtering client-side');
                }
            }

            setOrders(list);
            setTotalPages(Math.ceil(total / 20) || 1);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setNotice({ type: 'error', text: 'Failed to load orders. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllOrdersForSearch = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: 1,
                limit: 5000
            };
            if (statusFilter) params.order_status = Number(statusFilter);
            if (startDate) params.from = startDate;
            if (endDate) params.to = endDate;

            console.log('🔍 Fetching all orders for search with limit 5000');

            const data = await getRetailerOrders(params);
            const list = extractOrders(data);

            console.log('📥 All orders received for search:', list.length);

            setAllOrdersForSearch(list);
            setIsSearchMode(true);
        } catch (error) {
            console.error('Error fetching all orders:', error);
            setNotice({ type: 'error', text: 'Failed to load orders for search. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Flash a row highlight for 2s then clear
    const flashRow = useCallback((orderId: number) => {
        setFlashIds(prev => new Set(prev).add(orderId));
        setTimeout(() => {
            setFlashIds(prev => {
                const next = new Set(prev);
                next.delete(orderId);
                return next;
            });
        }, 2000);
    }, []);

    // Real-time WebSocket listener
    useEffect(() => {
        if (!socket) return;

        // Existing: order status updated
        const handleOrderUpdate = (data: { order_id: number; order_status: number }) => {
            const { order_id, order_status } = data;

            setOrders(prev => {
                const found = prev.some(o => o.id === order_id || o.order_id === order_id);
                if (!found) {
                    // New order not in current page — refresh
                    fetchOrders();
                    return prev;
                }
                return prev.map(o =>
                    o.id === order_id || o.order_id === order_id
                        ? { ...o, order_status }
                        : o
                );
            });

            setAllOrdersForSearch(prev =>
                prev.map(o =>
                    o.id === order_id || o.order_id === order_id
                        ? { ...o, order_status }
                        : o
                )
            );

            setSelectedOrder((prev: any) =>
                prev && (prev.id === order_id || prev.order_id === order_id)
                    ? { ...prev, order_status }
                    : prev
            );

            flashRow(order_id);

            const label = ORDER_STATUS_LABELS[order_status] || `Status ${order_status}`;
            setLiveToast(`Order updated → ${label}`);
            setTimeout(() => setLiveToast(null), 3000);
        };

        // NEW: new_order — a new order was placed for this retailer
        const handleNewOrder = (payload: any) => {
            console.log('🆕 New order received:', payload);

            // Prepend the new order to the list
            const newOrder = {
                id: payload.order_id,
                order_id: payload.order_id,
                order_number: payload.order_number,
                order_status: payload.order_status,
                total_amount: payload.total_amount,
                items: payload.items,
                created_at: payload.created_at,
                payment_mode: payload.payment_mode,
                payment_status: payload.payment_status,
            };

            setOrders(prev => [newOrder, ...prev]);
            setAllOrdersForSearch(prev => [newOrder, ...prev]);
            flashRow(payload.order_id);

            setLiveToast(`🛒 New order received! #${payload.order_number || payload.order_id}`);
            setTimeout(() => setLiveToast(null), 5000);

            // Push to global notification bell
            addNotification({
                type: 'new_order',
                title: 'New Order Received',
                message: `Order #${payload.order_number || payload.order_id} — ₹${payload.total_amount || 0} (${payload.item_count || payload.items?.length || 0} items)`,
                orderId: payload.order_id,
                orderNumber: payload.order_number,
            });
        };

        // NEW: order_assigned_to_delivery — delivery partner accepted
        const handleDeliveryAssigned = (payload: any) => {
            console.log('🚴 Delivery partner assigned:', payload);

            const partnerName = payload.delivery_partner?.name || 'A delivery partner';
            setLiveToast(`🚴 ${partnerName} assigned to order #${payload.order_number || payload.order_id}`);
            setTimeout(() => setLiveToast(null), 4000);

            addNotification({
                type: 'delivery_assigned',
                title: 'Delivery Partner Assigned',
                message: `${partnerName} is assigned to pick up order #${payload.order_number || payload.order_id}`,
                orderId: payload.order_id,
                orderNumber: payload.order_number,
            });
        };

        // NEW: delivery_partner_arrived — driver arrived at shop
        const handleDeliveryArrived = (payload: any) => {
            console.log('📍 Delivery partner arrived:', payload);

            const partnerName = payload.delivery_partner?.name || 'Delivery partner';
            setLiveToast(`📍 ${partnerName} has arrived to pick up order #${payload.order_number || payload.order_id}`);
            setTimeout(() => setLiveToast(null), 5000);

            addNotification({
                type: 'delivery_arrived',
                title: 'Driver Has Arrived!',
                message: `${partnerName} is at your shop for order #${payload.order_number || payload.order_id}`,
                orderId: payload.order_id,
                orderNumber: payload.order_number,
            });
        };

        socket.on('order_status_updated', handleOrderUpdate);
        socket.on('new_order', handleNewOrder);
        socket.on('order_assigned_to_delivery', handleDeliveryAssigned);
        socket.on('delivery_partner_arrived', handleDeliveryArrived);

        return () => {
            socket.off('order_status_updated', handleOrderUpdate);
            socket.off('new_order', handleNewOrder);
            socket.off('order_assigned_to_delivery', handleDeliveryAssigned);
            socket.off('delivery_partner_arrived', handleDeliveryArrived);
        };
    }, [socket, flashRow, addNotification]);

    // Auto-open order details when navigating via ?openOrder= URL param
    useEffect(() => {
        const openOrderId = searchParams.get('openOrder');
        if (openOrderId && !loading) {
            const orderId = Number(openOrderId);
            // Clear the URL param so it doesn't re-trigger
            setSearchParams({}, { replace: true });
            // Find and open the order
            const order = orders.find(o => (o.id === orderId || o.order_id === orderId));
            if (order) {
                handleView(order);
            } else {
                // Order not on current page — try to fetch it directly
                (async () => {
                    try {
                        const details = await getRetailerOrderDetails(orderId);
                        setSelectedOrder(normalizeOrderDetails(details, { id: orderId }));
                    } catch {
                        setNotice({ type: 'error', text: `Could not find order #${orderId}` });
                    }
                })();
            }
        }
    }, [searchParams, loading, orders]);

    useEffect(() => {
        setNotice(null);
        
        // Debounce search with 500ms delay
        const debounceTimer = setTimeout(() => {
            if (searchQuery.trim()) {
                // When searching, fetch all orders
                if (!isSearchMode) {
                    fetchAllOrdersForSearch();
                }
            } else {
                // When search is cleared, go back to normal pagination
                if (isSearchMode) {
                    setIsSearchMode(false);
                    fetchOrders();
                }
            }
        }, 1000);

        // Cleanup function - cancel timer if searchQuery changes before 500ms
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    useEffect(() => {
        setNotice(null);
        if (!isSearchMode) {
            fetchOrders();
        }
    }, [page, statusFilter, startDate, endDate]);

    // Filter orders by search query and status (client-side fallback since backend doesn't filter)
    const filteredOrders = useMemo(() => {
        // Use all orders when searching, otherwise use paginated orders
        let filtered = isSearchMode ? allOrdersForSearch : orders;
        
        // Filter by status first (backend fallback)
        if (statusFilter) {
            const targetStatus = Number(statusFilter);
            filtered = filtered.filter((order) => {
                const orderStatus = order.order_status ?? order.status;
                return orderStatus === targetStatus;
            });
        }
        
        // Then filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((order) => {
                const orderNumber = (order.order_number || '').toLowerCase();
                const totalAmount = (order.total_amount || '').toString();
                const userName = (order.user?.name || '').toLowerCase();
                const userPhone = (order.user?.phone || '').toString();
                return orderNumber.includes(query) || 
                       totalAmount.includes(query) ||
                       userName.includes(query) ||
                       userPhone.includes(query);
            });
        }
        
        return filtered;
    }, [orders, allOrdersForSearch, searchQuery, statusFilter, isSearchMode]);

    const handleView = async (order: any) => {
        try {
            const details = await getRetailerOrderDetails(order.id || order.order_id);
            setSelectedOrder(normalizeOrderDetails(details, order));
        } catch (error) {
            setSelectedOrder(normalizeOrderDetails(order, order));
        }
    };

    const handleStatusChange = async (orderId: number, status: number) => {
        setActionLoading(true);
        setNotice(null);
        try {
            await updateRetailerOrderStatus(orderId, { order_status: status });
            
            // Update order status locally without refetching
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId || order.order_id === orderId
                        ? { ...order, order_status: status }
                        : order
                )
            );
            
            // Also update search orders if in search mode
            if (isSearchMode) {
                setAllOrdersForSearch(prevOrders => 
                    prevOrders.map(order => 
                        order.id === orderId || order.order_id === orderId
                            ? { ...order, order_status: status }
                            : order
                    )
                );
            }
            
            // Update selected order
            setSelectedOrder((prev: any) => prev ? { ...prev, order_status: status } : null);
            
            setNotice({ type: 'success', text: 'Order status updated successfully!' });
            
            setTimeout(() => {
                setSelectedOrder(null);
                setNotice(null);
            }, 1500);
        } catch (error: any) {
            setNotice({ type: 'error', text: error?.response?.data?.message || 'Failed to update order status.' });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && page === 1) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="modern-page">
            {/* Header */}
            <motion.div 
                className="modern-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="modern-header-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                            <h1>Orders</h1>
                            <p>Track and update order status.</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: isConnected ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)',
                            color: isConnected ? '#16a34a' : '#dc2626',
                            border: `1px solid ${isConnected ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`,
                            transition: 'all 0.4s'
                        }}>
                            {isConnected ? (
                                <>
                                    <span style={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: '50%',
                                        background: '#22c55e',
                                        boxShadow: '0 0 0 0 rgba(34,197,94,0.6)',
                                        animation: 'liveping 1.5s infinite'
                                    }} />
                                    <Wifi size={12} />
                                    Live
                                </>
                            ) : (
                                <>
                                    <WifiOff size={12} />
                                    Offline
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Live toast notification */}
            <AnimatePresence>
                {liveToast && (
                    <motion.div
                        key="live-toast"
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.25)',
                            color: '#15803d',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            marginBottom: '4px'
                        }}
                    >
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                        {liveToast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <div className="filters-bar">
                    <div className="search-bar" style={{ flex: '1 1 300px', maxWidth: '350px' }}>
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search by order number or price..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <Filter size={16} />
                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setSearchQuery('');
                                setPage(1);
                            }}
                        >
                            <option value="">All Statuses</option>
                            {Object.values(ORDER_STATUS).sort((a, b) => a - b).map((status) => (
                                <option key={status} value={String(status)}>
                                    {ORDER_STATUS_LABELS[status]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input
                        className="form-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setSearchQuery('');
                            setPage(1);
                        }}
                        placeholder="Start Date"
                    />
                    <input
                        className="form-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setSearchQuery('');
                            setPage(1);
                        }}
                        placeholder="End Date"
                    />
                </div>
            </motion.div>

            {/* Notice */}
            {notice && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`modern-alert modern-alert-${notice.type === 'success' ? 'success' : 'error'}`}
                >
                    {notice.text}
                    <button 
                        onClick={() => setNotice(null)} 
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0.5rem' }}
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            )}

            {/* Active Filters Indicator */}
            {(statusFilter || startDate || endDate || searchQuery) && orders.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: '0.875rem', color: '#737373', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}
                >
                    <span>Showing {filteredOrders.length} of {orders.length} orders •</span>
                    {statusFilter && <span className="badge badge-secondary">Status: {ORDER_STATUS_LABELS[Number(statusFilter)]}</span>}
                    {startDate && <span className="badge badge-secondary">From: {startDate}</span>}
                    {endDate && <span className="badge badge-secondary">To: {endDate}</span>}
                    {searchQuery && <span className="badge badge-secondary">Search: "{searchQuery}"</span>}
                    <button 
                        className="btn-ghost" 
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('');
                            setStartDate('');
                            setEndDate('');
                            setPage(1);
                        }}
                        style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }}
                    >
                        Clear all
                    </button>
                </motion.div>
            )}

            {/* Orders Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="modern-card">
                    {filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <ShoppingBag size={32} />
                            </div>
                            <h3 className="empty-state-title">No orders found</h3>
                            <p className="empty-state-description">
                                {searchQuery 
                                    ? 'No orders match your search.' 
                                    : (statusFilter || startDate || endDate) 
                                        ? 'No orders match the selected filters. Try adjusting your filter criteria.' 
                                        : 'Orders will appear here once customers place them.'}
                            </p>
                            {(searchQuery || statusFilter || startDate || endDate) && (
                                <button 
                                    className="btn btn-outline btn-sm" 
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('');
                                        setStartDate('');
                                        setEndDate('');
                                        setPage(1);
                                    }}
                                    style={{ marginTop: '1rem' }}
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="modern-table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Order Number</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <motion.tr
                                            key={order.id || order.order_id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                backgroundColor: flashIds.has(order.id || order.order_id)
                                                    ? ['#f0fdf4', '#ffffff']
                                                    : '#ffffff'
                                            }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                        >
                                            <td>
                                                <span className="font-semibold">{order.order_number || order.id}</span>
                                            </td>
                                            <td>{getOrderDate(order)}</td>
                                            <td>
                                                <span className={`status-badge status-${getStatusBadgeClass(order.order_status)}`}>
                                                    {getOrderStatusLabel(order.order_status)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="font-semibold">₹{order.total_amount}</span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => handleView(order)}
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination - Hidden in search mode */}
                    {!isSearchMode && filteredOrders.length > 0 && totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={page === 1 || loading}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="pagination-btn"
                                disabled={page >= totalPages || loading}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </button>
                        </div>
                    )}
                    
                    {/* Search results info */}
                    {isSearchMode && searchQuery && (
                        <div style={{ textAlign: 'center', padding: '1rem', color: '#737373', fontSize: '0.875rem' }}>
                            Found {filteredOrders.length} orders matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modern-modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <motion.div 
                        className="modern-modal"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ maxWidth: '650px' }}
                    >
                        <div className="modern-modal-header">
                            <div>
                                <h3>Order Details</h3>
                                <p>{selectedOrder.order_number || selectedOrder.id}</p>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedOrder(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Notice Display */}
                        {notice && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`modern-alert modern-alert-${notice.type === 'success' ? 'success' : 'error'}`}
                                style={{ margin: '0 20px 16px' }}
                            >
                                {notice.text}
                            </motion.div>
                        )}

                        <div className="modern-modal-body">
                            {/* Customer Information */}
                            {selectedOrder.user && (
                                <div style={{ marginBottom: '16px' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: '#171717' }}>
                                        Customer Information
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Name</div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{selectedOrder.user.name || '--'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Phone</div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{selectedOrder.user.phone || '--'}</div>
                                        </div>
                                    </div>
                                    {selectedOrder.address && (
                                        <div style={{ 
                                            background: '#fafafa', 
                                            padding: '8px', 
                                            borderRadius: '8px', 
                                            border: '1px solid #e5e5e5' 
                                        }}>
                                            <div style={{ fontSize: '0.75rem', color: '#737373', marginBottom: '4px' }}>Delivery Address</div>
                                            <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                                                {selectedOrder.address.full_address || '--'}
                                                {selectedOrder.address.landmark && (
                                                    <div style={{ color: '#737373', fontSize: '0.8125rem', marginTop: '4px' }}>
                                                        Landmark: {selectedOrder.address.landmark}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Order Items */}
                            <div style={{ marginBottom: '16px' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px', color: '#171717' }}>
                                        Order Items
                                    </h4>
                                {(selectedOrder.items || []).length === 0 ? (
                                    <p style={{ color: '#a3a3a3', textAlign: 'center', padding: '1rem' }}>
                                        No item details available for this order.
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {(selectedOrder.items || []).map((item: any, idx: number) => (
                                            <div key={idx} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px',
                                                background: '#fafafa',
                                                border: '1px solid #e5e5e5',
                                                borderRadius: '8px'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                        {item.product_name || item.name || '--'}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#737373', marginTop: '2px' }}>
                                                        Qty: {item.quantity ?? '--'} × ₹{item.price ?? '--'}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                    ₹{item.subtotal ?? ((item.price || 0) * (item.quantity || 0))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div style={{
                                background: '#fafafa',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #e5e5e5',
                                marginBottom: '12px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#525252' }}>Subtotal</span>
                                    <span>₹{selectedOrder.subtotal ?? 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#525252' }}>Delivery Fee</span>
                                    <span>₹{selectedOrder.delivery_fee ?? 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#525252' }}>Discount</span>
                                    <span style={{ color: '#16a34a' }}>-₹{selectedOrder.discount_amount ?? 0}</span>
                                </div>
                                {selectedOrder.cash_handling_fee > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
                                        <span style={{ color: '#525252' }}>Cash Handling Fee</span>
                                        <span>₹{selectedOrder.cash_handling_fee ?? 0}</span>
                                    </div>
                                )}
                                {selectedOrder.taxes_and_fee > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
                                        <span style={{ color: '#525252' }}>Taxes & Fees</span>
                                        <span>₹{selectedOrder.taxes_and_fee ?? 0}</span>
                                    </div>
                                )}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingTop: '8px',
                                    marginTop: '8px',
                                    borderTop: '1px solid #e5e5e5',
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                }}>
                                    <span>Total</span>
                                    <span>₹{selectedOrder.total_amount ?? 0}</span>
                                </div>
                            </div>
                        </div>

                        {getAvailableActions(selectedOrder.order_status).length > 0 && (
                            <div className="modern-modal-footer">
                                {getAvailableActions(selectedOrder.order_status).map((action) => (
                                    <button
                                        key={action.value}
                                        className="btn btn-primary"
                                        onClick={() => handleStatusChange(selectedOrder.id, action.value)}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Updating...' : action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default RetailerOrdersPage;
