package com.legalmatch.backend.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.Match;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.MatchRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;
import com.legalmatch.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class MatchingServiceAuthorizationTest {

    @Mock
    private MatchRepository matchRepository;
    @Mock
    private CaseRepository caseRepository;
    @Mock
    private LawyerProfileRepository lawyerProfileRepository;
    @Mock
    private NgoProfileRepository ngoProfileRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProfileService profileService;
    @Mock
    private ImpactService impactService;
    @Mock
    private NotificationService notificationService;

    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        matchingService = new MatchingService(
                matchRepository,
                caseRepository,
                lawyerProfileRepository,
                ngoProfileRepository,
                userRepository,
                profileService,
                impactService,
                notificationService
        );
    }

    @Test
    void getAuthorizedMatch_deniesUnrelatedUser() {
        User caseOwner = user(1L, Role.CITIZEN, "Citizen");
        User provider = user(2L, Role.LAWYER, "Lawyer");
        User unrelated = user(3L, Role.NGO, "Other");

        Match match = match(10L, "APPROVED", caseOwner, provider);

        when(matchRepository.findById(10L)).thenReturn(Optional.of(match));
        when(profileService.getCurrentUser()).thenReturn(unrelated);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> matchingService.getAuthorizedMatch(10L));
        assertTrue(ex.getMessage().contains("Unauthorized"));
    }

    @Test
    void getAuthorizedMatch_allowsCaseOwner() {
        User caseOwner = user(1L, Role.CITIZEN, "Citizen");
        User provider = user(2L, Role.LAWYER, "Lawyer");
        Match match = match(10L, "APPROVED", caseOwner, provider);

        when(matchRepository.findById(10L)).thenReturn(Optional.of(match));
        when(profileService.getCurrentUser()).thenReturn(caseOwner);

        Match result = matchingService.getAuthorizedMatch(10L);
        assertEquals(10L, result.getMatchId());
    }

    @Test
    void getAuthorizedAcceptedMatch_rejectsPendingMatch() {
        User caseOwner = user(1L, Role.CITIZEN, "Citizen");
        User provider = user(2L, Role.LAWYER, "Lawyer");
        Match match = match(10L, "PENDING", caseOwner, provider);

        when(matchRepository.findById(10L)).thenReturn(Optional.of(match));
        when(profileService.getCurrentUser()).thenReturn(caseOwner);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> matchingService.getAuthorizedAcceptedMatch(10L));
        assertTrue(ex.getMessage().contains("not accepted"));
    }

    private static User user(Long id, Role role, String name) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        user.setName(name);
        return user;
    }

    private static Match match(Long matchId, String status, User caseOwner, User provider) {
        Case legalCase = new Case();
        legalCase.setId(100L);
        legalCase.setTitle("Case Title");
        legalCase.setUser(caseOwner);

        Match match = new Match();
        match.setMatchId(matchId);
        match.setLegalCase(legalCase);
        match.setMatchedUser(provider);
        match.setMatchStatus(status);
        return match;
    }
}
