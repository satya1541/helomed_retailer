import { useEffect, useState, useMemo } from 'react';
import { X, ShoppingBag, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRetailerOrderDetails, getRetailerOrders, updateRetailerOrderStatus } from '@/api/orders';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@/constants';
import './Modern.css';

const RetailerOrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
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

    useEffect(() => {
        setNotice(null);
        fetchOrders();
    }, [page, statusFilter, startDate, endDate]);

    // Filter orders by search query and status (client-side fallback since backend doesn't filter)
    const filteredOrders = useMemo(() => {
        let filtered = orders;
        
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
                return orderNumber.includes(query) || totalAmount.includes(query);
            });
        }
        
        return filtered;
    }, [orders, searchQuery, statusFilter]);

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
            setNotice({ type: 'success', text: 'Order status updated successfully!' });
            await fetchOrders();
            setTimeout(() => {
                setSelectedOrder(null);
                setNotice(null);
            }, 1000);
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
                    <h1>Orders</h1>
                    <p>Track and update order status.</p>
                </div>
            </motion.div>

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
                                            animate={{ opacity: 1, x: 0 }}
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

                    {/* Pagination */}
                    {filteredOrders.length > 0 && totalPages > 1 && (
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
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#171717' }}>
                                        Customer Information
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                                            padding: '12px', 
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
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px', color: '#171717' }}>
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
                                                padding: '12px',
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
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid #e5e5e5',
                                marginBottom: '16px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#525252' }}>Subtotal</span>
                                    <span>₹{selectedOrder.subtotal ?? 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#525252' }}>Delivery Fee</span>
                                    <span>₹{selectedOrder.delivery_fee ?? 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#525252' }}>Discount</span>
                                    <span style={{ color: '#16a34a' }}>-₹{selectedOrder.discount_amount ?? 0}</span>
                                </div>
                                {selectedOrder.cash_handling_fee > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                        <span style={{ color: '#525252' }}>Cash Handling Fee</span>
                                        <span>₹{selectedOrder.cash_handling_fee ?? 0}</span>
                                    </div>
                                )}
                                {selectedOrder.taxes_and_fee > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                        <span style={{ color: '#525252' }}>Taxes & Fees</span>
                                        <span>₹{selectedOrder.taxes_and_fee ?? 0}</span>
                                    </div>
                                )}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingTop: '12px',
                                    marginTop: '12px',
                                    borderTop: '1px solid #e5e5e5',
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                }}>
                                    <span>Total</span>
                                    <span>₹{selectedOrder.total_amount ?? 0}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            {getAvailableActions(selectedOrder.order_status).length > 0 && (
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
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
                        </div>

                        <div className="modern-modal-footer">
                            <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default RetailerOrdersPage;
