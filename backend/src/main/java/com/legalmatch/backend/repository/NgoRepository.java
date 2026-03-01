package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Ngo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NgoRepository extends JpaRepository<Ngo, Long> {

    List<Ngo> findByVerifiedTrue();

    List<Ngo> findByLocationIgnoreCase(String location);
}