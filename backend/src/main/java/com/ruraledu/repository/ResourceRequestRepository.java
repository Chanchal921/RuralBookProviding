package com.ruraledu.repository;

import com.ruraledu.entity.ResourceRequest;
import com.ruraledu.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRequestRepository extends JpaRepository<ResourceRequest, Long> {

    Page<ResourceRequest> findByRequesterId(Long requesterId, Pageable pageable);

    @Query("SELECT req FROM ResourceRequest req WHERE " +
           "(:status IS NULL OR req.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(req.resourceName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(req.reason) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<ResourceRequest> searchAdminRequests(
            @Param("status") RequestStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(RequestStatus status);

    long countByRequesterId(Long requesterId);

    long countByRequesterIdAndStatus(Long requesterId, RequestStatus status);

    List<ResourceRequest> findTop5ByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    List<ResourceRequest> findTop5ByOrderByCreatedAtDesc();
}

