package com.ruraledu.repository;

import com.ruraledu.entity.ClassLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassLevelRepository extends JpaRepository<ClassLevel, Long> {
    Optional<ClassLevel> findByName(String name);
    List<ClassLevel> findAllByOrderByStandardOrderAsc();
}

