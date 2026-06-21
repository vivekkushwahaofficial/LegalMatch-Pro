package com.legalmatch.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    boolean existsByEmail(String email);

    List<User> findByStatus(VerificationStatus status);

    long countByStatus(VerificationStatus status);

    long countByRole(Role role);

    List<User> findByRole(Role role);

    @Query("SELECT u.submittedDate FROM User u WHERE u.submittedDate BETWEEN :start AND :end")
    List<java.time.LocalDateTime> findSubmittedDatesBetween(
            @Param("start") java.time.LocalDateTime start,
            @Param("end") java.time.LocalDateTime end);
}
