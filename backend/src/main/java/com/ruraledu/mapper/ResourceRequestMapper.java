package com.ruraledu.mapper;

import com.ruraledu.dto.ResourceRequestResponse;
import com.ruraledu.entity.ResourceRequest;
import org.springframework.stereotype.Component;

@Component
public class ResourceRequestMapper {

    public ResourceRequestResponse toResponse(ResourceRequest request) {
        if (request == null) {
            return null;
        }

        ResourceRequestResponse dto = new ResourceRequestResponse();
        dto.setId(request.getId());

        if (request.getRequester() != null) {
            dto.setRequesterId(request.getRequester().getId());
            dto.setRequesterName(request.getRequester().getFullName());
            dto.setRequesterEmail(request.getRequester().getEmail());
            dto.setRequesterOrg(request.getRequester().getOrganizationName());
        }

        dto.setResourceName(request.getResourceName());

        if (request.getClassLevel() != null) {
            dto.setClassLevelId(request.getClassLevel().getId());
            dto.setClassLevelName(request.getClassLevel().getName());
        }

        if (request.getSubject() != null) {
            dto.setSubjectId(request.getSubject().getId());
            dto.setSubjectName(request.getSubject().getName());
        }

        if (request.getResourceType() != null) {
            dto.setResourceTypeId(request.getResourceType().getId());
            dto.setResourceTypeName(request.getResourceType().getName());
        }

        dto.setQuantity(request.getQuantity());
        dto.setReason(request.getReason());
        dto.setStatus(request.getStatus());

        if (request.getMatchedResource() != null) {
            dto.setMatchedResourceId(request.getMatchedResource().getId());
            dto.setMatchedResourceTitle(request.getMatchedResource().getTitle());
        }

        dto.setAdminRemarks(request.getAdminRemarks());

        if (request.getReviewedBy() != null) {
            dto.setReviewedById(request.getReviewedBy().getId());
            dto.setReviewedByName(request.getReviewedBy().getFullName());
        }

        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());

        return dto;
    }
}

