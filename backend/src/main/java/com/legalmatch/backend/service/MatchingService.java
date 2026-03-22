package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.*;
import com.legalmatch.backend.dto.MatchResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final MatchRepository matchRepository;
    private final CaseRepository caseRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final ProfileService profileService;

    @Transactional
    public void generateMatchesForCase(Long caseId) {
        Case legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        // Get all lawyers and NGOs
        List<LawyerProfile> lawyers = lawyerProfileRepository.findAll();
        List<NgoProfile> ngos = ngoProfileRepository.findAll();

        List<Match> matches = new ArrayList<>();

        for (LawyerProfile lawyer : lawyers) {
            double score = calculateScore(legalCase, lawyer.getSpecialization(), lawyer.getLocation(), lawyer.isVerified());
            if (score > 40) { // Threshold
                matches.add(Match.builder()
                        .legalCase(legalCase)
                        .matchedUser(lawyer.getUser())
                        .score(score)
                        .matchStatus("PENDING")
                        .build());
            }
        }

        for (NgoProfile ngo : ngos) {
            double score = calculateScore(legalCase, ngo.getSpecialization(), ngo.getLocation(), ngo.isVerified());
            if (score > 40) {
                matches.add(Match.builder()
                        .legalCase(legalCase)
                        .matchedUser(ngo.getUser())
                        .score(score)
                        .matchStatus("PENDING")
                        .build());
            }
        }

        matchRepository.saveAll(matches);
    }

    private double calculateScore(Case legalCase, String specialization, String location, boolean verified) {
        double score = 0;
        // Simple scoring logic
        if (specialization != null && specialization.toLowerCase().contains(legalCase.getCategory().toLowerCase())) {
            score += 50;
        }
        if (location != null && location.equalsIgnoreCase(legalCase.getLocation())) {
            score += 30;
        }
        if (verified) {
            score += 20;
        }
        return score;
    }

    public List<MatchResponse> getMyMatches() {
        User currentUser = profileService.getCurrentUser();
        List<Match> matches;

        if (currentUser.getRole() == Role.CITIZEN) {
            // Find matches for all cases submitted by this citizen
            List<Case> userCases = caseRepository.findByUser(currentUser);
            matches = new ArrayList<>();
            for (Case c : userCases) {
                matches.addAll(matchRepository.findByLegalCase_Id(c.getId()));
            }
        } else {
            // Find matches assigned to this lawyer/ngo
            matches = matchRepository.findByMatchedUser(currentUser);
        }

        return matches.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public MatchResponse updateMatchStatus(Long matchId, String status) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        match.setMatchStatus(status);
        if (status.equals("ACCEPTED")) {
            match.getLegalCase().setStatus("MATCHED");
            caseRepository.save(match.getLegalCase());
        }
        return mapToResponse(matchRepository.save(match));
    }

    private MatchResponse mapToResponse(Match match) {
        String specialization = "";
        User matchedUser = match.getMatchedUser();
        if (matchedUser.getRole() == Role.LAWYER && matchedUser.getLawyerProfile() != null) {
            specialization = matchedUser.getLawyerProfile().getSpecialization();
        } else if (matchedUser.getRole() == Role.NGO && matchedUser.getNgoProfile() != null) {
            specialization = matchedUser.getNgoProfile().getSpecialization();
        }

        return MatchResponse.builder()
                .matchId(match.getMatchId())
                .caseId(match.getLegalCase().getId())
                .caseTitle(match.getLegalCase().getTitle())
                .matchedUserId(matchedUser.getId())
                .matchedUserName(matchedUser.getName())
                .matchedUserRole(matchedUser.getRole().toString())
                .specialization(specialization)
                .matchStatus(match.getMatchStatus())
                .score(match.getScore())
                .build();
    }
}
