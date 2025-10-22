import axios from 'axios';
import { auth } from './firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      console.error('API Error:', message);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ==========================================
// LIBRARY API CALLS
// ==========================================

export const libraryAPI = {
  // Get all libraries with filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/libraries?${params.toString()}`);
    return response.data;
  },

  // Get single library by ID
  getById: async (id) => {
    const response = await api.get(`/libraries/${id}`);
    return response.data;
  },

  // Search libraries
  search: async (query) => {
    const response = await api.get(`/libraries/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/libraries/stats');
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/libraries/categories');
    return response.data;
  },
};

// ==========================================
// ADMIN API CALLS
// ==========================================

export const adminAPI = {
  // Get all libraries (admin view)
  getAll: async () => {
    const response = await api.get('/admin/libraries');
    return response.data;
  },

  // Create new library
  create: async (libraryData) => {
    const response = await api.post('/admin/libraries', libraryData);
    return response.data;
  },

  // Update library
  update: async (id, libraryData) => {
    const response = await api.put(`/admin/libraries/${id}`, libraryData);
    return response.data;
  },

  // Delete library
  delete: async (id) => {
    const response = await api.delete(`/admin/libraries/${id}`);
    return response.data;
  },

  // Bulk import
  bulkImport: async (libraries) => {
    const response = await api.post('/admin/libraries/bulk', { libraries });
    return response.data;
  },

  // Set admin claim
  setAdmin: async (uid, isAdmin) => {
    const response = await api.post('/admin/users/set-admin', { uid, isAdmin });
    return response.data;
  },
};

export default api;