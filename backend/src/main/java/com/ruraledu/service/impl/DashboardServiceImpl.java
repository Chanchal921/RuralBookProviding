package com.ruraledu.service.impl;

import com.ruraledu.dto.*;
import com.ruraledu.entity.User;
import com.ruraledu.enums.RequestStatus;
import com.ruraledu.enums.ResourceStatus;
import com.ruraledu.enums.Role;
import com.ruraledu.mapper.ResourceMapper;
import com.ruraledu.mapper.ResourceRequestMapper;
import com.ruraledu.repository.DonationRepository;
import com.ruraledu.repository.ResourceRepository;
import com.ruraledu.repository.ResourceRequestRepository;
import com.ruraledu.repository.UserRepository;
import com.ruraledu.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceRequestRepository requestRepository;
    private final DonationRepository donationRepository;
    private final ResourceMapper resourceMapper;
    private final ResourceRequestMapper requestMapper;

    public DashboardServiceImpl(UserRepository userRepository,
                                ResourceRepository resourceRepository,
                                ResourceRequestRepository requestRepository,
                                DonationRepository donationRepository,
                                ResourceMapper resourceMapper,
                                ResourceRequestMapper requestMapper) {
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.requestRepository = requestRepository;
        this.donationRepository = donationRepository;
        this.resourceMapper = resourceMapper;
        this.requestMapper = requestMapper;
    }

    @Override
    public StudentDashboardResponse getStudentDashboard(User user) {
        StudentDashboardResponse dto = new StudentDashboardResponse();
        dto.setTotalAvailableResources(resourceRepository.countByStatus(ResourceStatus.APPROVED));
        dto.setMyTotalRequests(requestRepository.countByRequesterId(user.getId()));
        dto.setMyPendingRequests(requestRepository.countByRequesterIdAndStatus(user.getId(), RequestStatus.PENDING));
        dto.setMyMatchedRequests(requestRepository.countByRequesterIdAndStatus(user.getId(), RequestStatus.MATCHED));

        dto.setRecentlyAddedResources(
                resourceRepository.findTop5ByStatusOrderByCreatedAtDesc(ResourceStatus.APPROVED)
                        .stream().map(resourceMapper::toResponse).collect(Collectors.toList())
        );

        dto.setMyRecentRequests(
                requestRepository.findTop5ByRequesterIdOrderByCreatedAtDesc(user.getId())
                        .stream().map(requestMapper::toResponse).collect(Collectors.toList())
        );

        return dto;
    }

    @Override
    public DonorDashboardResponse getDonorDashboard(User user) {
        DonorDashboardResponse dto = new DonorDashboardResponse();
        dto.setTotalUploaded(resourceRepository.countByUploadedById(user.getId()));
        dto.setApprovedUploads(resourceRepository.countByUploadedByIdAndStatus(user.getId(), ResourceStatus.APPROVED));
        dto.setPendingUploads(resourceRepository.countByUploadedByIdAndStatus(user.getId(), ResourceStatus.PENDING));
        dto.setRejectedUploads(resourceRepository.countByUploadedByIdAndStatus(user.getId(), ResourceStatus.REJECTED));
        dto.setTotalDonations(donationRepository.countByDonorId(user.getId()));

        dto.setRecentUploads(
                resourceRepository.findTop5ByUploadedByIdOrderByCreatedAtDesc(user.getId())
                        .stream().map(resourceMapper::toResponse).collect(Collectors.toList())
        );

        return dto;
    }

    @Override
    public TeacherDashboardResponse getTeacherDashboard(User user) {
        TeacherDashboardResponse dto = new TeacherDashboardResponse();
        dto.setAvailableResources(resourceRepository.countByStatus(ResourceStatus.APPROVED));
        dto.setMyUploadedResources(resourceRepository.countByUploadedById(user.getId()));
        dto.setMyRequests(requestRepository.countByRequesterId(user.getId()));
        dto.setPendingRequests(requestRepository.countByRequesterIdAndStatus(user.getId(), RequestStatus.PENDING));
        dto.setMatchedRequests(requestRepository.countByRequesterIdAndStatus(user.getId(), RequestStatus.MATCHED));

        dto.setRecentResources(
                resourceRepository.findTop5ByStatusOrderByCreatedAtDesc(ResourceStatus.APPROVED)
                        .stream().map(resourceMapper::toResponse).collect(Collectors.toList())
        );

        dto.setMyRecentRequests(
                requestRepository.findTop5ByRequesterIdOrderByCreatedAtDesc(user.getId())
                        .stream().map(requestMapper::toResponse).collect(Collectors.toList())
        );

        return dto;
    }

    @Override
    public NgoDashboardResponse getNgoDashboard(User user) {
        NgoDashboardResponse dto = new NgoDashboardResponse();
        dto.setTotalUploaded(resourceRepository.countByUploadedById(user.getId()));
        dto.setApprovedResources(resourceRepository.countByUploadedByIdAndStatus(user.getId(), ResourceStatus.APPROVED));
        dto.setPendingSubmissions(resourceRepository.countByUploadedByIdAndStatus(user.getId(), ResourceStatus.PENDING));
        dto.setTotalOpenRequests(requestRepository.countByStatus(RequestStatus.PENDING));

        dto.setRecentUploads(
                resourceRepository.findTop5ByUploadedByIdOrderByCreatedAtDesc(user.getId())
                        .stream().map(resourceMapper::toResponse).collect(Collectors.toList())
        );

        return dto;
    }

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        AdminDashboardResponse dto = new AdminDashboardResponse();

        dto.setTotalUsers(userRepository.count());
        dto.setStudentsCount(userRepository.countByRole(Role.STUDENT));
        dto.setDonorsCount(userRepository.countByRole(Role.DONOR));
        dto.setTeachersCount(userRepository.countByRole(Role.TEACHER));
        dto.setNgosCount(userRepository.countByRole(Role.NGO));

        dto.setTotalResources(resourceRepository.count());
        dto.setPendingResources(resourceRepository.countByStatus(ResourceStatus.PENDING));
        dto.setApprovedResources(resourceRepository.countByStatus(ResourceStatus.APPROVED));
        dto.setRejectedResources(resourceRepository.countByStatus(ResourceStatus.REJECTED));
        dto.setDeactivatedResources(resourceRepository.countByStatus(ResourceStatus.DEACTIVATED));

        dto.setTotalRequests(requestRepository.count());
        dto.setPendingRequests(requestRepository.countByStatus(RequestStatus.PENDING));
        dto.setMatchedRequests(requestRepository.countByStatus(RequestStatus.MATCHED));
        dto.setCompletedRequests(requestRepository.countByStatus(RequestStatus.COMPLETED));

        dto.setRecentResources(
                resourceRepository.findTop5ByStatusOrderByCreatedAtDesc(ResourceStatus.APPROVED)
                        .stream().map(resourceMapper::toResponse).collect(Collectors.toList())
        );

        dto.setRecentRequests(
                requestRepository.findTop5ByOrderByCreatedAtDesc()
                        .stream().map(requestMapper::toResponse).collect(Collectors.toList())
        );

        return dto;
    }
}

