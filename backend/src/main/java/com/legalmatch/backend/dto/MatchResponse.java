package com.legalmatch.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponse {
    private Long matchId;
    private Long caseId;
    private String caseTitle;
    private Long matchedUserId;
    private String matchedUserName;
    private String matchedUserRole;
    private String specialization;
    private String matchStatus;
    private double score;
}
