package com.ruraledu.service;

import com.ruraledu.dto.*;
import com.ruraledu.entity.User;

public interface DashboardService {
    StudentDashboardResponse getStudentDashboard(User user);
    DonorDashboardResponse getDonorDashboard(User user);
    TeacherDashboardResponse getTeacherDashboard(User user);
    NgoDashboardResponse getNgoDashboard(User user);
    AdminDashboardResponse getAdminDashboard();
}

