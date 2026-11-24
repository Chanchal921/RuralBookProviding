package com.ruraledu.service.impl;

import com.ruraledu.dto.CreateResourceRequest;
import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.ResourceRequestResponse;
import com.ruraledu.dto.ResourceResponse;
import com.ruraledu.dto.UpdateRequestStatusRequest;
import com.ruraledu.entity.ClassLevel;
import com.ruraledu.entity.Resource;
import com.ruraledu.entity.ResourceRequest;
import com.ruraledu.entity.ResourceType;
import com.ruraledu.entity.Subject;
import com.ruraledu.entity.User;
import com.ruraledu.enums.RequestStatus;
import com.ruraledu.enums.Role;
import com.ruraledu.exception.InvalidStatusTransitionException;
import com.ruraledu.exception.ResourceNotFoundException;
import com.ruraledu.mapper.ResourceMapper;
import com.ruraledu.mapper.ResourceRequestMapper;
import com.ruraledu.repository.ClassLevelRepository;
import com.ruraledu.repository.ResourceRepository;
import com.ruraledu.repository.ResourceRequestRepository;
import com.ruraledu.repository.ResourceTypeRepository;
import com.ruraledu.repository.SubjectRepository;
import com.ruraledu.service.ResourceRequestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResourceRequestServiceImpl implements ResourceRequestService {

    private final ResourceRequestRepository requestRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceTypeRepository resourceTypeRepository;
    private final SubjectRepository subjectRepository;
    private final ClassLevelRepository classLevelRepository;
    private final ResourceRequestMapper requestMapper;
    private final ResourceMapper resourceMapper;

    public ResourceRequestServiceImpl(ResourceRequestRepository requestRepository,
                                      ResourceRepository resourceRepository,
                                      ResourceTypeRepository resourceTypeRepository,
                                      SubjectRepository subjectRepository,
                                      ClassLevelRepository classLevelRepository,
                                      ResourceRequestMapper requestMapper,
                                      ResourceMapper resourceMapper) {
        this.requestRepository = requestRepository;
        this.resourceRepository = resourceRepository;
        this.resourceTypeRepository = resourceTypeRepository;
        this.subjectRepository = subjectRepository;
        this.classLevelRepository = classLevelRepository;
        this.requestMapper = requestMapper;
        this.resourceMapper = resourceMapper;
    }

    @Override
    public ResourceRequestResponse createRequest(CreateResourceRequest request, User user) {
        ClassLevel classLevel = classLevelRepository.findById(request.getClassLevelId())
                .orElseThrow(() -> new ResourceNotFoundException("Class level not found with id: " + request.getClassLevelId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        ResourceType resourceType = resourceTypeRepository.findById(request.getResourceTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource type not found with id: " + request.getResourceTypeId()));

        ResourceRequest entity = new ResourceRequest();
        entity.setRequester(user);
        entity.setResourceName(request.getResourceName().trim());
        entity.setClassLevel(classLevel);
        entity.setSubject(subject);
        entity.setResourceType(resourceType);
        entity.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        entity.setReason(request.getReason().trim());
        entity.setStatus(RequestStatus.PENDING);

        // Normalized matching check against approved resources:
        List<Resource> potentialMatches = resourceRepository.findPotentialMatches(
                subject.getId(),
                classLevel.getId(),
                request.getResourceName().trim()
        );

        if (!potentialMatches.isEmpty()) {
            Resource bestMatch = potentialMatches.get(0);
            entity.setMatchedResource(bestMatch);
            entity.setStatus(RequestStatus.MATCHED);
            entity.setAdminRemarks("Automatically matched with approved resource: " + bestMatch.getTitle());
        }

        ResourceRequest saved = requestRepository.save(entity);
        return requestMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ResourceRequestResponse> getMyRequests(User user, Pageable pageable) {
        Page<ResourceRequest> page = requestRepository.findByRequesterId(user.getId(), pageable);
        return PageResponse.from(page.map(requestMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceRequestResponse getRequestById(Long id, User currentUser) {
        ResourceRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource request not found with id: " + id));

        boolean isOwner = request.getRequester().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You do not have permission to view this request.");
        }

        return requestMapper.toResponse(request);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ResourceRequestResponse> getAdminRequests(RequestStatus status, String keyword, Pageable pageable) {
        Page<ResourceRequest> page = requestRepository.searchAdminRequests(
                status,
                (keyword != null && !keyword.isBlank()) ? keyword.trim() : null,
                pageable
        );
        return PageResponse.from(page.map(requestMapper::toResponse));
    }

    @Override
    public ResourceRequestResponse updateRequestStatus(Long id, UpdateRequestStatusRequest request, User admin) {
        ResourceRequest entity = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource request not found with id: " + id));

        RequestStatus currentStatus = entity.getStatus();
        RequestStatus targetStatus = request.getStatus();

        // Validate state machine lifecycle:
        // PENDING -> MATCHED, APPROVED, REJECTED
        // MATCHED -> APPROVED, REJECTED
        // APPROVED -> COMPLETED
        boolean isValid = false;
        if (currentStatus == RequestStatus.PENDING) {
            isValid = (targetStatus == RequestStatus.MATCHED ||
                       targetStatus == RequestStatus.APPROVED ||
                       targetStatus == RequestStatus.REJECTED);
        } else if (currentStatus == RequestStatus.MATCHED) {
            isValid = (targetStatus == RequestStatus.APPROVED ||
                       targetStatus == RequestStatus.REJECTED);
        } else if (currentStatus == RequestStatus.APPROVED) {
            isValid = (targetStatus == RequestStatus.COMPLETED);
        }

        if (!isValid) {
            throw new InvalidStatusTransitionException(
                    "Invalid state transition from " + currentStatus + " to " + targetStatus +
                    ". Permitted flows: PENDING -> [MATCHED, APPROVED, REJECTED], MATCHED -> [APPROVED, REJECTED], APPROVED -> [COMPLETED]."
            );
        }

        entity.setStatus(targetStatus);

        if (request.getMatchedResourceId() != null) {
            Resource matched = resourceRepository.findById(request.getMatchedResourceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Matched resource not found with id: " + request.getMatchedResourceId()));
            entity.setMatchedResource(matched);
        }

        if (request.getAdminRemarks() != null && !request.getAdminRemarks().isBlank()) {
            entity.setAdminRemarks(request.getAdminRemarks().trim());
        }

        entity.setReviewedBy(admin);

        ResourceRequest updated = requestRepository.save(entity);
        return requestMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResourceResponse> findMatches(Long requestId) {
        ResourceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource request not found with id: " + requestId));

        List<Resource> matches = resourceRepository.findPotentialMatches(
                request.getSubject().getId(),
                request.getClassLevel().getId(),
                request.getResourceName()
        );

        return matches.stream().map(resourceMapper::toResponse).collect(Collectors.toList());
    }
}

