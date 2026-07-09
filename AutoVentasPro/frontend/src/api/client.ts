import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
   baseURL: API_BASE_URL,
   headers: { 'Content-Type': 'application/json' },
   timeout: 10000,
});

apiClient.interceptors.request.use(config => {
   const token = localStorage.getItem('autoventas_token');
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

const PUBLIC_PATHS = ['/', '/login', '/catalogo', '/planes', '/cotizaciones'];

apiClient.interceptors.response.use(
   response => response,
   error => {
      if (error.response?.status === 401) {
         console.log('[Interceptor] path:', window.location.pathname, 'public?', PUBLIC_PATHS.includes(window.location.pathname));
         localStorage.removeItem('autoventas_token');
         localStorage.removeItem('autoventas_user');
         if (!PUBLIC_PATHS.includes(window.location.pathname)) {
            window.location.href = '/login';
         }
      }
      return Promise.reject(error);
   }
);