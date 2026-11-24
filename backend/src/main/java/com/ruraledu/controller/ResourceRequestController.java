package com.ruraledu.controller;

import com.ruraledu.dto.ApiResponse;
import com.ruraledu.dto.CreateResourceRequest;
import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.ResourceRequestResponse;
import com.ruraledu.dto.ResourceResponse;
import com.ruraledu.entity.User;
import com.ruraledu.service.AuthService;
import com.ruraledu.service.ResourceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@Tag(name = "Resource Requests & Matching", description = "Endpoints for requesting unavailable resources and viewing matching results")
public class ResourceRequestController {

    private final ResourceRequestService requestService;
    private final AuthService authService;

    public ResourceRequestController(ResourceRequestService requestService, AuthService authService) {
        this.requestService = requestService;
        this.authService = authService;
    }

    @PostMapping
    @Operation(summary = "Submit a request for an unavailable resource (Students, Teachers, Schools)")
    public ResponseEntity<ApiResponse<ResourceRequestResponse>> createRequest(@Valid @RequestBody CreateResourceRequest request) {
        User currentUser = authService.getCurrentUser();
        ResourceRequestResponse response = requestService.createRequest(request, currentUser);
        String message = (response.getStatus() == com.ruraledu.enums.RequestStatus.MATCHED)
                ? "Resource request submitted and automatically matched with an existing approved resource!"
                : "Resource request submitted successfully.";
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(message, response));
    }

    @GetMapping("/my-requests")
    @Operation(summary = "Get requests submitted by currently authenticated user")
    public ResponseEntity<ApiResponse<PageResponse<ResourceRequestResponse>>> getMyRequests(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        User currentUser = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<ResourceRequestResponse> response = requestService.getMyRequests(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resource request details by ID")
    public ResponseEntity<ApiResponse<ResourceRequestResponse>> getRequestById(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        ResourceRequestResponse response = requestService.getRequestById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}/matches")
    @Operation(summary = "Find and inspect matching approved resources for a request")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getMatches(@PathVariable Long id) {
        List<ResourceResponse> matches = requestService.findMatches(id);
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }
}

