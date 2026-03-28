package com.legalmatch.backend.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.legalmatch.backend.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByMatchIdInOrderByDateAscTimeAsc(Collection<Long> matchIds);
}
