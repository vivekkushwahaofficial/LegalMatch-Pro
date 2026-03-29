package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseRepository extends JpaRepository<Case, Long> {

    // Find all cases created by a specific user (Citizen)
    List<Case> findByUser(User user);

    // Find cases by status (for admin search)
    List<Case> findByStatus(String status);

}