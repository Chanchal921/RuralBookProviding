package com.ruraledu.controller;

import com.ruraledu.dto.ApiResponse;
import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.ResourceRequestResponse;
import com.ruraledu.dto.UpdateRequestStatusRequest;
import com.ruraledu.entity.User;
import com.ruraledu.enums.RequestStatus;
import com.ruraledu.service.AuthService;
import com.ruraledu.service.ResourceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/requests")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Request Management", description = "Admin workflow for reviewing, matching and fulfilling resource requests")
public class AdminRequestController {

    private final ResourceRequestService requestService;
    private final AuthService authService;

    public AdminRequestController(ResourceRequestService requestService, AuthService authService) {
        this.requestService = requestService;
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "List all resource requests with optional status and keyword filtering (Admin only)")
    public ResponseEntity<ApiResponse<PageResponse<ResourceRequestResponse>>> getAdminRequests(
            @RequestParam(value = "status", required = false) RequestStatus status,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<ResourceRequestResponse> response = requestService.getAdminRequests(status, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update request lifecycle status and assign matched resource (Admin only)")
    public ResponseEntity<ApiResponse<ResourceRequestResponse>> updateRequestStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRequestStatusRequest request) {

        User admin = authService.getCurrentUser();
        ResourceRequestResponse response = requestService.updateRequestStatus(id, request, admin);
        return ResponseEntity.ok(ApiResponse.ok("Request status updated to " + response.getStatus(), response));
    }
}

