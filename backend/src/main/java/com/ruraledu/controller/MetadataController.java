package com.ruraledu.controller;

import com.ruraledu.dto.ApiResponse;
import com.ruraledu.dto.MetadataResponse;
import com.ruraledu.service.MetadataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metadata")
@Tag(name = "Master Metadata", description = "Public master data catalogs for resource types, subjects, and class levels")
public class MetadataController {

    private final MetadataService metadataService;

    public MetadataController(MetadataService metadataService) {
        this.metadataService = metadataService;
    }

    @GetMapping("/all")
    @Operation(summary = "Get all master catalogs (Resource Types, Subjects, Class Levels)")
    public ResponseEntity<ApiResponse<MetadataResponse>> getAllMetadata() {
        MetadataResponse response = metadataService.getAllMetadata();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}

