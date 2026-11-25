import axios from 'axios';

/**
 * Resolves the backend API base URL from Vite environment variables.
 * - In local development: VITE_API_BASE_URL=http://localhost:8080
 *   returns 'http://localhost:8080/api'
 * - In production: VITE_API_BASE_URL=https://ruralbookprovidingbackend.onrender.com
 *   returns 'https://ruralbookprovidingbackend.onrender.com/api'
 * - If user provides an explicit URL ending with '/api', it is preserved without duplicating.
 * - If unset, defaults to '/api' so Vite proxy routes to localhost:8080.
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || !envUrl.trim()) {
    return '/api';
  }
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ruraledu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear local credentials
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('ruraledu_token');
        localStorage.removeItem('ruraledu_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
