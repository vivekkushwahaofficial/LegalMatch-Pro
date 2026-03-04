package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    // Citizen create case
    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping
    public CaseResponse createCase(@RequestBody Case caseRequest,
                                   Authentication authentication) {

        return caseService.createCase(caseRequest, authentication.getName());
    }

    // Citizen see their cases
    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/my")
    public List<CaseResponse> getMyCases(Authentication authentication) {

        return caseService.getMyCases(authentication.getName());
    }

    // Admin see all cases
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<CaseResponse> getAllCases() {

        return caseService.getAllCases();
    }

    // Update case status
    @PreAuthorize("hasAnyRole('ADMIN','LAWYER')")
    @PutMapping("/{id}/status")
    public CaseResponse updateCaseStatus(@PathVariable Long id,
                                         @RequestParam String status) {

        return caseService.updateCaseStatus(id, status);
    }

    // Search cases by status
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public List<CaseResponse> searchByStatus(@RequestParam String status) {

        return caseService.searchByStatus(status);
    }
}