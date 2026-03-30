package com.legalmatch.backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.service.CaseService;

@RestController
@RequestMapping({"/api/cases", "/cases"})
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

    @PreAuthorize("hasAnyRole('CITIZEN','LAWYER','NGO','ADMIN')")
    @GetMapping("/{id}")
    public CaseResponse getCaseById(@PathVariable Long id,
            Authentication authentication) {

        return caseService.getCaseById(id, authentication.getName());
    }
}
