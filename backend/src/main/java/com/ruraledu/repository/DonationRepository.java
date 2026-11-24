package com.ruraledu.repository;

import com.ruraledu.entity.Donation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    Page<Donation> findByDonorId(Long donorId, Pageable pageable);
    long countByDonorId(Long donorId);
}

