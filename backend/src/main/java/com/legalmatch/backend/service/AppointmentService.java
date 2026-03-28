package com.legalmatch.backend.service;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.legalmatch.backend.entity.Appointment;
import com.legalmatch.backend.entity.Match;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.AppointmentRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;
    private final MatchingService matchingService;
    private final ProfileService profileService;
    private final NotificationService notificationService;

    public AppointmentService(AppointmentRepository repository,
            MatchingService matchingService,
            ProfileService profileService,
            NotificationService notificationService) {
        this.repository = repository;
        this.matchingService = matchingService;
        this.profileService = profileService;
        this.notificationService = notificationService;
    }

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        if (appointment.getMatchId() == null) {
            throw new RuntimeException("matchId is required");
        }

        Match match = matchingService.getAuthorizedAcceptedMatch(appointment.getMatchId());
        User currentUser = profileService.getCurrentUser();

        appointment.setCreatedByUserId(currentUser.getId());
        appointment.setCaseId(match.getLegalCase().getId());
        appointment.setCitizenName(match.getLegalCase().getUser().getName());
        appointment.setLawyerName(match.getMatchedUser().getName());

        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("SCHEDULED");
        } else {
            appointment.setStatus(appointment.getStatus().toUpperCase(Locale.ROOT));
        }

        Appointment saved = repository.save(appointment);

        Long caseOwnerId = match.getLegalCase().getUser().getId();
        Long providerId = match.getMatchedUser().getId();
        Long recipientId = currentUser.getId().equals(caseOwnerId) ? providerId : caseOwnerId;

        notificationService.createNotification(
                recipientId,
                "New appointment scheduled for case: " + match.getLegalCase().getTitle(),
                "APPOINTMENT_SCHEDULED"
        );

        return saved;
    }

    public List<Appointment> getAppointments() {
        List<Long> myMatchIds = matchingService.getMyMatches()
                .stream()
                .map(m -> m.getMatchId())
                .collect(Collectors.toList());

        if (myMatchIds.isEmpty()) {
            return List.of();
        }

        return repository.findByMatchIdInOrderByDateAscTimeAsc(myMatchIds);
    }

    @Transactional
    public Appointment updateAppointment(Long id, Appointment updated) {
        Appointment appointment = repository.findById(Objects.requireNonNull(id, "appointment id is required")).orElseThrow();

        Match match = matchingService.getAuthorizedAcceptedMatch(appointment.getMatchId());
        User currentUser = profileService.getCurrentUser();

        if (updated.getDate() != null) {
            appointment.setDate(updated.getDate());
        }
        if (updated.getTime() != null) {
            appointment.setTime(updated.getTime());
        }
        if (updated.getAppointmentTime() != null) {
            appointment.setAppointmentTime(updated.getAppointmentTime());
        }
        if (updated.getStatus() != null && !updated.getStatus().isBlank()) {
            appointment.setStatus(updated.getStatus().toUpperCase(Locale.ROOT));
        }

        Appointment saved = repository.save(appointment);

        Long caseOwnerId = match.getLegalCase().getUser().getId();
        Long providerId = match.getMatchedUser().getId();
        Long recipientId = currentUser.getId().equals(caseOwnerId) ? providerId : caseOwnerId;

        notificationService.createNotification(
                recipientId,
                "Appointment updated for case: " + match.getLegalCase().getTitle(),
                "APPOINTMENT_UPDATED"
        );

        return saved;
    }
}
