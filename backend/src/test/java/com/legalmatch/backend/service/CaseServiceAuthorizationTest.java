package com.legalmatch.backend.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CaseServiceAuthorizationTest {

    @Mock
    private CaseRepository caseRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private MatchingService matchingService;
    @Mock
    private NotificationService notificationService;

    private CaseService caseService;

    @BeforeEach
    void setUp() {
        caseService = new CaseService(caseRepository, userRepository, matchingService, notificationService);
    }

    @Test
    void getCaseById_deniesCitizenReadingAnotherUsersCase() {
        User caseOwner = user(1L, Role.CITIZEN, "owner@test.com");
        User requester = user(2L, Role.CITIZEN, "requester@test.com");

        Case legalCase = new Case();
        legalCase.setId(100L);
        legalCase.setUser(caseOwner);

        when(caseRepository.findById(100L)).thenReturn(Optional.of(legalCase));
        when(userRepository.findByEmail("requester@test.com")).thenReturn(Optional.of(requester));

        assertThrows(RuntimeException.class, () -> caseService.getCaseById(100L, "requester@test.com"));
    }

    @Test
    void updateCaseStatus_normalizesInputToMilestoneEnum() {
        Case legalCase = new Case();
        legalCase.setId(100L);
        legalCase.setStatus("SUBMITTED");
        legalCase.setUser(user(1L, Role.CITIZEN, "owner@test.com"));

        when(caseRepository.findById(100L)).thenReturn(Optional.of(legalCase));
        when(caseRepository.save(any(Case.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CaseResponse updated = caseService.updateCaseStatus(100L, "in review");
        assertEquals("IN_REVIEW", updated.getStatus());
    }

    @Test
    void searchByStatus_normalizesBeforeQuery() {
        doReturn(java.util.List.of()).when(caseRepository).findByStatus(eq("IN_REVIEW"));

        caseService.searchByStatus("in-review");
        verify(caseRepository).findByStatus("IN_REVIEW");
    }

    @Test
    void updateCaseStatus_rejectsInvalidStatus() {
        Case legalCase = new Case();
        legalCase.setId(100L);
        legalCase.setStatus("SUBMITTED");
        legalCase.setUser(user(1L, Role.CITIZEN, "owner@test.com"));

        when(caseRepository.findById(100L)).thenReturn(Optional.of(legalCase));

        assertThrows(RuntimeException.class, () -> caseService.updateCaseStatus(100L, "CLOSED"));
    }

    private static User user(Long id, Role role, String email) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        user.setEmail(email);
        return user;
    }
}
