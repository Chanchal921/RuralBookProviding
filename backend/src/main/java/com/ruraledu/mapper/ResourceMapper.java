package com.ruraledu.mapper;

import com.ruraledu.dto.ResourceResponse;
import com.ruraledu.entity.Resource;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {

    public ResourceResponse toResponse(Resource resource) {
        if (resource == null) {
            return null;
        }

        ResourceResponse dto = new ResourceResponse();
        dto.setId(resource.getId());
        dto.setTitle(resource.getTitle());
        dto.setDescription(resource.getDescription());

        if (resource.getResourceType() != null) {
            dto.setResourceTypeId(resource.getResourceType().getId());
            dto.setResourceTypeName(resource.getResourceType().getName());
        }

        if (resource.getSubject() != null) {
            dto.setSubjectId(resource.getSubject().getId());
            dto.setSubjectName(resource.getSubject().getName());
        }

        if (resource.getClassLevel() != null) {
            dto.setClassLevelId(resource.getClassLevel().getId());
            dto.setClassLevelName(resource.getClassLevel().getName());
        }

        if (resource.getUploadedBy() != null) {
            dto.setUploadedById(resource.getUploadedBy().getId());
            dto.setUploadedByName(resource.getUploadedBy().getFullName());
            dto.setUploadedByOrg(resource.getUploadedBy().getOrganizationName());
        }

        dto.setFilePath(resource.getFilePath());
        dto.setFileName(resource.getFileName());
        dto.setFileSize(resource.getFileSize());
        dto.setFileType(resource.getFileType());
        dto.setExternalUrl(resource.getExternalUrl());
        dto.setStatus(resource.getStatus());
        dto.setAdminRemarks(resource.getAdminRemarks());

        if (resource.getReviewedBy() != null) {
            dto.setReviewedById(resource.getReviewedBy().getId());
            dto.setReviewedByName(resource.getReviewedBy().getFullName());
        }

        dto.setReviewedAt(resource.getReviewedAt());
        dto.setCreatedAt(resource.getCreatedAt());
        dto.setUpdatedAt(resource.getUpdatedAt());

        return dto;
    }
}

