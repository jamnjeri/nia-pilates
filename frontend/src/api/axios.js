import axios from 'axios';
import { logout, setTokens } from '../redux/authSlice';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token aka Request Interceptor
api.interceptors.request.use(
  async (config) => {
    // Dynamically import store only when a request is made
    // This breaks the circular loop
    const { store } = await import('../redux/store');
    const token = store.getState().auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Handle Token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = store.getState().auth.refreshToken;

      if (refreshToken) {
        try {
          const res = await axios.post('http://127.0.0.1:8000/api/accounts/token/refresh/', {
            refresh: refreshToken,
          });
          
          // Update tokens in Redux
          store.dispatch(setTokens({ 
            access: res.data.access, 
            refresh: refreshToken 
          }));

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout()); // If refresh fails, kick them to login
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
