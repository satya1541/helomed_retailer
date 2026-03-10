import client from './client';
import { unwrapData } from '../utils/api';

export const getRetailerOrders = async (params?: {
    order_status?: number;
    payment_status?: number;
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    type?: string;
}) => {
    const response = await client.get('/retailer-order/orders', { params });
    return unwrapData(response);
};

export const getRetailerOrderDetails = async (id: number | string) => {
    const response = await client.get(`/retailer-order/orders/${id}`);
    return unwrapData(response);
};

export const updateRetailerOrderStatus = async (id: number | string, payload: { order_status: number; rejection_reason?: string | null }) => {
    const response = await client.patch(`/retailer-order/orders/${id}/status`, payload);
    return unwrapData(response);
};

export const syncRetailerData = async () => {
    const response = await client.get('/retailer-order/sync');
    return unwrapData(response);
};
