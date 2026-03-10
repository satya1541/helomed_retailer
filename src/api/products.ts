import client from './client';
import { unwrapData } from '../utils/api';

export const addRetailerProduct = async (formData: FormData) => {
    const response = await client.post('/retailerProduct/addProduct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return unwrapData(response);
};

export const addRetailerProductFromMaster = async (payload: {
    master_product_id: number;
    price: number;
    mrp?: number;
    stock?: number;
    discount_percentage?: number;
    requires_prescription?: boolean | string;
    is_loose_available?: boolean | string;
    product_category_id?: number;
}) => {
    const response = await client.post('/retailerProduct/addFromMaster', payload);
    return unwrapData(response);
};

export const bulkUploadRetailerProducts = async (formData: FormData) => {
    const response = await client.post('/retailerProduct/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return unwrapData(response);
};

export const getRetailerProducts = async (page = 1, limit = 20, product_category?: string) => {
    const response = await client.get('/retailerProduct/products', {
        params: { page, limit, product_category }
    });
    return unwrapData(response);
};

export const searchRetailerProducts = async (query: string, page = 1, limit = 20) => {
    const response = await client.get('/retailerProduct/search', {
        params: { q: query, page, limit }
    });
    return unwrapData(response);
};

export const getRetailerSingleProduct = async (id: number | string) => {
    const response = await client.get('/retailerProduct/single-product', { params: { id } });
    return unwrapData(response);
};

export const updateRetailerProduct = async (id: number | string, payload: Record<string, any>) => {
    const response = await client.put(`/retailerProduct/update/${id}`, payload);
    return unwrapData(response);
};

export const getAllMasterProducts = async (page = 1, limit = 50, starts_with?: string, product_category_id?: number) => {
    const response = await client.get('/master-products/', {
        params: { page, limit, starts_with, product_category_id }
    });
    return unwrapData(response);
};

export const searchMasterProducts = async (query: string, page = 1, limit = 50) => {
    const response = await client.get('/master-products/search', {
        params: { q: query, page, limit }
    });
    return unwrapData(response);
};

export const getMasterProductSuggestions = async (query: string, limit = 10) => {
    const response = await client.get('/master-products/suggestions', {
        params: { q: query, limit }
    });
    return unwrapData(response);
};
