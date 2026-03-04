package com.legalmatch.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.legalmatch.backend.entity.NgoProfile;

import java.util.List;

public interface NgoProfileRepository extends JpaRepository<NgoProfile, Long> {

    // Filter NGOs by location
    List<NgoProfile> findByLocationIgnoreCase(String location);

    // Get only verified NGOs
    List<NgoProfile> findByVerifiedTrue();

    // Filter by location AND verification status
    List<NgoProfile> findByLocationIgnoreCaseAndVerified(String location, boolean verified);
}