package com.ruraledu.controller;

import com.ruraledu.dto.*;
import com.ruraledu.entity.User;
import com.ruraledu.service.AuthService;
import com.ruraledu.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboards", description = "Role-specific real-time statistical metrics and recent activity feeds")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    public DashboardController(DashboardService dashboardService, AuthService authService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    @Operation(summary = "Get Student metrics (Available resources, personal requests, recent additions)")
    public ResponseEntity<ApiResponse<StudentDashboardResponse>> getStudentDashboard() {
        User currentUser = authService.getCurrentUser();
        StudentDashboardResponse response = dashboardService.getStudentDashboard(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/donor")
    @PreAuthorize("hasRole('DONOR') or hasRole('ADMIN')")
    @Operation(summary = "Get Donor metrics (Uploaded count, approval status, donations)")
    public ResponseEntity<ApiResponse<DonorDashboardResponse>> getDonorDashboard() {
        User currentUser = authService.getCurrentUser();
        DonorDashboardResponse response = dashboardService.getDonorDashboard(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    @Operation(summary = "Get Teacher/School metrics (Uploaded materials, requests status, available resources)")
    public ResponseEntity<ApiResponse<TeacherDashboardResponse>> getTeacherDashboard() {
        User currentUser = authService.getCurrentUser();
        TeacherDashboardResponse response = dashboardService.getTeacherDashboard(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/ngo")
    @PreAuthorize("hasRole('NGO') or hasRole('ADMIN')")
    @Operation(summary = "Get NGO metrics (Community submissions, approval status, open requests)")
    public ResponseEntity<ApiResponse<NgoDashboardResponse>> getNgoDashboard() {
        User currentUser = authService.getCurrentUser();
        NgoDashboardResponse response = dashboardService.getNgoDashboard(currentUser);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Admin overarching system metrics (Users, resources, requests breakdown)")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getAdminDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}

