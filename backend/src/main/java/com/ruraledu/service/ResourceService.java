package com.ruraledu.service;

import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.ResourceResponse;
import com.ruraledu.dto.ResourceUploadRequest;
import com.ruraledu.entity.Resource;
import com.ruraledu.entity.User;
import com.ruraledu.enums.ResourceStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ResourceService {
    ResourceResponse uploadResource(ResourceUploadRequest request, MultipartFile file, User user);
    PageResponse<ResourceResponse> getApprovedResources(String keyword, Long subjectId, Long classLevelId, Long resourceTypeId, Pageable pageable);
    ResourceResponse getResourceResponseById(Long id, User currentUser);
    Resource getResourceEntityById(Long id);
    PageResponse<ResourceResponse> getMyUploads(User user, Pageable pageable);
    PageResponse<ResourceResponse> getAdminResources(ResourceStatus status, String keyword, Pageable pageable);
    ResourceResponse approveResource(Long id, String remarks, User admin);
    ResourceResponse rejectResource(Long id, String remarks, User admin);
    ResourceResponse deactivateResource(Long id, String remarks, User admin);
    void deleteResource(Long id, User user);
}

