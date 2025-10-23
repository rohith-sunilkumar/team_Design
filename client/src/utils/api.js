import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prepend the base URL
  return `${BASE_URL}${imagePath}`;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Report APIs
export const reportAPI = {
  create: (formData) => {
    return api.post('/department-reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getAll: (params) => api.get('/department-reports', { params }),
  getAllReports: (params) => api.get('/department-reports/all', { params }), // All reports across all departments
  getById: (id) => api.get(`/department-reports/${id}`),
  update: (id, data) => api.patch(`/department-reports/${id}`, data),
  delete: (id) => api.delete(`/department-reports/${id}`)
};

// Stats APIs
export const statsAPI = {
  getDashboard: () => api.get('/stats')
};

export default api;
