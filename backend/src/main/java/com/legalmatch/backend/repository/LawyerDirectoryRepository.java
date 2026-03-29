package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.LawyerDirectory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LawyerDirectoryRepository extends JpaRepository<LawyerDirectory, Long> {
    boolean existsByNameAndLocation(String name, String location);
}
