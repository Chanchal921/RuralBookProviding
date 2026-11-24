import api from './axios';

export const requestApi = {
  createRequest: async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  getMyRequests: async (page = 0, size = 10) => {
    const response = await api.get('/requests/my-requests', {
      params: { page, size },
    });
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  getMatches: async (id) => {
    const response = await api.get(`/requests/${id}/matches`);
    return response.data;
  },
};

