package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.ImpactLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ImpactLogRepository extends JpaRepository<ImpactLog, Long> {
    Optional<ImpactLog> findByProviderId(Long providerId);
}
