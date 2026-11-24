package com.ruraledu;

import com.ruraledu.dto.*;
import com.ruraledu.entity.User;
import com.ruraledu.enums.RequestStatus;
import com.ruraledu.enums.ResourceStatus;
import com.ruraledu.enums.Role;
import com.ruraledu.exception.BadRequestException;
import com.ruraledu.exception.InvalidStatusTransitionException;
import com.ruraledu.repository.ResourceRepository;
import com.ruraledu.repository.UserRepository;
import com.ruraledu.service.AuthService;
import com.ruraledu.service.DashboardService;
import com.ruraledu.service.ResourceRequestService;
import com.ruraledu.service.ResourceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class RuralEduApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private ResourceService resourceService;

    @Autowired
    private ResourceRequestService requestService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Test
    @DisplayName("Context Loads & Master Catalogs Seeded")
    void contextLoads() {
        assertNotNull(authService);
        assertNotNull(resourceService);
        assertNotNull(requestService);
        assertNotNull(dashboardService);
    }

    @Test
    @DisplayName("User Registration & Admin Self-Registration Prevention")
    void testUserRegistration() {
        // Attempting to register as ADMIN must fail with BadRequestException
        RegisterRequest adminReq = new RegisterRequest();
        adminReq.setFullName("Malicious Hacker");
        adminReq.setEmail("hacker@fake.org");
        adminReq.setPassword("secret123");
        adminReq.setRole(Role.ADMIN);

        assertThrows(BadRequestException.class, () -> authService.register(adminReq));

        // Valid student registration must succeed
        RegisterRequest studentReq = new RegisterRequest();
        studentReq.setFullName("Test Student");
        studentReq.setEmail("test.student@school.org");
        studentReq.setPassword("student123");
        studentReq.setRole(Role.STUDENT);
        studentReq.setOrganizationName("Village Primary School");

        UserResponse userResp = authService.register(studentReq);
        assertNotNull(userResp.getId());
        assertEquals("test.student@school.org", userResp.getEmail());
        assertEquals(Role.STUDENT, userResp.getRole());

        // Duplicate email must be rejected
        assertThrows(BadRequestException.class, () -> authService.register(studentReq));
    }

    @Test
    @DisplayName("User Login & JWT Generation")
    void testUserLogin() {
        // Admin was created by DataInitializer
        LoginRequest loginReq = new LoginRequest("admin@ruraledu.org", "Admin@123");
        AuthResponse authResp = authService.login(loginReq);

        assertNotNull(authResp.getToken());
        assertEquals("Bearer", authResp.getTokenType());
        assertEquals("admin@ruraledu.org", authResp.getEmail());
        assertEquals(Role.ADMIN, authResp.getRole());
    }

    @Test
    @DisplayName("Resource Upload Lifecycle (PENDING -> APPROVED -> DEACTIVATED)")
    void testResourceLifecycle() {
        User donor = userRepository.findByEmail("sunita.donor@ruraledu.org").orElseThrow();
        User admin = userRepository.findByEmail("admin@ruraledu.org").orElseThrow();

        // 1. Upload resource with PDF file
        MockMultipartFile mockFile = new MockMultipartFile(
                "file", "algebra_notes.pdf", "application/pdf", "Sample PDF content".getBytes()
        );

        ResourceUploadRequest uploadReq = new ResourceUploadRequest();
        uploadReq.setTitle("High School Algebra Reference Notes");
        uploadReq.setDescription("Concise chapter summary for Class 10");
        uploadReq.setResourceTypeId(2L); // Notes
        uploadReq.setSubjectId(1L); // Mathematics
        uploadReq.setClassLevelId(3L); // Secondary

        ResourceResponse created = resourceService.uploadResource(uploadReq, mockFile, donor);
        assertNotNull(created.getId());
        assertEquals(ResourceStatus.PENDING, created.getStatus()); // Must start as PENDING

        // 2. Admin Approves
        ResourceResponse approved = resourceService.approveResource(created.getId(), "Approved for publication", admin);
        assertEquals(ResourceStatus.APPROVED, approved.getStatus());

        // 3. Invalid transition test: approving an already approved resource must throw
        assertThrows(InvalidStatusTransitionException.class, () ->
                resourceService.approveResource(created.getId(), "Approve again", admin)
        );

        // 4. Admin Deactivates
        ResourceResponse deactivated = resourceService.deactivateResource(created.getId(), "Outdated content", admin);
        assertEquals(ResourceStatus.DEACTIVATED, deactivated.getStatus());
    }

    @Test
    @DisplayName("Resource Request Creation, Auto-Matching & Lifecycle")
    void testResourceRequestLifecycle() {
        User student = userRepository.findByEmail("aarav.student@ruraledu.org").orElseThrow();
        User admin = userRepository.findByEmail("admin@ruraledu.org").orElseThrow();

        // Submit request matching the existing approved Mathematics resource
        CreateResourceRequest req = new CreateResourceRequest();
        req.setResourceName("Mathematics Solved Problems");
        req.setClassLevelId(3L); // Secondary
        req.setSubjectId(1L); // Mathematics
        req.setResourceTypeId(1L); // Textbook
        req.setQuantity(1);
        req.setReason("Need reference questions for class test");

        ResourceRequestResponse created = requestService.createRequest(req, student);
        assertNotNull(created.getId());
        // Should match against the existing approved NCERT Mathematics Solved Problems!
        assertEquals(RequestStatus.MATCHED, created.getStatus());
        assertNotNull(created.getMatchedResourceId());

        // Admin updates status to APPROVED
        UpdateRequestStatusRequest updateReq = new UpdateRequestStatusRequest(RequestStatus.APPROVED, created.getMatchedResourceId(), "Verified by admin");
        ResourceRequestResponse approvedReq = requestService.updateRequestStatus(created.getId(), updateReq, admin);
        assertEquals(RequestStatus.APPROVED, approvedReq.getStatus());

        // Admin completes request
        UpdateRequestStatusRequest completeReq = new UpdateRequestStatusRequest(RequestStatus.COMPLETED, null, "Fulfilled");
        ResourceRequestResponse completedReq = requestService.updateRequestStatus(created.getId(), completeReq, admin);
        assertEquals(RequestStatus.COMPLETED, completedReq.getStatus());
    }

    @Test
    @DisplayName("Admin Dashboard Aggregate Metrics from Real DB")
    void testAdminDashboardMetrics() {
        AdminDashboardResponse adminDash = dashboardService.getAdminDashboard();
        assertNotNull(adminDash);
        assertTrue(adminDash.getTotalUsers() >= 5);
        assertTrue(adminDash.getTotalResources() >= 4);
        assertTrue(adminDash.getTotalRequests() >= 2);
    }
}

