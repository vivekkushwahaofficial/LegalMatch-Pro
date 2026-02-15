package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.NgoProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NgoProfileRepository extends JpaRepository<NgoProfile, Long> {
}
