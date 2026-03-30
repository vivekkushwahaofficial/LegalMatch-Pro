package com.legalmatch.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByResetToken(String resetToken);

    boolean existsByEmail(String email);

    List<User> findByStatus(VerificationStatus status);

    long countByRole(Role role);

    List<User> findByRole(Role role);

}
