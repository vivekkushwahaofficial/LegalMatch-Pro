package com.legalmatch.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.NgoProfile;

import java.util.List;

public interface NgoProfileRepository extends JpaRepository<NgoProfile, Long> {
    List<NgoProfile> findByLocationIgnoreCase(String location);

    List<NgoProfile> findByVerifiedTrue();
}
