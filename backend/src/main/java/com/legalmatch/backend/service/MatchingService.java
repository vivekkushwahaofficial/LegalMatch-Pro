package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.*;
import com.legalmatch.backend.dto.MatchResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final MatchRepository matchRepository;
    private final CaseRepository caseRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final ProfileService profileService;
    private final ImpactService impactService;

    public MatchingService(MatchRepository matchRepository,
                           CaseRepository caseRepository,
                           LawyerProfileRepository lawyerProfileRepository,
                           NgoProfileRepository ngoProfileRepository,
                           ProfileService profileService,
                           ImpactService impactService) {
        this.matchRepository = matchRepository;
        this.caseRepository = caseRepository;
        this.lawyerProfileRepository = lawyerProfileRepository;
        this.ngoProfileRepository = ngoProfileRepository;
        this.profileService = profileService;
        this.impactService = impactService;
    }

    @Transactional
    public void generateMatchesForCase(Long caseId) {
        Case legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        List<LawyerProfile> lawyers = lawyerProfileRepository.findAll();
        List<NgoProfile> ngos = ngoProfileRepository.findAll();

        List<Match> matches = new ArrayList<>();

        for (LawyerProfile lawyer : lawyers) {
            double score = calculateScore(legalCase, lawyer.getSpecialization(), lawyer.getLocation(), lawyer.isVerified());
            if (score > 40) {
                Match match = new Match();
                match.setLegalCase(legalCase);
                match.setMatchedUser(lawyer.getUser());
                match.setScore(score);
                match.setMatchStatus("PENDING");
                matches.add(match);
            }
        }

        for (NgoProfile ngo : ngos) {
            double score = calculateScore(legalCase, ngo.getSpecialization(), ngo.getLocation(), ngo.isVerified());
            if (score > 40) {
                Match match = new Match();
                match.setLegalCase(legalCase);
                match.setMatchedUser(ngo.getUser());
                match.setScore(score);
                match.setMatchStatus("PENDING");
                matches.add(match);
            }
        }

        matchRepository.saveAll(matches);
    }

    private double calculateScore(Case legalCase, String specialization, String location, boolean verified) {
        double score = 0;
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
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        match.setMatchStatus(status);
        if (status.equals("ACCEPTED")) {
            match.getLegalCase().setStatus("MATCHED");
            caseRepository.save(match.getLegalCase());
            impactService.logCaseTaken(match.getMatchedUser());
        }
        return mapToResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse sendChatRequest(Long matchId, com.legalmatch.backend.dto.ChatRequestDTO request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        match.setMatchStatus("REQUESTED");
        match.setRequestMessage(request.getMessage());
        match.setAttachmentUrl(request.getAttachmentUrl());
        return mapToResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse approveChatRequest(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        match.setMatchStatus("APPROVED");
        
        // Also update case status
        match.getLegalCase().setStatus("MATCHED");
        caseRepository.save(match.getLegalCase());
        
        // Log impact
        impactService.logCaseTaken(match.getMatchedUser());
        
        return mapToResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse rejectChatRequest(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        match.setMatchStatus("REJECTED");
        return mapToResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse updateChatApproval(Long matchId, boolean approve) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        User currentUser = profileService.getCurrentUser();

        if (currentUser.getRole() == Role.LAWYER) {
            match.setLawyerApprovedChat(approve);
        } else if (currentUser.getRole() == Role.NGO) {
            match.setNgoApprovedChat(approve);
        } else {
            throw new RuntimeException("Only Lawyers and NGOs can approve chat");
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

        MatchResponse response = new MatchResponse();
        response.setMatchId(match.getMatchId());
        response.setCaseId(match.getLegalCase().getId());
        response.setCaseTitle(match.getLegalCase().getTitle());
        response.setMatchedUserId(matchedUser.getId());
        response.setMatchedUserName(matchedUser.getName());
        response.setMatchedUserRole(matchedUser.getRole().toString());
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
