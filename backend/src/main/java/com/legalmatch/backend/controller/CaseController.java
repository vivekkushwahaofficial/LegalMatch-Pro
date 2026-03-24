package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.service.CaseService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping
    public CaseResponse createCase(@RequestBody Case caseRequest,
                                   Authentication authentication) {

        return caseService.createCase(caseRequest, authentication.getName());
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @GetMapping("/my")
    public List<CaseResponse> getMyCases(Authentication authentication) {

        return caseService.getMyCases(authentication.getName());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public List<CaseResponse> getAllCases() {

        return caseService.getAllCases();
    }

    @PreAuthorize("hasAnyRole('ADMIN','LAWYER')")
    @PutMapping("/{id}/status")
    public CaseResponse updateCaseStatus(@PathVariable Long id,
                                         @RequestParam String status) {

        return caseService.updateCaseStatus(id, status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public List<CaseResponse> searchByStatus(@RequestParam String status) {

        return caseService.searchByStatus(status);
    }

    @GetMapping("/{id}")
    public CaseResponse getCaseById(@PathVariable Long id) {

        return caseService.getCaseById(id);
    }
}