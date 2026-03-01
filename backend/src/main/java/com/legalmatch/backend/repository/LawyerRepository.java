package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Lawyer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LawyerRepository extends JpaRepository<Lawyer, Long> {

    List<Lawyer> findByVerifiedTrue();

    List<Lawyer> findByLocationIgnoreCase(String location);
}