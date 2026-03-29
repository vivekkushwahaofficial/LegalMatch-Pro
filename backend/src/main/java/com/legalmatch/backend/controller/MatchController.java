package com.legalmatch.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.legalmatch.backend.dto.MatchResponse;
import com.legalmatch.backend.service.MatchingService;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchingService matchingService;

    public MatchController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @PostMapping("/generate/{caseId}")
    public ResponseEntity<String> generateMatches(@PathVariable Long caseId) {
        matchingService.generateMatchesForCase(caseId);
        return ResponseEntity.ok("Match generation initiated for case " + caseId);
    }

    @GetMapping("/my")
    public ResponseEntity<List<MatchResponse>> getMyMatches() {
        return ResponseEntity.ok(matchingService.getMyMatches());
    }

    @PostMapping("/{matchId}/request")
    public ResponseEntity<MatchResponse> sendRequest(@PathVariable Long matchId, @RequestBody com.legalmatch.backend.dto.ChatRequestDTO request) {
        return ResponseEntity.ok(matchingService.sendChatRequest(matchId, request));
    }

    @PutMapping("/{matchId}/accept")
    public ResponseEntity<MatchResponse> acceptMatch(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchingService.acceptMatch(matchId));
    }

    @PutMapping("/{matchId}/approve")
    public ResponseEntity<MatchResponse> approveRequest(@PathVariable Long matchId) {
        // Backward-compatible alias used by existing frontend.
        return ResponseEntity.ok(matchingService.approveChatRequest(matchId));
    }

    @PutMapping("/{matchId}/reject")
    public ResponseEntity<MatchResponse> rejectRequest(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchingService.rejectChatRequest(matchId));
    }

    @PutMapping("/{matchId}/approve-chat")
    public ResponseEntity<MatchResponse> approveChat(@PathVariable Long matchId, @RequestParam boolean approve) {
        return ResponseEntity.ok(matchingService.updateChatApproval(matchId, approve));
    }
}
