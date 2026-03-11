import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { PAYMENT_STATUS, PAYMENT_STATUS_LABELS } from '@/constants';
import {
    getRetailerEarningsByStatus,
    getRetailerEarningsMonthly,
    getRetailerEarningsToday,
    getRetailerEarningsTotal,
    getRetailerPayoutHistory,
    getRetailerTransactions,
    requestRetailerPayout
} from '@/api/payments';
import './Modern.css';

const RetailerPaymentsPage = () => {
    const [summary, setSummary] = useState<any>({ today: {}, total: {}, monthly: {}, byStatus: {} });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState({ amount: '', account_number: '', ifsc_code: '', account_holder_name: '' });

    const getOrderStatusLabel = (status?: number) => {
        const map: Record<number, string> = {
            1: 'Placed',
            2: 'Accepted',
            3: 'Rejected',
            4: 'Preparing',
            5: 'Ready',
            6: 'Out for Delivery',
            7: 'Delivered',
            8: 'Cancelled'
        };
        if (typeof status !== 'number') return '--';
        return map[status] || `Status ${status}`;
    };

    const getPaymentStatusLabel = (status?: number) => {
        if (typeof status !== 'number') return '--';
        return PAYMENT_STATUS_LABELS[status] || `Payment ${status}`;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [today, total, monthly, byStatus, txn, payout] = await Promise.all([
                getRetailerEarningsToday(),
                getRetailerEarningsTotal(),
                getRetailerEarningsMonthly(),
                getRetailerEarningsByStatus(),
                getRetailerTransactions(),
                getRetailerPayoutHistory()
            ]);

            setSummary({
                today: today || {},
                total: total || {},
                monthly: monthly || {},
                byStatus: byStatus || {}
            });

            const txnList = Array.isArray(txn)
                ? txn
                : (Array.isArray(txn?.transactions) ? txn.transactions : []);

            const payoutList = Array.isArray(payout)
                ? payout
                : (Array.isArray(payout?.payouts) ? payout.payouts : []);

            setTransactions(txnList);
            setPayouts(payoutList);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePayoutRequest = async () => {
        if (!request.amount) return;
        await requestRetailerPayout({
            amount: Number(request.amount),
            bank_details: {
                account_number: request.account_number,
                ifsc_code: request.ifsc_code,
                account_holder_name: request.account_holder_name
            }
        });
        setRequest({ amount: '', account_number: '', ifsc_code: '', account_holder_name: '' });
        fetchData();
    };

    if (loading) {
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
                    <h1>Payments</h1>
                    <p>Track earnings, transactions, and payouts.</p>
                </div>
            </motion.div>

            {/* Earnings Summary */}
            <div className="modern-grid modern-grid-4">
                {[
                    {
                        label: "Today's Earnings",
                        value: `₹${summary.today?.total_earning ?? 0}`,
                        subtitle: `${summary.today?.order_count ?? 0} orders`,
                        icon: <DollarSign size={20} />,
                        delay: 0
                    },
                    {
                        label: "Total Earnings",
                        value: `₹${summary.total?.total_earning ?? 0}`,
                        subtitle: `${summary.total?.order_count ?? 0} orders`,
                        icon: <TrendingUp size={20} />,
                        delay: 0.1
                    },
                    {
                        label: "This Month",
                        value: `₹${summary.monthly?.total_earning ?? 0}`,
                        subtitle: `${summary.monthly?.order_count ?? 0} orders`,
                        icon: <Wallet size={20} />,
                        delay: 0.2
                    },
                    {
                        label: "Available Balance",
                        value: `₹${summary.total?.available_balance ?? 0}`,
                        subtitle: `Commission ${summary.total?.commission_percentage ?? 0}%`,
                        icon: <CreditCard size={20} />,
                        delay: 0.3
                    }
                ].map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: stat.delay }}
                    >
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">{stat.label}</span>
                                <div className="stat-icon">{stat.icon}</div>
                            </div>
                            <h2 className="stat-value">{stat.value}</h2>
                            <div className="stat-change">
                                <span style={{ color: '#737373' }}>{stat.subtitle}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Payout Request & Earnings by Status */}
            <div className="modern-grid modern-grid-2">
                {/* Request Payout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <div className="modern-card">
                        <div className="modern-card-header">
                            <h3 className="modern-card-title">Request Payout</h3>
                            <p className="modern-card-subtitle">Request withdrawal of your earnings</p>
                        </div>
                        <div className="modern-card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label className="form-label">Amount</label>
                                    <input 
                                        className="form-input"
                                        type="number"
                                        value={request.amount} 
                                        onChange={(e) => setRequest({ ...request, amount: e.target.value })} 
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Account Number</label>
                                    <input 
                                        className="form-input"
                                        value={request.account_number} 
                                        onChange={(e) => setRequest({ ...request, account_number: e.target.value })} 
                                        placeholder="Enter account number"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">IFSC Code</label>
                                    <input 
                                        className="form-input"
                                        value={request.ifsc_code} 
                                        onChange={(e) => setRequest({ ...request, ifsc_code: e.target.value })} 
                                        placeholder="Enter IFSC code"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Account Holder Name</label>
                                    <input 
                                        className="form-input"
                                        value={request.account_holder_name} 
                                        onChange={(e) => setRequest({ ...request, account_holder_name: e.target.value })} 
                                        placeholder="Enter account holder name"
                                    />
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handlePayoutRequest}
                                    disabled={!request.amount}
                                    style={{ marginTop: '8px' }}
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Earnings by Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <div className="modern-card">
                        <div className="modern-card-header">
                            <h3 className="modern-card-title">Earnings by Status</h3>
                            <p className="modern-card-subtitle">Breakdown by order status</p>
                        </div>
                        <div className="modern-card-body">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {['delivered_paid', 'delivered_pending', 'other'].map((key) => {
                                    const block = summary.byStatus?.[key] || {};
                                    return (
                                        <div 
                                            key={key} 
                                            style={{
                                                padding: '12px',
                                                background: '#fafafa',
                                                border: '1px solid #e5e5e5',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, marginBottom: '8px', textTransform: 'capitalize' }}>
                                                {block.status || key.replace(/_/g, ' ')}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '0.875rem' }}>
                                                <div>
                                                    <div style={{ color: '#737373', fontSize: '0.75rem' }}>Orders</div>
                                                    <div style={{ fontWeight: 600, marginTop: '2px' }}>{block.order_count ?? 0}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: '#737373', fontSize: '0.75rem' }}>Earnings</div>
                                                    <div style={{ fontWeight: 600, marginTop: '2px' }}>₹{block.total_earning ?? 0}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: '#737373', fontSize: '0.75rem' }}>Commission</div>
                                                    <div style={{ fontWeight: 600, marginTop: '2px' }}>₹{block.total_commission ?? 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Transactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
            >
                <div className="modern-card">
                    <div className="modern-card-header">
                        <h3 className="modern-card-title">Transactions</h3>
                        <p className="modern-card-subtitle">All your transaction history</p>
                    </div>
                    {transactions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Wallet size={32} />
                            </div>
                            <h3 className="empty-state-title">No transactions yet</h3>
                            <p className="empty-state-description">
                                Transactions will appear here once orders are completed.
                            </p>
                        </div>
                    ) : (
                        <div className="modern-table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Subtotal</th>
                                        <th>Commission</th>
                                        <th>Earning</th>
                                        <th>Order Status</th>
                                        <th>Payment Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((txn, index) => (
                                        <motion.tr
                                            key={txn.order_id || txn.id || txn.transaction_id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                        >
                                            <td><span className="font-semibold">{txn.order_number || txn.order_id}</span></td>
                                            <td>₹{txn.subtotal ?? 0}</td>
                                            <td>₹{txn.commission ?? 0}</td>
                                            <td><span className="font-semibold">₹{txn.earning ?? 0}</span></td>
                                            <td>{getOrderStatusLabel(txn.order_status)}</td>
                                            <td>
                                                <span className={`badge ${txn.payment_status === PAYMENT_STATUS.PAID ? 'badge-success' : 'badge-warning'}`}>
                                                    {getPaymentStatusLabel(txn.payment_status)}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Payout History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
            >
                <div className="modern-card">
                    <div className="modern-card-header">
                        <h3 className="modern-card-title">Payout History</h3>
                        <p className="modern-card-subtitle">Track your withdrawal requests</p>
                    </div>
                    {payouts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <CreditCard size={32} />
                            </div>
                            <h3 className="empty-state-title">No payouts yet</h3>
                            <p className="empty-state-description">
                                Your payout requests will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="modern-table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Payout ID</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payouts.map((p, index) => (
                                        <motion.tr
                                            key={p.id || p.payout_id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                        >
                                            <td><span className="font-semibold">{p.id || p.payout_id}</span></td>
                                            <td><span className="font-semibold">₹{p.amount ?? 0}</span></td>
                                            <td>
                                                <span className={`badge ${p.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                                    {p.status || 'Pending'}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default RetailerPaymentsPage;
