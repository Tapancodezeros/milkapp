/**
 * Auth storage helper module supporting both localStorage and sessionStorage.
 */

export const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
};

export const getAuthUser = () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

export const setAuth = (token, user) => {
    if (typeof window === 'undefined') return;
    // Store in both localStorage and sessionStorage for compatibility
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

export const getDashboardPath = (role) => {
    switch (role) {
        case 'vendor':
            return '/vendor';
        case 'admin':
            return '/admin';
        case 'customer':
        default:
            return '/customer';
    }
};
