package com.legalmatch.backend.service;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.UserRepository;

@Service
public class CaseService {

    private static final Set<String> ALLOWED_CASE_STATUSES = Set.of("SUBMITTED", "IN_REVIEW", "MATCHED");

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;
    private final NotificationService notificationService;

    public CaseService(CaseRepository caseRepository,
            UserRepository userRepository,
            MatchingService matchingService,
            NotificationService notificationService) {
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.matchingService = matchingService;
        this.notificationService = notificationService;
    }

    // convert entity → DTO
    private CaseResponse mapToResponse(Case c) {

        CaseResponse response = new CaseResponse();
        User caseOwner = c.getUser();

        response.setId(c.getId());
        response.setTitle(c.getTitle());
        response.setDescription(c.getDescription());
        response.setCategory(c.getCategory());
        response.setStatus(c.getStatus());
        response.setCreatedAt(c.getCreatedAt());
        response.setUpdatedAt(c.getUpdatedAt());
        // Null-safe mapping: legacy/bad rows may have no linked user.
        response.setUserEmail(caseOwner != null ? caseOwner.getEmail() : "N/A");
        response.setLocation(c.getLocation());
        response.setKeywords(c.getKeywords());
        response.setDateTime(c.getDateTime());
        response.setContactInfo(c.getContactInfo());
        response.setOtherPartyName(c.getOtherPartyName());
        response.setOtherPartyLocation(c.getOtherPartyLocation());
        response.setOtherPartyContact(c.getOtherPartyContact());
        response.setOtherPartyRepresentative(c.getOtherPartyRepresentative());
        response.setInvestigatingOfficer(c.getInvestigatingOfficer());
        response.setWitnesses(c.getWitnesses());

        return response;
    }

    // create case
    public CaseResponse createCase(Case caseRequest, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Defense-in-depth: only citizens can submit new cases.
        if (user.getRole() != Role.CITIZEN) {
            throw new RuntimeException("Only citizens can submit cases");
        }

        caseRequest.setUser(user);
        caseRequest.setStatus("SUBMITTED");

        Case savedCase = caseRepository.save(caseRequest);

        notificationService.createNotification(
                user.getId(),
                "Case registered successfully: " + savedCase.getTitle(),
                "CASE_REGISTERED"
        );

        for (User admin : userRepository.findByRole(Role.ADMIN)) {
            notificationService.createNotification(
                    admin.getId(),
                    "New case submitted by " + user.getName() + ": " + savedCase.getTitle(),
                    "CASE_SUBMITTED"
            );
        }

        // Auto-generate matches based on the new case
        matchingService.generateMatchesForCase(savedCase.getId());

        return mapToResponse(savedCase);
    }

    // get my cases
    public List<CaseResponse> getMyCases(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return caseRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // get all cases
    public List<CaseResponse> getAllCases() {

        return caseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // update case status
    public CaseResponse updateCaseStatus(Long id, String status) {

        Case existingCase = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        existingCase.setStatus(normalizeCaseStatus(status));

        Case updatedCase = caseRepository.save(existingCase);

        return mapToResponse(updatedCase);
    }

    // search cases
    public List<CaseResponse> searchByStatus(String status) {

        return caseRepository.findByStatus(normalizeCaseStatus(status))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private String normalizeCaseStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new RuntimeException("Case status is required");
        }

        String normalized = status.trim().toUpperCase(Locale.ROOT).replace('-', '_').replace(' ', '_');
        if ("INREVIEW".equals(normalized)) {
            normalized = "IN_REVIEW";
        }

        if (!ALLOWED_CASE_STATUSES.contains(normalized)) {
            throw new RuntimeException("Invalid case status: " + status);
        }

        return normalized;
    }

    public CaseResponse getCaseById(Long id, String requesterEmail) {

        Case c = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User caseOwner = c.getUser();

        // Citizens can only read their own cases. Legal professionals and admins may read case details.
        // Null-safe owner check to avoid NPE on orphaned case rows.
        if (requester.getRole() == Role.CITIZEN
                && (caseOwner == null || !caseOwner.getId().equals(requester.getId()))) {
            throw new RuntimeException("Not authorized to view this case");
        }

        return mapToResponse(c);
    }
}
