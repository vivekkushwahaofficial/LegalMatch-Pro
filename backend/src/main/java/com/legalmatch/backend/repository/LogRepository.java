package com.legalmatch.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.Log;

public interface LogRepository extends JpaRepository<Log, Long> {

    List<Log> findByType(String type);
}
