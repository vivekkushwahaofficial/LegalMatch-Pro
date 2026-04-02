package com.legalmatch.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;

public interface CaseRepository extends JpaRepository<Case, Long> {

    List<Case> findByUserId(Long userId);

    // Find all cases created by a specific user (Citizen)
    List<Case> findByUser(User user);

    // Find cases by status (for admin search)
    List<Case> findByStatus(String status);

    long countByStatusIgnoreCase(String status);

}
