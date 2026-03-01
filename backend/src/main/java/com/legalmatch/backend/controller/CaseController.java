package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    // Citizen can create case
    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping
    public CaseResponse createCase(@RequestBody Case caseRequest,
                                   Authentication authentication) {

        // 1️⃣ Get logged-in user email from JWT
        String email = authentication.getName();

        // 2️⃣ Fetch user from database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3️⃣ Assign case to logged-in citizen
        caseRequest.setUser(user);

        // 4️⃣ Set default values
        caseRequest.setStatus("SUBMITTED");
        caseRequest.setCreatedAt(LocalDateTime.now());
        caseRequest.setUpdatedAt(LocalDateTime.now());

        // 5️⃣ Save case
        Case savedCase = caseRepository.save(caseRequest);

        // 6️⃣ Convert entity to DTO (VERY IMPORTANT)
        CaseResponse response = new CaseResponse();
        response.setId(savedCase.getId());
        response.setTitle(savedCase.getTitle());
        response.setDescription(savedCase.getDescription());
        response.setCategory(savedCase.getCategory());
        response.setStatus(savedCase.getStatus());
        response.setCreatedAt(savedCase.getCreatedAt());
        response.setUpdatedAt(savedCase.getUpdatedAt());
        response.setUserEmail(savedCase.getUser().getEmail());

        return response;
    }

    // Admin can see all cases
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Iterable<Case> getAllCases() {
        return caseRepository.findAll();
    }

    // Admin or Lawyer can update case status
    @PreAuthorize("hasAnyRole('ADMIN','LAWYER')")
    @PutMapping("/{id}/status")
    public Case updateCaseStatus(@PathVariable Long id,
                                 @RequestParam String status) {

        Case existingCase = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        existingCase.setStatus(status);
        existingCase.setUpdatedAt(LocalDateTime.now());

        return caseRepository.save(existingCase);
    }

    // Search cases by status
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public Iterable<Case> searchByStatus(@RequestParam String status) {
        return caseRepository.findByStatus(status);
    }
}