package com.legalmatch.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.VerificationStatus;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

List<User> findByStatus(VerificationStatus status);

}