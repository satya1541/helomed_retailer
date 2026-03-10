import client from './client';
import { unwrapData } from '../utils/api';

export const getRetailerEarningsToday = async () => {
    const response = await client.get('/retailer-payment/earnings/today');
    return unwrapData(response);
};

export const getRetailerEarningsTotal = async () => {
    const response = await client.get('/retailer-payment/earnings/total');
    return unwrapData(response);
};

export const getRetailerEarningsMonthly = async (month?: number, year?: number) => {
    const response = await client.get('/retailer-payment/earnings/monthly', { params: { month, year } });
    return unwrapData(response);
};

export const getRetailerEarningsByStatus = async () => {
    const response = await client.get('/retailer-payment/earnings/by-status');
    return unwrapData(response);
};

export const getRetailerTransactions = async (params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    order_status?: number;
    payment_status?: number;
}) => {
    const response = await client.get('/retailer-payment/transactions', { params });
    return unwrapData(response);
};

export const requestRetailerPayout = async (payload: {
    amount: number;
    bank_details: { account_number: string; ifsc_code: string; account_holder_name: string };
}) => {
    const response = await client.post('/retailer-payment/payout/request', payload);
    return unwrapData(response);
};

export const getRetailerPayoutHistory = async (params?: { page?: number; limit?: number; status?: number }) => {
    const response = await client.get('/retailer-payment/payout/history', { params });
    return unwrapData(response);
};
