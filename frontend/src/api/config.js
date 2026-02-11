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
