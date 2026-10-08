import api from './api';

export const analyticsService = {
  getDashboardMetrics: async () => {
    const response = await api.get('/analytics/dashboard/');
    return response.data;
  },

  getSales: async () => {
    const response = await api.get('/analytics/sales/');
    return response.data;
  },

  getProducts: async () => {
    const response = await api.get('/analytics/products/');
    return response.data;
  },

  getCustomers: async () => {
    const response = await api.get('/analytics/customers/');
    return response.data;
  },

  getRegions: async () => {
    const response = await api.get('/analytics/regions/');
    return response.data;
  },
};
