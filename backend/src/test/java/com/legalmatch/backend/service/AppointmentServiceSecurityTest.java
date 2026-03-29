package com.legalmatch.backend.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.legalmatch.backend.entity.Appointment;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.Match;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.AppointmentRepository;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceSecurityTest {

    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private MatchingService matchingService;
    @Mock
    private ProfileService profileService;
    @Mock
    private NotificationService notificationService;

    private AppointmentService appointmentService;

    @BeforeEach
    void setUp() {
        appointmentService = new AppointmentService(
                appointmentRepository,
                matchingService,
                profileService,
                notificationService
        );
    }

    @Test
    void createAppointment_rejectsMissingMatchId() {
        Appointment appointment = new Appointment();
        RuntimeException ex = assertThrows(RuntimeException.class, () -> appointmentService.createAppointment(appointment));
        assertEquals("matchId is required", ex.getMessage());
    }

    @Test
    void createAppointment_setsDerivedFields_andNotifiesOtherParticipant() {
        User caseOwner = user(1L, Role.CITIZEN, "Citizen");
        User provider = user(2L, Role.LAWYER, "Lawyer");
        Match match = match(77L, caseOwner, provider);

        Appointment appointment = new Appointment();
        appointment.setMatchId(77L);

        when(matchingService.getAuthorizedAcceptedMatch(77L)).thenReturn(match);
        when(profileService.getCurrentUser()).thenReturn(caseOwner);
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Appointment saved = appointmentService.createAppointment(appointment);

        assertEquals("SCHEDULED", saved.getStatus());
        assertEquals(1L, saved.getCreatedByUserId());
        assertEquals(300L, saved.getCaseId());
        assertEquals("Citizen", saved.getCitizenName());
        assertEquals("Lawyer", saved.getLawyerName());

        verify(notificationService).createNotification(eq(2L), any(String.class), eq("APPOINTMENT_SCHEDULED"));
    }

    @Test
    void getAppointments_returnsEmptyWhenNoMatches() {
        when(matchingService.getMyMatches()).thenReturn(List.of());
        List<Appointment> result = appointmentService.getAppointments();
        assertEquals(0, result.size());
    }

    private static User user(Long id, Role role, String name) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        user.setName(name);
        return user;
    }

    private static Match match(Long matchId, User caseOwner, User provider) {
        Case legalCase = new Case();
        legalCase.setId(300L);
        legalCase.setTitle("Appointment Case");
        legalCase.setUser(caseOwner);

        Match match = new Match();
        match.setMatchId(matchId);
        match.setLegalCase(legalCase);
        match.setMatchedUser(provider);
        match.setMatchStatus("ACCEPTED");
        return match;
    }
}
