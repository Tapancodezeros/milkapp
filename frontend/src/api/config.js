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

// Utility helper to safely extract user-friendly error messages
export const getErrorMessage = (err, fallback = "Operation failed") => {
    if (!err) return fallback;
    if (typeof err === 'string') return err;
    if (err.response?.data?.error) return err.response.data.error;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
    return fallback;
};

// Configure global axios
axios.defaults.baseURL = API_BASE_URL;

// Global Response interceptor - do NOT logout on user operation errors or 403 forbidden
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only clear auth if token is completely invalid/expired on initial load, NOT on user actions/invalid input/403
        if (error.response && error.response.status === 401) {
            const msg = (error.response.data?.message || error.response.data?.error || '').toLowerCase();
            if (msg.includes('token') || msg.includes('jwt') || msg.includes('unauthorized: invalid or expired')) {
                const path = window.location.pathname;
                if (path !== '/' && path !== '/register' && path !== '/forgot-password' && path !== '/reset-password') {
                    clearAuth();
                    window.location.href = '/';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
