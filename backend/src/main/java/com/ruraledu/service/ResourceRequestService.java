package com.ruraledu.service;

import com.ruraledu.dto.CreateResourceRequest;
import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.ResourceResponse;
import com.ruraledu.dto.ResourceRequestResponse;
import com.ruraledu.dto.UpdateRequestStatusRequest;
import com.ruraledu.entity.User;
import com.ruraledu.enums.RequestStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResourceRequestService {
    ResourceRequestResponse createRequest(CreateResourceRequest request, User user);
    PageResponse<ResourceRequestResponse> getMyRequests(User user, Pageable pageable);
    ResourceRequestResponse getRequestById(Long id, User currentUser);
    PageResponse<ResourceRequestResponse> getAdminRequests(RequestStatus status, String keyword, Pageable pageable);
    ResourceRequestResponse updateRequestStatus(Long id, UpdateRequestStatusRequest request, User admin);
    List<ResourceResponse> findMatches(Long requestId);
}

