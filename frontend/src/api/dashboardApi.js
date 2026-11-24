import api from './axios';

export const dashboardApi = {
  getStudentDashboard: async () => {
    const response = await api.get('/dashboard/student');
    return response.data;
  },

  getDonorDashboard: async () => {
    const response = await api.get('/dashboard/donor');
    return response.data;
  },

  getTeacherDashboard: async () => {
    const response = await api.get('/dashboard/teacher');
    return response.data;
  },

  getNgoDashboard: async () => {
    const response = await api.get('/dashboard/ngo');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },
};

