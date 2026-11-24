package com.ruraledu.controller;

import com.ruraledu.dto.ApiResponse;
import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.ResourceResponse;
import com.ruraledu.dto.ResourceStatusUpdateRequest;
import com.ruraledu.entity.User;
import com.ruraledu.enums.ResourceStatus;
import com.ruraledu.service.AuthService;
import com.ruraledu.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/resources")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Resource Verification", description = "Admin workflow for reviewing, approving, rejecting and deactivating resources")
public class AdminResourceController {

    private final ResourceService resourceService;
    private final AuthService authService;

    public AdminResourceController(ResourceService resourceService, AuthService authService) {
        this.resourceService = resourceService;
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "List all resources with optional status and keyword filtering (Admin only)")
    public ResponseEntity<ApiResponse<PageResponse<ResourceResponse>>> getAdminResources(
            @RequestParam(value = "status", required = false) ResourceStatus status,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<ResourceResponse> response = resourceService.getAdminResources(status, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/approve")
    @Operation(summary = "Approve a pending resource submission (Admin only)")
    public ResponseEntity<ApiResponse<ResourceResponse>> approveResource(
            @PathVariable Long id,
            @RequestBody(required = false) ResourceStatusUpdateRequest request) {

        User admin = authService.getCurrentUser();
        String remarks = (request != null) ? request.getAdminRemarks() : "Resource verified and approved.";
        ResourceResponse response = resourceService.approveResource(id, remarks, admin);
        return ResponseEntity.ok(ApiResponse.ok("Resource approved successfully and is now live in the Digital Library.", response));
    }

    @PutMapping("/{id}/reject")
    @Operation(summary = "Reject a pending resource submission with remarks (Admin only)")
    public ResponseEntity<ApiResponse<ResourceResponse>> rejectResource(
            @PathVariable Long id,
            @RequestBody(required = false) ResourceStatusUpdateRequest request) {

        User admin = authService.getCurrentUser();
        String remarks = (request != null && request.getAdminRemarks() != null)
                ? request.getAdminRemarks() : "Resource submission did not meet publication standards.";
        ResourceResponse response = resourceService.rejectResource(id, remarks, admin);
        return ResponseEntity.ok(ApiResponse.ok("Resource has been rejected.", response));
    }

    @PutMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate an outdated or unsuitable approved resource (Admin only)")
    public ResponseEntity<ApiResponse<ResourceResponse>> deactivateResource(
            @PathVariable Long id,
            @RequestBody(required = false) ResourceStatusUpdateRequest request) {

        User admin = authService.getCurrentUser();
        String remarks = (request != null && request.getAdminRemarks() != null)
                ? request.getAdminRemarks() : "Resource deactivated by administrator.";
        ResourceResponse response = resourceService.deactivateResource(id, remarks, admin);
        return ResponseEntity.ok(ApiResponse.ok("Resource has been deactivated.", response));
    }
}

