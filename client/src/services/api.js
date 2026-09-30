import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Transaction API Services
export const getTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const getTransaction = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await api.post('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await api.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

// Budget API Services
export const getBudget = async (month) => {
  const response = await api.get('/budget', { params: { month } });
  return response.data;
};

export const updateBudget = async (amount, month) => {
  const response = await api.put('/budget', { amount, month });
  return response.data;
};

// Health Check
export const getHealthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
