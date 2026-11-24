package com.ruraledu.controller;

import com.ruraledu.dto.ApiResponse;
import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.ResourceResponse;
import com.ruraledu.dto.ResourceUploadRequest;
import com.ruraledu.entity.Resource;
import com.ruraledu.entity.User;
import com.ruraledu.service.AuthService;
import com.ruraledu.service.FileStorageService;
import com.ruraledu.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resources")
@Tag(name = "Resources & Digital Library", description = "Endpoints for uploading, searching, viewing and downloading educational materials")
public class ResourceController {

    private final ResourceService resourceService;
    private final AuthService authService;
    private final FileStorageService fileStorageService;

    public ResourceController(ResourceService resourceService,
                              AuthService authService,
                              FileStorageService fileStorageService) {
        this.resourceService = resourceService;
        this.authService = authService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload an educational resource with an attached file or educational link (Donor, Teacher, NGO)")
    public ResponseEntity<ApiResponse<ResourceResponse>> uploadResource(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("resourceTypeId") Long resourceTypeId,
            @RequestParam("subjectId") Long subjectId,
            @RequestParam("classLevelId") Long classLevelId,
            @RequestParam(value = "externalUrl", required = false) String externalUrl,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        User currentUser = authService.getCurrentUser();

        ResourceUploadRequest request = new ResourceUploadRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setResourceTypeId(resourceTypeId);
        request.setSubjectId(subjectId);
        request.setClassLevelId(classLevelId);
        request.setExternalUrl(externalUrl);

        ResourceResponse response = resourceService.uploadResource(request, file, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Resource uploaded successfully and submitted for admin verification.", response));
    }

    @GetMapping
    @Operation(summary = "Browse and search approved resources in the Digital Library (Public)")
    public ResponseEntity<ApiResponse<PageResponse<ResourceResponse>>> getApprovedResources(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "subjectId", required = false) Long subjectId,
            @RequestParam(value = "classLevelId", required = false) Long classLevelId,
            @RequestParam(value = "resourceTypeId", required = false) Long resourceTypeId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "direction", defaultValue = "DESC") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<ResourceResponse> response = resourceService.getApprovedResources(
                keyword, subjectId, classLevelId, resourceTypeId, pageable
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resource details by ID (Public if approved, or owner/admin)")
    public ResponseEntity<ApiResponse<ResourceResponse>> getResourceById(@PathVariable Long id) {
        User currentUser = null;
        try {
            currentUser = authService.getCurrentUser();
        } catch (Exception ignored) {
            // Anonymous public guest
        }

        ResourceResponse response = resourceService.getResourceResponseById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download an approved educational resource file")
    public ResponseEntity<org.springframework.core.io.Resource> downloadResource(@PathVariable Long id) {
        User currentUser = null;
        try {
            currentUser = authService.getCurrentUser();
        } catch (Exception ignored) {
            // Anonymous public guest
        }

        Resource resource = resourceService.getResourceEntityById(id);

        // Security check: Must be approved or owner/admin
        if (resource.getStatus() != com.ruraledu.enums.ResourceStatus.APPROVED) {
            if (currentUser == null || (!resource.getUploadedBy().getId().equals(currentUser.getId()) && currentUser.getRole() != com.ruraledu.enums.Role.ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        if (resource.getFilePath() == null || resource.getFilePath().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        org.springframework.core.io.Resource fileResource = fileStorageService.loadFileAsResource(resource.getFilePath());

        String contentType = resource.getFileType() != null ? resource.getFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        String filename = resource.getFileName() != null ? resource.getFileName() : fileResource.getFilename();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(fileResource);
    }

    @GetMapping("/my-uploads")
    @Operation(summary = "Get resources uploaded by currently authenticated user")
    public ResponseEntity<ApiResponse<PageResponse<ResourceResponse>>> getMyUploads(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        User currentUser = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        PageResponse<ResourceResponse> response = resourceService.getMyUploads(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a resource (Owner if still PENDING, or Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteResource(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        resourceService.deleteResource(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Resource deleted successfully", null));
    }
}
