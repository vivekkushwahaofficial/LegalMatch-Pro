package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.Appointment;
import com.legalmatch.backend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    public Appointment createAppointment(Appointment appointment) {
        appointment.setStatus("scheduled");
        return repository.save(appointment);
    }

    public List<Appointment> getAppointments() {
        return repository.findAll();
    }

    public Appointment updateAppointment(Long id, Appointment updated) {
        Appointment appointment = repository.findById(id).orElseThrow();
        appointment.setAppointmentTime(updated.getAppointmentTime());
        return repository.save(appointment);
    }
}