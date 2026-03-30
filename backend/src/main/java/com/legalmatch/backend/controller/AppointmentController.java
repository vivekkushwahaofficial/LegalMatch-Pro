package com.legalmatch.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.entity.Appointment;
import com.legalmatch.backend.service.AppointmentService;

@RestController
@RequestMapping({"/api/appointments", "/appointments"})
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return service.createAppointment(appointment);
    }

    @GetMapping("/my")
    public List<Appointment> getAppointments() {
        return service.getAppointments();
    }

    @PutMapping("/{id}/update")
    public Appointment updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment
    ) {
        return service.updateAppointment(id, appointment);
    }
}
