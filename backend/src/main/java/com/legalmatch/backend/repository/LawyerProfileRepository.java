package com.legalmatch.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.LawyerProfile;

public interface LawyerProfileRepository extends JpaRepository<LawyerProfile, Long> {
}