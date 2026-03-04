package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.LawyerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LawyerProfileRepository extends JpaRepository<LawyerProfile, Long> {

    // filter by specialization
    List<LawyerProfile> findBySpecializationIgnoreCase(String specialization);

    // filter by location
    List<LawyerProfile> findByLocationIgnoreCase(String location);

    // filter verified lawyers
    List<LawyerProfile> findByVerifiedTrue();

    // combined filter
    List<LawyerProfile> findBySpecializationIgnoreCaseAndLocationIgnoreCase(
            String specialization,
            String location
    );
}