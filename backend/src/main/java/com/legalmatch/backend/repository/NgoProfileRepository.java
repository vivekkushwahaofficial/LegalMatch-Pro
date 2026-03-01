package com.legalmatch.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.NgoProfile;

public interface NgoProfileRepository extends JpaRepository<NgoProfile, Long> {
}
