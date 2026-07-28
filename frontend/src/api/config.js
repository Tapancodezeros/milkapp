import axios from 'axios';
import { clearAuth } from '../utils/auth';

// Automatically detect the host to support both localhost and network access
const getApiBaseUrl = () => {
    // If we're in a browser, use the current hostname
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return `http://${hostname}:5000/api`;
    }
    // Fallback for non-browser environments
    return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Configure global axios
axios.defaults.baseURL = API_BASE_URL;

// Global Response interceptor for auth errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            // Only redirect if not already on login or reset pages
            const path = window.location.pathname;
            if (path !== '/' && path !== '/register' && path !== '/forgot-password' && path !== '/reset-password') {
                clearAuth();
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
