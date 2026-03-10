import client from './client';
import { unwrapData } from '../utils/api';

type UploadRole = 'retailer' | 'user';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getClient = (_role: UploadRole) => {
    // In retailer app, always use client
    return client;
};

export const getImagePresignedUrl = async (role: UploadRole, payload: { folder: string; fileName: string; contentType: string }) => {
    const response = await getClient(role).post('/upload/presigned-url/image', payload);
    return unwrapData(response);
};

export const getExcelPresignedUrl = async (role: UploadRole, payload: { fileName: string; contentType: string }) => {
    const response = await getClient(role).post('/upload/presigned-url/excel', payload);
    return unwrapData(response);
};

export const getBatchPresignedUrls = async (role: UploadRole, payload: { files: Array<{ folder: string; fileName: string; contentType: string }> }) => {
    const response = await getClient(role).post('/upload/presigned-url/batch', payload);
    return unwrapData(response);
};

export const uploadToPresignedUrl = async (presignedUrl: string, file: File) => {
    const response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type
        },
        body: file
    });

    if (!response.ok) {
        throw new Error('Upload failed');
    }

    return true;
};
