package com.legalmatch.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.legalmatch.backend.dto.MatchResponse;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.Match;
import com.legalmatch.backend.entity.NgoProfile;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.MatchRepository;
import com.legalmatch.backend.repository.NgoProfileRepository;

@Service
public class MatchingService {

    private final MatchRepository matchRepository;
    private final CaseRepository caseRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final ProfileService profileService;
    private final ImpactService impactService;
    private final NotificationService notificationService;

    public MatchingService(MatchRepository matchRepository,
            CaseRepository caseRepository,
            LawyerProfileRepository lawyerProfileRepository,
            NgoProfileRepository ngoProfileRepository,
            ProfileService profileService,
            ImpactService impactService,
            NotificationService notificationService) {
        this.matchRepository = matchRepository;
        this.caseRepository = caseRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
        this.ngoProfileRepository = ngoProfileRepository;
        this.profileService = profileService;
        this.impactService = impactService;
        this.notificationService = notificationService;
    }

    @Transactional
    public void generateMatchesForCase(Long caseId) {
        Long safeCaseId = Objects.requireNonNull(caseId, "caseId is required");
        Case legalCase = caseRepository.findById(safeCaseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        List<LawyerProfile> lawyers = lawyerProfileRepository.findAll();
        List<NgoProfile> ngos = ngoProfileRepository.findAll();

        List<Match> matches = new ArrayList<>();
        Set<Long> existingProviderIds = matchRepository.findByLegalCase_Id(safeCaseId)
                .stream()
                .map(m -> m.getMatchedUser().getId())
                .collect(Collectors.toSet());

        for (LawyerProfile lawyer : lawyers) {
            if (lawyer.getUser() == null || lawyer.getUser().getId() == null) {
                continue;
            }

            if (existingProviderIds.contains(lawyer.getUser().getId())) {
                continue;
            }

            double score = calculateScore(
                    legalCase,
                    lawyer.getSpecialization(),
                    lawyer.getLocation(),
                    lawyer.isVerified(),
                    calculateAvailability(lawyer.getUser())
            );

            if (score > 40) {
                Match match = new Match();
                match.setLegalCase(legalCase);
                match.setMatchedUser(lawyer.getUser());
                match.setProviderId(lawyer.getUser().getId());
                match.setProviderType(Role.LAWYER.name());
                match.setScore(score);
                match.setMatchStatus("PENDING");
                matches.add(match);
            }
        }

        for (NgoProfile ngo : ngos) {
            if (ngo.getUser() == null || ngo.getUser().getId() == null) {
                continue;
            }

            if (existingProviderIds.contains(ngo.getUser().getId())) {
                continue;
            }

            double score = calculateScore(
                    legalCase,
                    ngo.getSpecialization(),
                    ngo.getLocation(),
                    ngo.isVerified(),
                    calculateAvailability(ngo.getUser())
            );

            if (score > 40) {
                Match match = new Match();
                match.setLegalCase(legalCase);
                match.setMatchedUser(ngo.getUser());
                match.setProviderId(ngo.getUser().getId());
                match.setProviderType(Role.NGO.name());
                match.setScore(score);
                match.setMatchStatus("PENDING");
                matches.add(match);
            }
        }

        List<Match> saved = matchRepository.saveAll(matches);

        for (Match match : saved) {
            notificationService.createNotification(
                    match.getMatchedUser().getId(),
                    "New case match available: " + match.getLegalCase().getTitle(),
                    "MATCH_CREATED"
            );
        }
    }

    private double calculateScore(Case legalCase,
            String specialization,
            String location,
            boolean verified,
            double availability) {
        double score = 0;

        String caseCategory = legalCase.getCategory() == null ? "" : legalCase.getCategory().toLowerCase();
        String providerSpec = specialization == null ? "" : specialization.toLowerCase();

        // Expertise fit is the primary weight.
        if (!caseCategory.isBlank() && providerSpec.contains(caseCategory)) {
            score += 45;
        } else if (!caseCategory.isBlank() && legalCase.getKeywords() != null
                && providerSpec.contains(legalCase.getKeywords().toLowerCase())) {
            score += 30;
        }

        if (location != null && location.equalsIgnoreCase(legalCase.getLocation())) {
            score += 25;
        } else if (location != null && legalCase.getLocation() != null
                && (location.toLowerCase().contains(legalCase.getLocation().toLowerCase())
                || legalCase.getLocation().toLowerCase().contains(location.toLowerCase()))) {
            score += 15;
        }

        // Availability contributes up to 20 points.
        score += availability;

        if (verified) {
            score += 10;
        }

        return score;
    }

    private double calculateAvailability(User providerUser) {
        long activeLoad = matchRepository.countByMatchedUserAndMatchStatusIn(
                providerUser,
                List.of("REQUESTED", "APPROVED", "ACCEPTED")
        );

        // Lower active load => higher availability score.
        return Math.max(0, 20 - (activeLoad * 4));
    }

    public List<MatchResponse> getMyMatches() {
        User currentUser = profileService.getCurrentUser();
        List<Match> matches;

        if (currentUser.getRole() == Role.CITIZEN) {
            List<Case> userCases = caseRepository.findByUser(currentUser);
            matches = new ArrayList<>();
            for (Case c : userCases) {
                matches.addAll(matchRepository.findByLegalCase_Id(c.getId()));
            }
        } else {
            matches = matchRepository.findByMatchedUser(currentUser);
        }

        return matches.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public MatchResponse updateMatchStatus(Long matchId, String status) {
        Match match = getAuthorizedMatch(matchId);
        String normalizedStatus = normalizeStatus(status);

        match.setMatchStatus(normalizedStatus);
        if (normalizedStatus.equals("ACCEPTED") || normalizedStatus.equals("APPROVED")) {
            match.getLegalCase().setStatus("MATCHED");
            caseRepository.save(Objects.requireNonNull(match.getLegalCase(), "match case is required"));
            impactService.logCaseTaken(match.getMatchedUser());
        }

        Match saved = matchRepository.save(match);

        notificationService.createNotification(
                match.getLegalCase().getUser().getId(),
                "Match status updated to " + normalizedStatus + " for case: " + match.getLegalCase().getTitle(),
                "MATCH_UPDATED"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public MatchResponse acceptMatch(Long matchId) {
        return updateMatchStatus(matchId, "ACCEPTED");
    }

    @Transactional
    public MatchResponse rejectMatch(Long matchId) {
        return updateMatchStatus(matchId, "REJECTED");
    }

    @Transactional
    public MatchResponse sendChatRequest(Long matchId, com.legalmatch.backend.dto.ChatRequestDTO request) {
        Match match = getAuthorizedMatch(matchId);
        User currentUser = profileService.getCurrentUser();

        // Only case owner should initiate chat request.
        if (!match.getLegalCase().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only case owner can send chat requests");
        }

        match.setMatchStatus("REQUESTED");
        match.setRequestMessage(request.getMessage());
        match.setAttachmentUrl(request.getAttachmentUrl());

        Match saved = matchRepository.save(match);

        notificationService.createNotification(
                match.getMatchedUser().getId(),
                "New chat request received for case: " + match.getLegalCase().getTitle(),
                "CHAT_REQUEST"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public MatchResponse approveChatRequest(Long matchId) {
        Match match = getAuthorizedMatch(matchId);
        User currentUser = profileService.getCurrentUser();

        if (!match.getMatchedUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only matched provider can approve chat request");
        }

        match.setMatchStatus("APPROVED");

        // Also update case status
        match.getLegalCase().setStatus("MATCHED");
        caseRepository.save(Objects.requireNonNull(match.getLegalCase(), "match case is required"));

        // Log impact
        impactService.logCaseTaken(match.getMatchedUser());

        Match saved = matchRepository.save(match);

        notificationService.createNotification(
                match.getLegalCase().getUser().getId(),
                "Your chat request was approved for case: " + match.getLegalCase().getTitle(),
                "CHAT_APPROVED"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public MatchResponse rejectChatRequest(Long matchId) {
        Match match = getAuthorizedMatch(matchId);
        match.setMatchStatus("REJECTED");
        Match saved = matchRepository.save(match);

        notificationService.createNotification(
                match.getLegalCase().getUser().getId(),
                "Your request was rejected for case: " + match.getLegalCase().getTitle(),
                "CHAT_REJECTED"
        );

        return mapToResponse(saved);
    }

    @Transactional
    public MatchResponse updateChatApproval(Long matchId, boolean approve) {
        Match match = getAuthorizedMatch(matchId);
        User currentUser = profileService.getCurrentUser();

        switch (currentUser.getRole()) {
            case LAWYER ->
                match.setLawyerApprovedChat(approve);
            case NGO ->
                match.setNgoApprovedChat(approve);
            default ->
                throw new RuntimeException("Only Lawyers and NGOs can approve chat");
        }

        Match saved = matchRepository.save(match);

        notificationService.createNotification(
                match.getLegalCase().getUser().getId(),
                "Provider chat approval updated for case: " + match.getLegalCase().getTitle(),
                "CHAT_APPROVAL"
        );

        return mapToResponse(saved);
    }

    public Match getAuthorizedMatch(Long matchId) {
        Long safeMatchId = Objects.requireNonNull(matchId, "matchId is required");
        Match match = matchRepository.findById(safeMatchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        User currentUser = profileService.getCurrentUser();
        boolean isProvider = match.getMatchedUser().getId().equals(currentUser.getId());
        boolean isCaseOwner = match.getLegalCase().getUser().getId().equals(currentUser.getId());

        if (!isProvider && !isCaseOwner) {
            throw new RuntimeException("Unauthorized match access");
        }

        return match;
    }

    public Match getAuthorizedAcceptedMatch(Long matchId) {
        Match match = getAuthorizedMatch(matchId);
        String status = normalizeStatus(match.getMatchStatus());

        // Allow chat/appointments only after provider acceptance.
        if (!("ACCEPTED".equals(status) || "APPROVED".equals(status))) {
            throw new RuntimeException("Match is not accepted for communication");
        }

        return match;
    }

    private String normalizeStatus(String status) {
        if (status == null) {
            return "PENDING";
        }
        String normalized = status.toUpperCase(Locale.ROOT);

        if ("APPROVE".equals(normalized)) {
            return "APPROVED";
        }
        if ("ACCEPT".equals(normalized)) {
            return "ACCEPTED";
        }
        return normalized;
    }

    private MatchResponse mapToResponse(Match match) {
        String specialization = "";
        User matchedUser = match.getMatchedUser();
        if (matchedUser.getRole() == Role.LAWYER && matchedUser.getLawyerProfile() != null) {
            specialization = matchedUser.getLawyerProfile().getSpecialization();
        } else if (matchedUser.getRole() == Role.NGO && matchedUser.getNgoProfile() != null) {
            specialization = matchedUser.getNgoProfile().getSpecialization();
        }

        MatchResponse response = new MatchResponse();
        response.setMatchId(match.getMatchId());
        response.setCaseId(match.getLegalCase().getId());
        response.setCaseTitle(match.getLegalCase().getTitle());
        response.setMatchedUserId(matchedUser.getId());
        response.setMatchedUserName(matchedUser.getName());
        response.setMatchedUserRole(matchedUser.getRole().toString());
        response.setProviderId(match.getProviderId() != null ? match.getProviderId() : matchedUser.getId());
        response.setProviderType(match.getProviderType() != null ? match.getProviderType() : matchedUser.getRole().toString());
        response.setSpecialization(specialization);
        response.setMatchStatus(match.getMatchStatus());
        response.setLawyerApprovedChat(match.isLawyerApprovedChat());
        response.setNgoApprovedChat(match.isNgoApprovedChat());
        response.setScore(match.getScore());
        response.setRequestMessage(match.getRequestMessage());
        response.setAttachmentUrl(match.getAttachmentUrl());
        return response;
    }
}
