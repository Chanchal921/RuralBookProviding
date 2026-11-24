package com.ruraledu.repository;

import com.ruraledu.entity.Resource;
import com.ruraledu.enums.ResourceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    @Query("SELECT r FROM Resource r WHERE " +
           "r.status = :status AND " +
           "(:subjectId IS NULL OR r.subject.id = :subjectId) AND " +
           "(:classLevelId IS NULL OR r.classLevel.id = :classLevelId) AND " +
           "(:resourceTypeId IS NULL OR r.resourceType.id = :resourceTypeId) AND " +
           "(:keyword IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Resource> searchApprovedResources(
            @Param("status") ResourceStatus status,
            @Param("keyword") String keyword,
            @Param("subjectId") Long subjectId,
            @Param("classLevelId") Long classLevelId,
            @Param("resourceTypeId") Long resourceTypeId,
            Pageable pageable
    );

    Page<Resource> findByUploadedById(Long uploadedById, Pageable pageable);

    Page<Resource> findByStatus(ResourceStatus status, Pageable pageable);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Resource> searchAdminResources(
            @Param("status") ResourceStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(ResourceStatus status);

    long countByUploadedById(Long uploadedById);

    long countByUploadedByIdAndStatus(Long uploadedById, ResourceStatus status);

    List<Resource> findTop5ByStatusOrderByCreatedAtDesc(ResourceStatus status);

    List<Resource> findTop5ByUploadedByIdOrderByCreatedAtDesc(Long uploadedById);

    // Matching query for Resource Requests:
    // Finds approved resources that match either subject and class level, or keywords in title
    @Query("SELECT r FROM Resource r WHERE r.status = 'APPROVED' AND (" +
           "(r.subject.id = :subjectId AND r.classLevel.id = :classLevelId) OR " +
           "(r.subject.id = :subjectId) OR " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')))" +
           ") ORDER BY CASE WHEN (r.subject.id = :subjectId AND r.classLevel.id = :classLevelId) THEN 1 ELSE 2 END")
    List<Resource> findPotentialMatches(
            @Param("subjectId") Long subjectId,
            @Param("classLevelId") Long classLevelId,
            @Param("keyword") String keyword
    );
}

