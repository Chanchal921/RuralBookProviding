import api, { getApiBaseUrl } from './axios';

export const resourceApi = {
  // Public Library
  getApprovedResources: async (params = {}) => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  getResourceById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  getDownloadUrl: (id) => `${getApiBaseUrl()}/resources/${id}/download`,

  // Resource Upload
  uploadResource: async (formData) => {
    const response = await api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // My Uploads
  getMyUploads: async (page = 0, size = 10) => {
    const response = await api.get('/resources/my-uploads', {
      params: { page, size },
    });
    return response.data;
  },

  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },

  // Master Catalogs
  getMetadata: async () => {
    const response = await api.get('/metadata/all');
    return response.data;
  },
};
