import axios from 'axios';

// Determine the environment
const isDevelopment = process.env.NODE_ENV === 'development';

// API base URLs
const API_URLS = {
  development: 'http://localhost:8000/api/v1',
  production: 'https://envirosense-2khv.onrender.com/api/v1',
  test: 'http://localhost:8000/api/v1',
};

// Create axios instance with environment-specific config
const api = axios.create({
  baseURL: API_URLS[process.env.NODE_ENV] || API_URLS.production,
  timeout: isDevelopment ? 10000 : 30000, // Shorter timeout for development
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
