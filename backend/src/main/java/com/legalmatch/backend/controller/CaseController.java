package com.legalmatch.backend.controller;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    @PostMapping
    public Case createCase(@RequestBody Case caseRequest, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        caseRequest.setUser(user);
        caseRequest.setStatus("SUBMITTED");

        caseRequest.setCreatedAt(LocalDateTime.now());
        caseRequest.setUpdatedAt(LocalDateTime.now());

        return caseRepository.save(caseRequest);
    }
    @GetMapping("/my")
    public Iterable<Case> getMyCases(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return caseRepository.findByUser(user);
    }
}
