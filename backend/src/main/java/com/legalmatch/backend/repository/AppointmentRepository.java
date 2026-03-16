package com.legalmatch.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}