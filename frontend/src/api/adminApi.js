import api from './axios';

export const adminApi = {
  // Users
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  // Resources
  getResources: async (params = {}) => {
    const response = await api.get('/admin/resources', { params });
    return response.data;
  },

  approveResource: async (id, adminRemarks = '') => {
    const response = await api.put(`/admin/resources/${id}/approve`, {
      adminRemarks,
      status: 'APPROVED',
    });
    return response.data;
  },

  rejectResource: async (id, adminRemarks = '') => {
    const response = await api.put(`/admin/resources/${id}/reject`, {
      adminRemarks,
      status: 'REJECTED',
    });
    return response.data;
  },

  deactivateResource: async (id, adminRemarks = '') => {
    const response = await api.put(`/admin/resources/${id}/deactivate`, {
      adminRemarks,
      status: 'DEACTIVATED',
    });
    return response.data;
  },

  // Requests
  getRequests: async (params = {}) => {
    const response = await api.get('/admin/requests', { params });
    return response.data;
  },

  updateRequestStatus: async (id, data) => {
    const response = await api.put(`/admin/requests/${id}/status`, data);
    return response.data;
  },
};

