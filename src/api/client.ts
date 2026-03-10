import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://helo.thynxai.cloud',
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('helo_med_retailer_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`API Error [${error.response.status}]:`, error.response.data);
            if (error.response.status === 401) {
                localStorage.removeItem('helo_med_retailer_token');
                localStorage.removeItem('helo_med_retailer_user');
                window.location.href = '/login';
            }
        } else {
            console.error('API Error [No Response]:', error.message);
        }
        return Promise.reject(error);
    }
);

export default client;
export { client };
