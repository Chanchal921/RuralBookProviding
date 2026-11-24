package com.ruraledu.service.impl;

import com.ruraledu.dto.PageResponse;
import com.ruraledu.dto.ResourceResponse;
import com.ruraledu.dto.ResourceUploadRequest;
import com.ruraledu.entity.ClassLevel;
import com.ruraledu.entity.Resource;
import com.ruraledu.entity.ResourceType;
import com.ruraledu.entity.Subject;
import com.ruraledu.entity.User;
import com.ruraledu.enums.ResourceStatus;
import com.ruraledu.enums.Role;
import com.ruraledu.exception.BadRequestException;
import com.ruraledu.exception.InvalidStatusTransitionException;
import com.ruraledu.exception.ResourceNotFoundException;
import com.ruraledu.mapper.ResourceMapper;
import com.ruraledu.repository.ClassLevelRepository;
import com.ruraledu.repository.ResourceRepository;
import com.ruraledu.repository.ResourceTypeRepository;
import com.ruraledu.repository.SubjectRepository;
import com.ruraledu.service.FileStorageService;
import com.ruraledu.service.ResourceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceTypeRepository resourceTypeRepository;
    private final SubjectRepository subjectRepository;
    private final ClassLevelRepository classLevelRepository;
    private final FileStorageService fileStorageService;
    private final ResourceMapper resourceMapper;

    public ResourceServiceImpl(ResourceRepository resourceRepository,
                               ResourceTypeRepository resourceTypeRepository,
                               SubjectRepository subjectRepository,
                               ClassLevelRepository classLevelRepository,
                               FileStorageService fileStorageService,
                               ResourceMapper resourceMapper) {
        this.resourceRepository = resourceRepository;
        this.resourceTypeRepository = resourceTypeRepository;
        this.subjectRepository = subjectRepository;
        this.classLevelRepository = classLevelRepository;
        this.fileStorageService = fileStorageService;
        this.resourceMapper = resourceMapper;
    }

    @Override
    public ResourceResponse uploadResource(ResourceUploadRequest request, MultipartFile file, User user) {
        if (user.getRole() == Role.STUDENT) {
            throw new AccessDeniedException("Students are not authorized to upload resources. Use the resource request feature instead.");
        }

        boolean hasFile = (file != null && !file.isEmpty());
        boolean hasUrl = (request.getExternalUrl() != null && !request.getExternalUrl().isBlank());

        if (!hasFile && !hasUrl) {
            throw new BadRequestException("Either an educational file upload or an educational link must be provided.");
        }

        ResourceType resourceType = resourceTypeRepository.findById(request.getResourceTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource type not found with id: " + request.getResourceTypeId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        ClassLevel classLevel = classLevelRepository.findById(request.getClassLevelId())
                .orElseThrow(() -> new ResourceNotFoundException("Class level not found with id: " + request.getClassLevelId()));

        Resource resource = new Resource();
        resource.setTitle(request.getTitle().trim());
        resource.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        resource.setResourceType(resourceType);
        resource.setSubject(subject);
        resource.setClassLevel(classLevel);
        resource.setUploadedBy(user);
        resource.setStatus(ResourceStatus.PENDING); // Always PENDING initially

        if (hasFile) {
            String storedFileName = fileStorageService.storeFile(file);
            resource.setFilePath(storedFileName);
            resource.setFileName(file.getOriginalFilename());
            resource.setFileSize(file.getSize());
            resource.setFileType(file.getContentType());
        }

        if (hasUrl) {
            resource.setExternalUrl(request.getExternalUrl().trim());
        }

        Resource saved = resourceRepository.save(resource);
        return resourceMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ResourceResponse> getApprovedResources(String keyword, Long subjectId, Long classLevelId, Long resourceTypeId, Pageable pageable) {
        // Enforce APPROVED status strictly in the backend query!
        Page<Resource> page = resourceRepository.searchApprovedResources(
                ResourceStatus.APPROVED,
                (keyword != null && !keyword.isBlank()) ? keyword.trim() : null,
                subjectId,
                classLevelId,
                resourceTypeId,
                pageable
        );
        return PageResponse.from(page.map(resourceMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ResourceResponse getResourceResponseById(Long id, User currentUser) {
        Resource resource = getResourceEntityById(id);

        // If not approved, verify access: only uploader or ADMIN can view
        if (resource.getStatus() != ResourceStatus.APPROVED) {
            if (currentUser == null) {
                throw new AccessDeniedException("This resource is currently pending verification and is not publicly accessible.");
            }
            boolean isOwner = resource.getUploadedBy().getId().equals(currentUser.getId());
            boolean isAdmin = currentUser.getRole() == Role.ADMIN;
            if (!isOwner && !isAdmin) {
                throw new AccessDeniedException("You do not have permission to view this resource.");
            }
        }

        return resourceMapper.toResponse(resource);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource getResourceEntityById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ResourceResponse> getMyUploads(User user, Pageable pageable) {
        Page<Resource> page = resourceRepository.findByUploadedById(user.getId(), pageable);
        return PageResponse.from(page.map(resourceMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ResourceResponse> getAdminResources(ResourceStatus status, String keyword, Pageable pageable) {
        Page<Resource> page = resourceRepository.searchAdminResources(
                status,
                (keyword != null && !keyword.isBlank()) ? keyword.trim() : null,
                pageable
        );
        return PageResponse.from(page.map(resourceMapper::toResponse));
    }

    @Override
    public ResourceResponse approveResource(Long id, String remarks, User admin) {
        Resource resource = getResourceEntityById(id);

        if (resource.getStatus() != ResourceStatus.PENDING) {
            throw new InvalidStatusTransitionException(
                    "Invalid state transition. Only PENDING resources can be APPROVED. Current state: " + resource.getStatus()
            );
        }

        resource.setStatus(ResourceStatus.APPROVED);
        resource.setAdminRemarks(remarks);
        resource.setReviewedBy(admin);
        resource.setReviewedAt(LocalDateTime.now());

        Resource updated = resourceRepository.save(resource);
        return resourceMapper.toResponse(updated);
    }

    @Override
    public ResourceResponse rejectResource(Long id, String remarks, User admin) {
        Resource resource = getResourceEntityById(id);

        if (resource.getStatus() != ResourceStatus.PENDING) {
            throw new InvalidStatusTransitionException(
                    "Invalid state transition. Only PENDING resources can be REJECTED. Current state: " + resource.getStatus()
            );
        }

        resource.setStatus(ResourceStatus.REJECTED);
        resource.setAdminRemarks(remarks);
        resource.setReviewedBy(admin);
        resource.setReviewedAt(LocalDateTime.now());

        Resource updated = resourceRepository.save(resource);
        return resourceMapper.toResponse(updated);
    }

    @Override
    public ResourceResponse deactivateResource(Long id, String remarks, User admin) {
        Resource resource = getResourceEntityById(id);

        if (resource.getStatus() != ResourceStatus.APPROVED) {
            throw new InvalidStatusTransitionException(
                    "Invalid state transition. Only APPROVED resources can be DEACTIVATED. Current state: " + resource.getStatus()
            );
        }

        resource.setStatus(ResourceStatus.DEACTIVATED);
        resource.setAdminRemarks(remarks);
        resource.setReviewedBy(admin);
        resource.setReviewedAt(LocalDateTime.now());

        Resource updated = resourceRepository.save(resource);
        return resourceMapper.toResponse(updated);
    }

    @Override
    public void deleteResource(Long id, User user) {
        Resource resource = getResourceEntityById(id);

        boolean isOwner = resource.getUploadedBy().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isAdmin && !(isOwner && resource.getStatus() == ResourceStatus.PENDING)) {
            throw new AccessDeniedException("You do not have permission to delete this resource.");
        }

        if (resource.getFilePath() != null) {
            fileStorageService.deleteFile(resource.getFilePath());
        }

        resourceRepository.delete(resource);
    }
}

