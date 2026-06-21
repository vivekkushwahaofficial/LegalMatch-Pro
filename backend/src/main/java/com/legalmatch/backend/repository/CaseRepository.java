package com.legalmatch.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;

public interface CaseRepository extends JpaRepository<Case, Long> {

    List<Case> findByUserId(Long userId);

    // Find all cases created by a specific user (Citizen)
    List<Case> findByUser(User user);

    // Find cases by status (for admin search)
    List<Case> findByStatus(String status);

    long countByStatusIgnoreCase(String status);

    @Query("SELECT c.createdAt FROM Case c WHERE c.createdAt BETWEEN :start AND :end")
    List<java.time.LocalDateTime> findCreatedAtBetween(
            @Param("start") java.time.LocalDateTime start,
            @Param("end") java.time.LocalDateTime end);

    @Query("SELECT c.location FROM Case c WHERE c.location IS NOT NULL")
    List<String> findAllLocations();
}
