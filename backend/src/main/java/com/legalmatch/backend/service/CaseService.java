package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;

    public CaseService(CaseRepository caseRepository, UserRepository userRepository, MatchingService matchingService) {
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.matchingService = matchingService;
    }

    // convert entity → DTO
    private CaseResponse mapToResponse(Case c) {

        CaseResponse response = new CaseResponse();

        response.setId(c.getId());
        response.setTitle(c.getTitle());
        response.setDescription(c.getDescription());
        response.setCategory(c.getCategory());
        response.setStatus(c.getStatus());
        response.setCreatedAt(c.getCreatedAt());
        response.setUpdatedAt(c.getUpdatedAt());
        response.setUserEmail(c.getUser().getEmail());
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

        caseRequest.setUser(user);
        caseRequest.setStatus("SUBMITTED");

        Case savedCase = caseRepository.save(caseRequest);

        // Auto-generate matches based on the new case
        matchingService.generateMatchesForCase(savedCase.getId());

        return mapToResponse(savedCase);
    }

    // get my cases
    public List<CaseResponse> getMyCases(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return caseRepository.findByUser(user)
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

        existingCase.setStatus(status);

        Case updatedCase = caseRepository.save(existingCase);

        return mapToResponse(updatedCase);
    }

    // search cases
    public List<CaseResponse> searchByStatus(String status) {

        return caseRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CaseResponse getCaseById(Long id) {

        Case c = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        return mapToResponse(c);
    }
}