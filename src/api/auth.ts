import client from './client';
import { unwrapData } from '../utils/api';

export const retailerSendOtp = async (phone: string) => {
    const response = await client.post('/retailer/send-otp', { phone });
    return unwrapData(response);
};

export const retailerVerifyOtp = async (phone: string, otp: string) => {
    const response = await client.post('/retailer/verify-otp', { phone, otp });
    return unwrapData(response);
};

export const retailerSignup = async (formData: FormData) => {
    const response = await client.post('/retailer/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return unwrapData(response);
};

export const getRetailerProfile = async () => {
    const response = await client.get('/retailer/profile');
    return unwrapData(response);
};

export const updateRetailerProfile = async (formData: FormData) => {
    const response = await client.put('/retailer/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return unwrapData(response);
};

export const updateRetailerLocation = async (payload: {
    latitude?: number;
    longitude?: number;
    full_address?: string;
    pincode?: string;
    landmark?: string;
    house_number?: string;
}) => {
    const response = await client.put('/retailer/update-location', payload);
    return unwrapData(response);
};

export const setRetailerOnlineStatus = async (isOnline: boolean) => {
    const response = await client.put('/retailer/set-online-status', { is_online: isOnline });
    return unwrapData(response);
};

export const updateRetailerFcmToken = async (token: string) => {
    const response = await client.put('/retailer/fcm-token', { fcm_token: token });
    return unwrapData(response);
};

export const retailerLogout = async () => {
    const response = await client.post('/retailer/logout');
    return unwrapData(response);
};
