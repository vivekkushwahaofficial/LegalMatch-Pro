package com.legalaid.controller;

import com.legalaid.model.Appointment;
import com.legalaid.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
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