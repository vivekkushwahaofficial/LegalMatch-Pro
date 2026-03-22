package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.MatchResponse;
import com.legalmatch.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchingService matchingService;

    @PostMapping("/generate/{caseId}")
    public ResponseEntity<String> generateMatches(@PathVariable Long caseId) {
        matchingService.generateMatchesForCase(caseId);
        return ResponseEntity.ok("Match generation initiated for case " + caseId);
    }

    @GetMapping("/my")
    public ResponseEntity<List<MatchResponse>> getMyMatches() {
        return ResponseEntity.ok(matchingService.getMyMatches());
    }

    @PutMapping("/{matchId}/accept")
    public ResponseEntity<MatchResponse> acceptMatch(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchingService.updateMatchStatus(matchId, "ACCEPTED"));
    }

    @PutMapping("/{matchId}/reject")
    public ResponseEntity<MatchResponse> rejectMatch(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchingService.updateMatchStatus(matchId, "REJECTED"));
    }

    @PutMapping("/{matchId}/approve-chat")
    public ResponseEntity<MatchResponse> approveChat(@PathVariable Long matchId, @RequestParam boolean approve) {
        return ResponseEntity.ok(matchingService.updateChatApproval(matchId, approve));
    }
}
