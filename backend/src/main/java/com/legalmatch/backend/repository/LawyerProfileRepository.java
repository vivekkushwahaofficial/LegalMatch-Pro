package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.LawyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LawyerProfileRepository extends JpaRepository<LawyerProfile, Long> {
}
