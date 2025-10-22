/**
 * API service for communicating with backend
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

// Workflow API
export const workflowAPI = {
  listWorkflows: async () => {
    const response = await api.get('/workflows/');
    return response.data;
  },

  getWorkflow: async (workflowId) => {
    const response = await api.get(`/workflows/${workflowId}`);
    return response.data;
  },

  createWorkflow: async (workflowData) => {
    const response = await api.post('/workflows/', workflowData);
    return response.data;
  },

  updateWorkflow: async (workflowId, workflowData) => {
    const response = await api.put(`/workflows/${workflowId}`, workflowData);
    return response.data;
  },

  deleteWorkflow: async (workflowId) => {
    await api.delete(`/workflows/${workflowId}`);
  },

  executeWorkflow: async (workflowId, inputData) => {
    const response = await api.post(`/workflows/${workflowId}/execute`, inputData);
    return response.data;
  },

  listExecutions: async (workflowId) => {
    const response = await api.get(`/workflows/${workflowId}/executions`);
    return response.data;
  },

  getExecution: async (executionId) => {
    const response = await api.get(`/workflows/executions/${executionId}`);
    return response.data;
  },
};

// Template API
export const templateAPI = {
  listTemplates: async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get('/templates/', { params });
    return response.data;
  },

  getTemplate: async (templateId) => {
    const response = await api.get(`/templates/${templateId}`);
    return response.data;
  },
};

export default api;
