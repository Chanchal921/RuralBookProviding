package com.ruraledu.repository;

import com.ruraledu.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceTypeRepository extends JpaRepository<ResourceType, Long> {
    Optional<ResourceType> findByCode(String code);
    Optional<ResourceType> findByName(String name);
    List<ResourceType> findAllByOrderByNameAsc();
}

